import api from '../api/axiosConfig';

export const adminService = {
  async getDashboardStats() {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  async getAllUsers() {
    const response = await api.get('/admin/users');
    return response.data;
  },

  async getAnalytics() {
    const response = await api.get('/admin/analytics');
    return response.data;
  },

  async getAnalyticsSummary() {
    const response = await api.get('/admin/analytics/summary');
    return response.data;
  },

  async getSalesAnalytics() {
    const response = await api.get('/admin/analytics/sales');
    return response.data;
  },

  async getTopProducts() {
    const response = await api.get('/admin/analytics/top-products');
    return response.data;
  },

  async getTopCategories() {
    const response = await api.get('/admin/analytics/top-categories');
    return response.data;
  }
};
