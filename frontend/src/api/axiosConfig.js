import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8085/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('shopease_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle authorization errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      // Only clear if on protected pages to prevent disrupting public browsing
      const currentPath = window.location.pathname;
      if (
        currentPath.startsWith('/admin') ||
        currentPath.startsWith('/checkout') ||
        currentPath.startsWith('/orders') ||
        currentPath.startsWith('/profile')
      ) {
        localStorage.removeItem('shopease_user');
        localStorage.removeItem('shopease_token');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
