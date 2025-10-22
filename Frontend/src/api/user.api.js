import api from './axios.js';

export const userAPI = {
  getProblems: async (params = {}) => {
    const response = await api.get('/problems', { params });
    return response.data;
  },

  getProblemById: async (problemId) => {
    const response = await api.get(`/problems/${problemId}`);
    return response.data;
  },

  createProblem: async (problemData) => {
    const response = await api.post('/problems', problemData);
    return response.data;
  },

  updateProblem: async (problemId, problemData) => {
    const response = await api.put(`/problems/${problemId}`, problemData);
    return response.data;
  },

  deleteProblem: async (problemId) => {
    const response = await api.delete(`/problems/${problemId}`);
    return response.data;
  },

  getProblemCategories: async () => {
    const response = await api.get('/problems/categories');
    return response.data;
  }
};
