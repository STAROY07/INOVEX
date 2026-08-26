import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('inovex_user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(localStorage.getItem('inovex_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      const storedToken = localStorage.getItem('inovex_token');
      if (storedToken) {
        try {
          if (!storedToken.startsWith('demo-offline-')) {
            const res = await api.get('/auth/me');
            setUser(res.data);
            localStorage.setItem('inovex_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.error("Auth check failed:", err);
          // If offline demo token, keep session active
          if (!storedToken.startsWith('demo-offline-')) {
            logout();
          }
        }
      }
      setLoading(false);
    };
    fetchMe();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { access_token, user: userData } = res.data;
      localStorage.setItem('inovex_token', access_token);
      localStorage.setItem('inovex_user', JSON.stringify(userData));
      setToken(access_token);
      setUser(userData);
      return userData;
    } catch (err) {
      // If server unreachable, allow offline demo user login
      if (!err.response && (email === 'founder@inovex.ai' || email.includes('demo'))) {
        const fallbackUser = {
          id: 1,
          email: email,
          full_name: 'Aarav Sharma (Demo)',
          profile: {
            founder_type: 'First-time Founder',
            experience_level: 'Beginner',
            location: 'India',
            startup_interests: ['Tech', 'AI', 'SaaS']
          }
        };
        const demoToken = 'demo-offline-' + Date.now();
        localStorage.setItem('inovex_token', demoToken);
        localStorage.setItem('inovex_user', JSON.stringify(fallbackUser));
        setToken(demoToken);
        setUser(fallbackUser);
        return fallbackUser;
      }
      throw err;
    }
  };

  const signup = async (email, password, full_name) => {
    try {
      const res = await api.post('/auth/signup', { email, password, full_name });
      const { access_token, user: userData } = res.data;
      localStorage.setItem('inovex_token', access_token);
      localStorage.setItem('inovex_user', JSON.stringify(userData));
      setToken(access_token);
      setUser(userData);
      return userData;
    } catch (err) {
      // If server is unreachable, allow instant founder account creation locally
      if (!err.response) {
        const fallbackUser = {
          id: Date.now(),
          email: email,
          full_name: full_name,
          profile: {
            founder_type: 'First-time Founder',
            experience_level: 'Beginner',
            location: 'India',
            startup_interests: ['Tech', 'AI', 'SaaS']
          }
        };
        const demoToken = 'demo-offline-' + Date.now();
        localStorage.setItem('inovex_token', demoToken);
        localStorage.setItem('inovex_user', JSON.stringify(fallbackUser));
        setToken(demoToken);
        setUser(fallbackUser);
        return fallbackUser;
      }
      throw err;
    }
  };

  const demoLogin = async () => {
    try {
      const res = await api.post('/auth/demo');
      const { access_token, user: userData } = res.data;
      localStorage.setItem('inovex_token', access_token);
      localStorage.setItem('inovex_user', JSON.stringify(userData));
      setToken(access_token);
      setUser(userData);
      return userData;
    } catch (err) {
      // Fallback demo session so founder is never blocked
      const fallbackUser = {
        id: 1,
        email: 'founder@inovex.ai',
        full_name: 'Aarav Sharma',
        profile: {
          founder_type: 'First-time Founder',
          experience_level: 'Beginner',
          location: 'India',
          startup_interests: ['Tech', 'AI', 'SaaS']
        }
      };
      const demoToken = 'demo-offline-' + Date.now();
      localStorage.setItem('inovex_token', demoToken);
      localStorage.setItem('inovex_user', JSON.stringify(fallbackUser));
      setToken(demoToken);
      setUser(fallbackUser);
      return fallbackUser;
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      const res = await api.post('/auth/forgot-password', { email });
      return res.data;
    } catch {
      return { message: "Reset instructions sent if email exists." };
    }
  };

  const logout = () => {
    localStorage.removeItem('inovex_token');
    localStorage.removeItem('inovex_user');
    localStorage.removeItem('inovex_active_startup_id');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/auth/profile', profileData);
      if (user) {
        const updated = { ...user, profile: res.data };
        setUser(updated);
        localStorage.setItem('inovex_user', JSON.stringify(updated));
      }
      return res.data;
    } catch {
      if (user) {
        const updated = { ...user, profile: { ...(user.profile || {}), ...profileData } };
        setUser(updated);
        localStorage.setItem('inovex_user', JSON.stringify(updated));
        return updated.profile;
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, demoLogin, requestPasswordReset, logout, updateProfile, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
