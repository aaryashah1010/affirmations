import { supabaseAdmin } from '../config/database.js';

export class SessionController {
  static async createSession(req, res) {
    try {
      const userId = req.user.id;
      const { 
        problem_id, 
        affirmations_practiced = [], 
        duration_minutes = 0, 
        mood_before, 
        mood_after, 
        notes 
      } = req.body;

      if (!problem_id) {
        return res.status(400).json({ error: 'Problem ID is required' });
      }

      // Verify user owns the problem
      const { data: problem, error: problemError } = await supabaseAdmin
        .from('problems')
        .select('id')
        .eq('id', problem_id)
        .eq('user_id', userId)
        .single();

      if (problemError) {
        return res.status(404).json({ error: 'Problem not found' });
      }

      const { data: session, error } = await supabaseAdmin
        .from('sessions')
        .insert({
          user_id: userId,
          problem_id,
          affirmations_practiced,
          duration_minutes,
          mood_before,
          mood_after,
          notes
        })
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
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.status(201).json({ session });

    } catch (error) {
      console.error('Create session error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getUserSessions(req, res) {
    try {
      const userId = req.user.id;
      const { problem_id, limit = 20, offset = 0 } = req.query;

      let query = supabaseAdmin
        .from('sessions')
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
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (problem_id) {
        query = query.eq('problem_id', problem_id);
      }

      const { data: sessions, error } = await query;

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json({ sessions });

    } catch (error) {
      console.error('Get sessions error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getSessionStats(req, res) {
    try {
      const userId = req.user.id;
      const { days = 30 } = req.query;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Get session statistics
      const { data: stats, error } = await supabaseAdmin
        .from('sessions')
        .select('duration_minutes, mood_before, mood_after, completed_at')
        .eq('user_id', userId)
        .gte('completed_at', startDate.toISOString());

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      // Calculate statistics
      const totalSessions = stats.length;
      const totalMinutes = stats.reduce((sum, session) => sum + (session.duration_minutes || 0), 0);
      const avgMoodBefore = stats.length > 0 
        ? stats.reduce((sum, session) => sum + (session.mood_before || 0), 0) / stats.length 
        : 0;
      const avgMoodAfter = stats.length > 0 
        ? stats.reduce((sum, session) => sum + (session.mood_after || 0), 0) / stats.length 
        : 0;

      // Group by date for chart data
      const sessionsByDate = {};
      stats.forEach(session => {
        const date = new Date(session.completed_at).toISOString().split('T')[0];
        if (!sessionsByDate[date]) {
          sessionsByDate[date] = { count: 0, totalMinutes: 0 };
        }
        sessionsByDate[date].count++;
        sessionsByDate[date].totalMinutes += session.duration_minutes || 0;
      });

      const chartData = Object.entries(sessionsByDate).map(([date, data]) => ({
        date,
        sessions: data.count,
        minutes: data.totalMinutes
      })).sort((a, b) => new Date(a.date) - new Date(b.date));

      res.json({
        totalSessions,
        totalMinutes,
        avgMoodBefore: Math.round(avgMoodBefore * 10) / 10,
        avgMoodAfter: Math.round(avgMoodAfter * 10) / 10,
        moodImprovement: Math.round((avgMoodAfter - avgMoodBefore) * 10) / 10,
        chartData
      });

    } catch (error) {
      console.error('Get session stats error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateSession(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { duration_minutes, mood_after, notes } = req.body;

      const { data: session, error } = await supabaseAdmin
        .from('sessions')
        .update({
          duration_minutes,
          mood_after,
          notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', userId)
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
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json({ session });

    } catch (error) {
      console.error('Update session error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
