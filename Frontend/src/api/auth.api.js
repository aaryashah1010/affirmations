import api from './axios.js';

export const authAPI = {
  signUp: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  signIn: async (credentials) => {
    const response = await api.post('/auth/signin', credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },

  signOut: async () => {
    const response = await api.post('/auth/signout');
    return response.data;
  }
};
