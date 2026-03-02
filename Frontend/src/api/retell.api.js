import api from './axios';

export const retellAPI = {
  generateToken: async (agentId) => {
    const response = await api.post('/retell/generate-token', {
      agentId,
    });
    return response.data;
  },
};
