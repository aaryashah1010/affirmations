import axios from 'axios';

export class RetellController {
  static async generateConversationToken(req, res) {
    try {
      const { agentId } = req.body;
      const apiKey = process.env.RETELL_API_KEY;

      if (!apiKey) {
        return res.status(500).json({
          error: 'Retell AI API key not configured'
        });
      }

      if (!agentId) {
        return res.status(400).json({
          error: 'Agent ID is required'
        });
      }

      console.log('Generating Retell token for agent:', agentId);
      console.log('API Key present:', !!apiKey);

      // Call Retell AI API to create conversation
      const response = await axios.post(
        'https://api.retellai.com/v2/create-web-call',
        {
          agent_id: agentId,
          user_id: req.user.id, // Use authenticated user's ID
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Retell API response:', response.status);
      console.log('Response data keys:', Object.keys(response.data));
      console.log('Full response data:', response.data);

      // Check what fields are in the response
      const token = response.data.access_token || response.data.token || response.data.web_call_token;
      const conversationId = response.data.conversation_id || response.data.conversationId || response.data.call_id;

      if (!token) {
        console.error('No token in Retell response:', response.data);
        return res.status(500).json({
          error: 'Invalid response from Retell API - no token received',
          details: response.data
        });
      }

      console.log('Token generated successfully');

      return res.json({
        token: token,
        conversationId: conversationId,
      });
    } catch (error) {
      console.error('Error generating Retell token:');
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      console.error('Message:', error.message);

      return res.status(500).json({
        error: 'Failed to generate conversation token',
        details: process.env.NODE_ENV !== 'production' ? {
          status: error.response?.status,
          message: error.message,
          retellError: error.response?.data
        } : undefined,
      });
    }
  }
}

