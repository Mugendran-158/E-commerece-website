import api from '../api/axiosConfig';

export const profileService = {
  /**
   * Get the logged-in user's profile
   */
  async getProfile() {
    const response = await api.get('/profile');
    return response.data;
  },

  /**
   * Update the logged-in user's profile
   */
  async updateProfile(profileData) {
    const response = await api.put('/profile', profileData);
    return response.data;
  }
};
