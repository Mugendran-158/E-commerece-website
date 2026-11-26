import api from '../api/axiosConfig';

export const reviewService = {

  /** GET reviews for a product (public) */
  async getReviewsByProduct(productId) {
    const response = await api.get(`/products/${productId}/reviews`);
    return response.data;
  },

  /** GET review status: has user purchased + reviewed? (auth) */
  async getReviewStatus(productId) {
    try {
      const response = await api.get(`/products/${productId}/reviews/status`);
      return response.data; // { hasPurchased: bool, hasReviewed: bool }
    } catch {
      return { hasPurchased: false, hasReviewed: false };
    }
  },

  /** POST create review for a product */
  async createReview(productId, reviewData) {
    const response = await api.post(`/products/${productId}/reviews`, reviewData);
    return response.data;
  },

  /** PUT update own review */
  async updateReview(reviewId, reviewData) {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  /** DELETE own review */
  async deleteReview(reviewId) {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  },

  // ─── Admin ─────────────────────────────────────

  /** GET all reviews (admin only) */
  async getAllReviews() {
    const response = await api.get('/admin/reviews');
    return response.data;
  },

  /** DELETE any review (admin only) */
  async adminDeleteReview(reviewId) {
    const response = await api.delete(`/admin/reviews/${reviewId}`);
    return response.data;
  }
};
