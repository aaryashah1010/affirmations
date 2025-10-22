import api from './axios.js';

export const sessionAPI = {
  createSession: async (sessionData) => {
    const response = await api.post('/sessions', sessionData);
    return response.data;
  },

  getUserSessions: async (params = {}) => {
    const response = await api.get('/sessions', { params });
    return response.data;
  },

  getSessionStats: async (params = {}) => {
    const response = await api.get('/sessions/stats', { params });
    return response.data;
  },

  updateSession: async (sessionId, sessionData) => {
    const response = await api.put(`/sessions/${sessionId}`, sessionData);
    return response.data;
  }
};
