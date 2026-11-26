import api from '../api/axiosConfig';

export const notificationService = {

  async getNotifications() {
    const response = await api.get('/notifications');
    return response.data;
  },

  async getUnreadCount() {
    const response = await api.get('/notifications/unread-count');
    return response.data.count;
  },

  async markAllRead() {
    const response = await api.put('/notifications/mark-all-read');
    return response.data;
  },

  async markRead(id) {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  async deleteNotification(id) {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  }
};
