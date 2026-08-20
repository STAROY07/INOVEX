import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('inovex_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.message = 'The authentication server is unavailable. Please try again shortly.';
    }
    if (error.response && error.response.status === 401) {
      // If unauthorized and not on auth page, redirect
      if (!window.location.pathname.startsWith('/auth') && !window.location.pathname.startsWith('/landing') && window.location.pathname !== '/') {
        localStorage.removeItem('inovex_token');
        localStorage.removeItem('inovex_user');
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
