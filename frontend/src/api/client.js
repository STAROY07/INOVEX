import axios from 'axios';

// Get base URL with environment variable support and safe /api suffix handling
const getBaseURL = () => {
  let url = (import.meta.env.VITE_API_URL || 'http://localhost:8000').trim();
  // Ensure we don't have trailing slash
  url = url.replace(/\/+$/, '');
  // Append /api if not already present
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getErrorMessage = (error) => {
  const detail = error.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg).join(' ');
  }
  return detail || error.message;
};

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
    if (error.code === 'ECONNABORTED' || (error.message && error.message.toLowerCase().includes('timeout'))) {
      error.message = 'Server request timed out. Please check if your backend server is running.';
    } else if (!error.response) {
      error.message = 'Unable to reach the INOVEX backend server (http://localhost:8000). Please start the backend or use Demo Login.';
    } else {
      error.message = getErrorMessage(error) || error.message;
    }

    // Auto-logout on 401 if not on auth or landing pages
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