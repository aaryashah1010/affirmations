import { supabaseAdmin } from '../config/database.js';
import { AIService } from '../services/aiService.js';

export class ProblemController {
  static async createProblem(req, res) {
    try {
      const userId = req.user.id;
      const { category_id, title, description, severity, is_public } = req.body;

      if (!category_id || !title || !description) {
        return res.status(400).json({ 
          error: 'Category, title, and description are required' 
        });
      }

      // Create the problem
      const { data: problem, error: problemError } = await supabaseAdmin
        .from('problems')
        .insert({
          user_id: userId,
          category_id,
          title,
          description,
          severity: severity || 5,
          is_public: is_public || false
        })
        .select(`
          *,
          problem_categories (
            name,
            description,
            icon
          )
        `)
        .single();

      if (problemError) {
        return res.status(400).json({ error: problemError.message });
      }

      // Generate affirmations using AI
      try {
        console.log('Calling AI service with:', {
          category: problem.problem_categories.name,
          title,
          description,
          severity: problem.severity
        });
        
        const aiResponse = await AIService.generateAffirmations({
          category: problem.problem_categories.name,
          title,
          description,
          severity: problem.severity
        });
        
        console.log('AI Response received:', aiResponse);

        // Store affirmations in database
        const affirmationsToInsert = [
          ...aiResponse.affirmations.map(content => ({
            problem_id: problem.id,
            content,
            type: 'positive'
          })),
          ...aiResponse.solutions.map(content => ({
            problem_id: problem.id,
            content,
            type: 'solution'
          })),
          ...aiResponse.motivational.map(content => ({
            problem_id: problem.id,
            content,
            type: 'motivational'
          }))
        ];

        const { data: affirmations, error: affirmationsError } = await supabaseAdmin
          .from('affirmations')
          .insert(affirmationsToInsert)
          .select();

        if (affirmationsError) {
          console.error('Failed to store affirmations:', affirmationsError);
        }

        // Return the AI response directly for immediate display
        const formattedAffirmations = [
          ...aiResponse.affirmations.map(content => ({ content, type: 'positive' })),
          ...aiResponse.solutions.map(content => ({ content, type: 'solution' })),
          ...aiResponse.motivational.map(content => ({ content, type: 'motivational' }))
        ];

        res.status(201).json({
          problem,
          affirmations: formattedAffirmations
        });

      } catch (aiError) {
        console.error('AI generation failed:', aiError);
        
        // Fallback: Generate sample affirmations if AI fails
        const fallbackAffirmations = [
          { content: "I am capable of overcoming this challenge", type: 'positive' },
          { content: "I have the strength to work through this situation", type: 'positive' },
          { content: "I am worthy of positive change and growth", type: 'positive' },
          { content: "I trust in my ability to find solutions", type: 'positive' },
          { content: "I am resilient and can handle whatever comes my way", type: 'positive' },
          { content: "Break down the problem into smaller, manageable steps", type: 'solution' },
          { content: "Seek support from trusted friends, family, or professionals", type: 'solution' },
          { content: "Practice self-care and maintain a positive mindset", type: 'solution' },
          { content: "Every challenge is an opportunity for growth and learning", type: 'motivational' },
          { content: "You have overcome difficulties before and you can do it again", type: 'motivational' }
        ];
        
        res.status(201).json({
          problem,
          affirmations: fallbackAffirmations
        });
      }

    } catch (error) {
      console.error('Create problem error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getUserProblems(req, res) {
    try {
      const userId = req.user.id;
      const { category_id, limit = 20, offset = 0 } = req.query;

      let query = supabaseAdmin
        .from('problems')
        .select(`
          *,
          problem_categories (
            name,
            description,
            icon
          ),
          affirmations (
            id,
            content,
            type,
            is_favorite,
            created_at
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (category_id) {
        query = query.eq('category_id', category_id);
      }

      const { data: problems, error } = await query;

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json({ problems });

    } catch (error) {
      console.error('Get user problems error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getProblemById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const { data: problem, error } = await supabaseAdmin
        .from('problems')
        .select(`
          *,
          problem_categories (
            name,
            description,
            icon
          ),
          affirmations (
            id,
            content,
            type,
            is_favorite,
            created_at
          )
        `)
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error) {
        return res.status(404).json({ error: 'Problem not found' });
      }

      res.json({ problem });

    } catch (error) {
      console.error('Get problem error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateProblem(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { title, description, severity, is_public } = req.body;

      const { data: problem, error } = await supabaseAdmin
        .from('problems')
        .update({
          title,
          description,
          severity,
          is_public,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', userId)
        .select(`
          *,
          problem_categories (
            name,
            description,
            icon
          )
        `)
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json({ problem });

    } catch (error) {
      console.error('Update problem error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteProblem(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const { error } = await supabaseAdmin
        .from('problems')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json({ message: 'Problem deleted successfully' });

    } catch (error) {
      console.error('Delete problem error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getProblemCategories(req, res) {
    try {
      const { data: categories, error } = await supabaseAdmin
        .from('problem_categories')
        .select('*')
        .order('name');

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json({ categories });

    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
