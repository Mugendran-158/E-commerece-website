import api from '../api/axiosConfig';

export const authService = {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      // Demo credentials fallback only if backend server is offline
      if (!error.response) {
        if (email === 'admin@shopease.com' && password === 'Admin@123') {
          return {
            token: 'demo_jwt_token_admin_' + Date.now(),
            user: {
              id: 1,
              firstName: 'Admin',
              lastName: 'User',
              email: 'admin@shopease.com',
              role: 'ADMIN'
            }
          };
        }
        if (email === 'user@shopease.com' && password === 'User@123') {
          return {
            token: 'demo_jwt_token_user_' + Date.now(),
            user: {
              id: 2,
              firstName: 'Jane',
              lastName: 'Doe',
              email: 'user@shopease.com',
              role: 'USER'
            }
          };
        }
      }
      throw new Error(error.response?.data?.message || 'Invalid email or password');
    }
  },

  async register(data) {
    try {
      const response = await api.post('/auth/register', data);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  }
};
