import api from '../api/axiosConfig';

export const couponService = {

  /** Validate a coupon code against a cart total */
  async validateCoupon(code, cartTotal) {
    const response = await api.get('/coupons/validate', {
      params: { code, cartTotal }
    });
    return response.data;
  },

  /** Apply a coupon code (POST /api/coupons/apply) */
  async applyCoupon(code, cartTotal) {
    const response = await api.post('/coupons/apply', { code, cartTotal });
    return response.data;
  },

  // ─── Admin ────────────────────────────────────────────────────────────────

  async getAllCoupons() {
    const response = await api.get('/admin/coupons');
    return response.data;
  },

  async getCoupon(id) {
    const response = await api.get(`/admin/coupons/${id}`);
    return response.data;
  },

  async createCoupon(data) {
    const response = await api.post('/admin/coupons', data);
    return response.data;
  },

  async updateCoupon(id, data) {
    const response = await api.put(`/admin/coupons/${id}`, data);
    return response.data;
  },

  async deleteCoupon(id) {
    const response = await api.delete(`/admin/coupons/${id}`);
    return response.data;
  }
};
