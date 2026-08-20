import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';

const StartupContext = createContext(null);

export const StartupProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [startups, setStartups] = useState([]);
  const [activeStartup, setActiveStartup] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStartups = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await api.get('/startups');
      setStartups(res.data);
      if (res.data.length > 0) {
        const storedId = localStorage.getItem('inovex_active_startup_id');
        const found = res.data.find(s => s.id === parseInt(storedId, 10));
        if (found) {
          setActiveStartup(found);
        } else {
          setActiveStartup(res.data[0]);
          localStorage.setItem('inovex_active_startup_id', res.data[0].id.toString());
        }
      } else {
        setActiveStartup(null);
      }
    } catch (err) {
      console.error("Failed to fetch startups:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchStartups();
  }, [fetchStartups]);

  const selectStartup = (startup) => {
    setActiveStartup(startup);
    if (startup) {
      localStorage.setItem('inovex_active_startup_id', startup.id.toString());
    }
  };

  const createStartup = async (startupData) => {
    const res = await api.post('/startups', startupData);
    const newStartup = res.data;
    setStartups(prev => [newStartup, ...prev]);
    setActiveStartup(newStartup);
    localStorage.setItem('inovex_active_startup_id', newStartup.id.toString());
    return newStartup;
  };

  return (
    <StartupContext.Provider value={{
      startups,
      activeStartup,
      loading,
      fetchStartups,
      selectStartup,
      createStartup,
      hasStartup: !!activeStartup
    }}>
      {children}
    </StartupContext.Provider>
  );
};

export const useStartup = () => useContext(StartupContext);
