import axios from 'axios';

// Get base URL with environment variable support and safe /api suffix handling
const getBaseURL = () => {
  let url = (import.meta.env.VITE_API_URL || 'https://inovex-api.onrender.com').trim();
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
  timeout: 60000, // 60s timeout to gracefully accommodate Render free-tier cold starts
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
    // Handle timeout error (e.g. Render sleeping / cold starting)
    if (error.code === 'ECONNABORTED' || (error.message && error.message.toLowerCase().includes('timeout'))) {
      error.message = 'The server is waking up from standby (Render cold start). Please click again in 10-15 seconds.';
    } else if (!error.response) {
      error.message = 'Unable to reach the INOVEX backend server. Please verify your connection or try again shortly.';
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