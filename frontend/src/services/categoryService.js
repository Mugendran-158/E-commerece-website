import api from '../api/axiosConfig';
import { SAMPLE_CATEGORIES } from '../data/sampleData';

export const categoryService = {
  async getCategories() {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      console.warn('Backend unavailable, using sample categories fallback:', error.message);
      return SAMPLE_CATEGORIES;
    }
  },

  async getCategoryById(id) {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      const found = SAMPLE_CATEGORIES.find((c) => c.id === parseInt(id));
      if (found) return found;
      throw error;
    }
  },

  async createCategory(categoryData) {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  async updateCategory(id, categoryData) {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  async deleteCategory(id) {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
};
