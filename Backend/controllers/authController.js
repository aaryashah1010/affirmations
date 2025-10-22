import { supabaseAdmin } from '../config/database.js';

export class AuthController {
  static async signUp(req, res) {
    try {
      const { email, password, fullName } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm for demo purposes
        user_metadata: {
          full_name: fullName
        }
      });

      if (authError) {
        return res.status(400).json({ error: authError.message });
      }

      // Create user profile in our users table
      const { error: profileError } = await supabaseAdmin
        .from('users')
        .insert({
          id: authData.user.id,
          email: authData.user.email,
          full_name: fullName
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Don't fail the request if profile creation fails
      }

      res.status(201).json({
        message: 'User created successfully',
        user: {
          id: authData.user.id,
          email: authData.user.email,
          full_name: fullName
        }
      });

    } catch (error) {
      console.error('Sign up error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async signIn(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Sign in with Supabase Auth
      const { data, error } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email,
        options: {
          redirectTo: 'http://localhost:3000/dashboard'
        }
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      // For demo purposes, let's use a simpler approach
      const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      res.json({
        message: 'Sign in successful',
        user: {
          id: authData.user.id,
          email: authData.user.email,
          access_token: authData.session.access_token,
          refresh_token: authData.session.refresh_token
        }
      });

    } catch (error) {
      console.error('Sign in error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getProfile(req, res) {
    try {
      const userId = req.user.id;

      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user });

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { full_name, avatar_url } = req.body;

      const { data: user, error } = await supabaseAdmin
        .from('users')
        .update({
          full_name,
          avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json({ user });

    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async signOut(req, res) {
    try {
      // In a real app, you might want to invalidate the token
      res.json({ message: 'Sign out successful' });

    } catch (error) {
      console.error('Sign out error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
