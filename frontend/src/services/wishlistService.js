import api from '../api/axiosConfig';

export const wishlistService = {
  /**
   * Get all items in current user's wishlist
   */
  async getWishlist() {
    const response = await api.get('/wishlist');
    return response.data;
  },

  /**
   * Add a product to current user's wishlist
   */
  async addToWishlist(productId) {
    const response = await api.post(`/wishlist/${productId}`);
    return response.data;
  },

  /**
   * Remove a product from current user's wishlist
   */
  async removeFromWishlist(productId) {
    const response = await api.delete(`/wishlist/${productId}`);
    return response.data;
  },

  /**
   * Check if a product is in current user's wishlist
   */
  async checkWishlist(productId) {
    const response = await api.get(`/wishlist/check/${productId}`);
    return response.data;
  }
};
