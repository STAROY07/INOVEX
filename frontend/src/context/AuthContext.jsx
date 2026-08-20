import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('inovex_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      const storedToken = localStorage.getItem('inovex_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
        } catch (err) {
          console.error("Auth check failed:", err);
          logout();
        }
      }
      setLoading(false);
    };
    fetchMe();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { access_token, user: userData } = res.data;
    localStorage.setItem('inovex_token', access_token);
    setToken(access_token);
    setUser(userData);
    return userData;
  };

  const signup = async (email, password, full_name) => {
    const res = await api.post('/auth/signup', { email, password, full_name });
    const { access_token, user: userData } = res.data;
    localStorage.setItem('inovex_token', access_token);
    setToken(access_token);
    setUser(userData);
    return userData;
  };

  const requestPasswordReset = async (email) => {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('inovex_token');
    localStorage.removeItem('inovex_active_startup_id');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const res = await api.put('/auth/profile', profileData);
    if (user) {
      setUser({ ...user, profile: res.data });
    }
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, requestPasswordReset, logout, updateProfile, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
