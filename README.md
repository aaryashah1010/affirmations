# Affirmation App

A comprehensive affirmation and wellness application built with React, Node.js, Supabase, and Gemini AI. Users can track their problems, receive personalized affirmations, and monitor their progress over time.

## Features

- **User Authentication**: Secure signup and login with Supabase Auth
- **Problem Tracking**: Categorize and describe personal challenges
- **AI-Powered Affirmations**: Generate personalized affirmations using Gemini AI
- **Progress Monitoring**: Track mood improvements and session statistics
- **Session Management**: Record and review affirmation practice sessions
- **Responsive Design**: Clean, modern UI that works on all devices

## Tech Stack

### Frontend
- React 19 with Vite
- React Router for navigation
- Tailwind CSS for styling
- Lucide React for icons
- Axios for API calls

### Backend
- Node.js with Express
- Supabase for database and authentication
- Gemini AI for affirmation generation
- PostgreSQL database
- JWT authentication

## Project Structure

```
affirmation2/
├── Backend/                    # Node.js backend
│   ├── config/                 # Database and AI configuration
│   ├── controllers/            # API route handlers
│   ├── middleware/             # Authentication middleware
│   ├── routes/                 # API routes
│   ├── services/               # Business logic (AI service)
│   ├── database/               # Database schema
│   └── index.js               # Server entry point
│
├── Frontend/                   # React frontend
│   ├── src/
│   │   ├── api/                # API client functions
│   │   ├── modules/            # Feature-based modules
│   │   │   ├── auth/           # Authentication module
│   │   │   └── dashboard/       # Dashboard module
│   │   ├── routes/             # App routing
│   │   ├── shared/             # Shared components and utilities
│   │   └── styles/             # Global styles
│   └── package.json
│
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- Google AI API key (for Gemini)

### 1. Backend Setup

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp env.example .env
   ```

4. Configure your environment variables in `.env`:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   GEMINI_API_KEY=your_gemini_api_key
   PORT=5000
   NODE_ENV=development
   ```

5. Set up the database:
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Run the SQL script from `Backend/database/schema.sql`

6. Start the backend server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. Navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp env.example .env
   ```

4. Configure your environment variables in `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Supabase Configuration

1. Create a new Supabase project
2. Go to Settings > API to get your project URL and keys
3. Enable Row Level Security (RLS) is already configured in the schema
4. Set up authentication providers in Authentication > Settings

### 4. Gemini AI Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add the key to your backend `.env` file

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/signout` - User logout

### Problems
- `GET /api/problems` - Get user problems
- `POST /api/problems` - Create new problem
- `GET /api/problems/:id` - Get specific problem
- `PUT /api/problems/:id` - Update problem
- `DELETE /api/problems/:id` - Delete problem
- `GET /api/problems/categories` - Get problem categories

### Affirmations
- `GET /api/affirmations/problem/:problemId` - Get affirmations for problem
- `GET /api/affirmations/favorites` - Get favorite affirmations
- `PUT /api/affirmations/:id/favorite` - Toggle favorite status
- `POST /api/affirmations/problem/:problemId/generate` - Generate new affirmation

### Sessions
- `POST /api/sessions` - Create new session
- `GET /api/sessions` - Get user sessions
- `GET /api/sessions/stats` - Get session statistics
- `PUT /api/sessions/:id` - Update session

## Database Schema

The application uses the following main tables:

- **users**: User profiles and information
- **problem_categories**: Predefined problem categories
- **problems**: User-submitted problems and challenges
- **affirmations**: AI-generated affirmations and solutions
- **sessions**: Affirmation practice sessions
- **user_progress**: User interaction tracking

## Features in Detail

### Problem Categories
- Financial (💰)
- Mental (🧠)
- Physical (💪)
- Emotional (❤️)
- Career (💼)
- Spiritual (🕊️)

### AI Integration
The app uses Gemini AI to generate:
- Personalized affirmations
- Practical solutions
- Motivational statements
- Context-aware responses

### Progress Tracking
- Session duration tracking
- Mood before/after tracking
- Consistency metrics
- Growth visualization

## Development

### Running in Development Mode

1. Start the backend:
   ```bash
   cd Backend && npm run dev
   ```

2. Start the frontend:
   ```bash
   cd Frontend && npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

1. Build the frontend:
   ```bash
   cd Frontend && npm run build
   ```

2. Start the backend in production:
   ```bash
   cd Backend && npm start
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.
