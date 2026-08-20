import axios from 'axios';

const api = axios.create({
  baseURL: 'https://inovex-api.onrender.com/api',
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.message =
        'The authentication server is unavailable. Please try again shortly.';
    }

    if (error.response && error.response.status === 401) {
      if (
        !window.location.pathname.startsWith('/auth') &&
        !window.location.pathname.startsWith('/landing') &&
        window.location.pathname !== '/'
      ) {
        localStorage.removeItem('inovex_token');
        localStorage.removeItem('inovex_user');
        window.location.href = '/auth';
      }
    }

    return Promise.reject(error);
  }
);

export default api;