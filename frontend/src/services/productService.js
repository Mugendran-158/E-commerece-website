import api from '../api/axiosConfig';
import { SAMPLE_PRODUCTS } from '../data/sampleData';

export const productService = {
  async getProducts(params = {}) {
    try {
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error) {
      console.warn('Backend unavailable, applying client-side filtering on sample products:', error.message);
      let list = [...SAMPLE_PRODUCTS];

      if (params.search) {
        const query = params.search.toLowerCase();
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );
      }

      if (params.categoryId) {
        list = list.filter((p) => p.categoryId === parseInt(params.categoryId));
      }

      if (params.category) {
        list = list.filter((p) => p.category.toLowerCase() === params.category.toLowerCase());
      }

      if (params.minPrice) {
        list = list.filter((p) => (p.discountPrice || p.originalPrice) >= parseFloat(params.minPrice));
      }

      if (params.maxPrice) {
        list = list.filter((p) => (p.discountPrice || p.originalPrice) <= parseFloat(params.maxPrice));
      }

      if (params.sort) {
        if (params.sort === 'price_asc') {
          list.sort((a, b) => (a.discountPrice || a.originalPrice) - (b.discountPrice || b.originalPrice));
        } else if (params.sort === 'price_desc') {
          list.sort((a, b) => (b.discountPrice || b.originalPrice) - (a.discountPrice || a.originalPrice));
        } else if (params.sort === 'rating') {
          list.sort((a, b) => b.rating - a.rating);
        } else if (params.sort === 'newest') {
          list.sort((a, b) => b.id - a.id);
        }
      }

      return {
        content: list,
        totalElements: list.length,
        totalPages: Math.ceil(list.length / (params.size || 12)),
        pageNumber: params.page || 0
      };
    }
  },

  async getProductById(id) {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      const found = SAMPLE_PRODUCTS.find((p) => p.id === parseInt(id));
      if (found) return found;
      throw error;
    }
  },

  async getFeaturedProducts() {
    try {
      const response = await api.get('/products/featured');
      return response.data;
    } catch (error) {
      return SAMPLE_PRODUCTS.filter((p) => p.isFeatured);
    }
  },

  async createProduct(productData) {
    const response = await api.post('/products', productData);
    return response.data;
  },

  async updateProduct(id, productData) {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};
