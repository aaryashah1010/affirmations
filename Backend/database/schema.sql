-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create problem categories table
CREATE TABLE public.problem_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default problem categories
INSERT INTO public.problem_categories (name, description, icon) VALUES
('financial', 'Money, wealth, and financial stability', '💰'),
('mental', 'Mental health, anxiety, depression, stress', '🧠'),
('physical', 'Physical health, fitness, body image', '💪'),
('emotional', 'Emotions, relationships, self-esteem', '❤️'),
('career', 'Work, professional growth, job satisfaction', '💼'),
('spiritual', 'Spirituality, purpose, meaning', '🕊️');

-- Create problems table
CREATE TABLE public.problems (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES public.problem_categories(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    severity INTEGER CHECK (severity >= 1 AND severity <= 10) DEFAULT 5,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create affirmations table
CREATE TABLE public.affirmations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    problem_id UUID REFERENCES public.problems(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'positive', -- positive, solution, action
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user progress table
CREATE TABLE public.user_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    problem_id UUID REFERENCES public.problems(id) ON DELETE CASCADE NOT NULL,
    affirmation_id UUID REFERENCES public.affirmations(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL, -- viewed, liked, practiced, completed
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sessions table for tracking daily practice
CREATE TABLE public.sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    problem_id UUID REFERENCES public.problems(id) ON DELETE CASCADE NOT NULL,
    affirmations_practiced UUID[] DEFAULT '{}',
    duration_minutes INTEGER DEFAULT 0,
    mood_before INTEGER CHECK (mood_before >= 1 AND mood_before <= 10),
    mood_after INTEGER CHECK (mood_after >= 1 AND mood_after <= 10),
    notes TEXT,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_problems_user_id ON public.problems(user_id);
CREATE INDEX idx_problems_category_id ON public.problems(category_id);
CREATE INDEX idx_affirmations_problem_id ON public.affirmations(problem_id);
CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX idx_sessions_completed_at ON public.sessions(completed_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_problems_updated_at BEFORE UPDATE ON public.problems
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Users can only see and modify their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Problems policies
CREATE POLICY "Users can view own problems" ON public.problems
    FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can insert own problems" ON public.problems
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own problems" ON public.problems
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own problems" ON public.problems
    FOR DELETE USING (auth.uid() = user_id);

-- Affirmations policies
CREATE POLICY "Users can view affirmations for accessible problems" ON public.affirmations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.problems 
            WHERE problems.id = affirmations.problem_id 
            AND (problems.user_id = auth.uid() OR problems.is_public = true)
        )
    );

CREATE POLICY "Users can insert affirmations for own problems" ON public.affirmations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.problems 
            WHERE problems.id = affirmations.problem_id 
            AND problems.user_id = auth.uid()
        )
    );

-- User progress policies
CREATE POLICY "Users can manage own progress" ON public.user_progress
    FOR ALL USING (auth.uid() = user_id);

-- Sessions policies
CREATE POLICY "Users can manage own sessions" ON public.sessions
    FOR ALL USING (auth.uid() = user_id);

-- Problem categories are public read-only
CREATE POLICY "Problem categories are publicly readable" ON public.problem_categories
    FOR SELECT USING (true);
