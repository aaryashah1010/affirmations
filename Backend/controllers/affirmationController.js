import { supabaseAdmin } from '../config/database.js';
import { AIService } from '../services/aiService.js';

export class AffirmationController {
  static async getAffirmationsByProblem(req, res) {
    try {
      const { problemId } = req.params;
      const userId = req.user.id;

      // Verify user owns the problem
      const { data: problem, error: problemError } = await supabaseAdmin
        .from('problems')
        .select('id')
        .eq('id', problemId)
        .eq('user_id', userId)
        .single();

      if (problemError) {
        return res.status(404).json({ error: 'Problem not found' });
      }

      const { data: affirmations, error } = await supabaseAdmin
        .from('affirmations')
        .select('*')
        .eq('problem_id', problemId)
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json({ affirmations });

    } catch (error) {
      console.error('Get affirmations error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async toggleFavorite(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Get current favorite status
      const { data: affirmation, error: fetchError } = await supabaseAdmin
        .from('affirmations')
        .select('is_favorite, problem_id')
        .eq('id', id)
        .single();

      if (fetchError) {
        return res.status(404).json({ error: 'Affirmation not found' });
      }

      // Verify user owns the problem
      const { data: problem, error: problemError } = await supabaseAdmin
        .from('problems')
        .select('id')
        .eq('id', affirmation.problem_id)
        .eq('user_id', userId)
        .single();

      if (problemError) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Toggle favorite status
      const { data: updatedAffirmation, error } = await supabaseAdmin
        .from('affirmations')
        .update({ is_favorite: !affirmation.is_favorite })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json({ affirmation: updatedAffirmation });

    } catch (error) {
      console.error('Toggle favorite error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async generateNewAffirmation(req, res) {
    try {
      const { problemId } = req.params;
      const userId = req.user.id;
      const { preferences = {} } = req.body;

      // Get problem details
      const { data: problem, error: problemError } = await supabaseAdmin
        .from('problems')
        .select(`
          *,
          problem_categories (
            name,
            description
          )
        `)
        .eq('id', problemId)
        .eq('user_id', userId)
        .single();

      if (problemError) {
        return res.status(404).json({ error: 'Problem not found' });
      }

      // Generate new affirmation
      const affirmationContent = await AIService.generatePersonalizedAffirmation(
        {
          category: problem.problem_categories.name,
          description: problem.description
        },
        preferences
      );

      // Store the new affirmation
      const { data: affirmation, error: affirmationError } = await supabaseAdmin
        .from('affirmations')
        .insert({
          problem_id: problemId,
          content: affirmationContent,
          type: 'positive'
        })
        .select()
        .single();

      if (affirmationError) {
        return res.status(400).json({ error: affirmationError.message });
      }

      res.json({ affirmation });

    } catch (error) {
      console.error('Generate affirmation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getFavoriteAffirmations(req, res) {
    try {
      const userId = req.user.id;

      const { data: affirmations, error } = await supabaseAdmin
        .from('affirmations')
        .select(`
          *,
          problems (
            title,
            problem_categories (
              name,
              icon
            )
          )
        `)
        .eq('is_favorite', true)
        .in('problem_id', 
          supabaseAdmin
            .from('problems')
            .select('id')
            .eq('user_id', userId)
        )
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json({ affirmations });

    } catch (error) {
      console.error('Get favorites error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
