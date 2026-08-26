import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';

const DEFAULT_SAMPLE_STARTUP = {
  id: 1,
  name: 'KrishiMitra AI',
  tagline: 'AI-driven crop disease detection and mandi price forecasting for rural farmers',
  problem_statement: 'Indian smallholder farmers lose up to 35% of crops due to delayed disease identification and lack of transparent market pricing.',
  solution_overview: 'A vernacular multilingual WhatsApp bot and mobile app providing instant camera-based crop diagnostics and hyper-local mandi rate predictions.',
  target_audience: 'Small and marginal farmers, Farmer Producer Organisations (FPOs), Agri-dealers',
  revenue_model: 'Freemium for basic advisory + B2B subscription for FPOs and input sellers',
  stage: 'Idea & Validation',
  industry: 'AgriTech / AI',
  location: 'Pune, Maharashtra',
  created_at: new Date().toISOString()
};

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
      if (res.data && res.data.length > 0) {
        setStartups(res.data);
        const storedId = localStorage.getItem('inovex_active_startup_id');
        const found = res.data.find(s => s.id === parseInt(storedId, 10));
        if (found) {
          setActiveStartup(found);
        } else {
          setActiveStartup(res.data[0]);
          localStorage.setItem('inovex_active_startup_id', res.data[0].id.toString());
        }
      } else {
        // Fallback default startup if empty
        setStartups([DEFAULT_SAMPLE_STARTUP]);
        setActiveStartup(DEFAULT_SAMPLE_STARTUP);
        localStorage.setItem('inovex_active_startup_id', '1');
      }
    } catch (err) {
      console.warn("Using sample startup data for offline/demo experience:", err.message);
      setStartups([DEFAULT_SAMPLE_STARTUP]);
      setActiveStartup(DEFAULT_SAMPLE_STARTUP);
      localStorage.setItem('inovex_active_startup_id', '1');
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
    try {
      const res = await api.post('/startups', startupData);
      const newStartup = res.data;
      setStartups(prev => [newStartup, ...prev]);
      setActiveStartup(newStartup);
      localStorage.setItem('inovex_active_startup_id', newStartup.id.toString());
      return newStartup;
    } catch (err) {
      console.warn("Backend unavailable, creating startup locally:", err);
      const newStartup = {
        id: Date.now(),
        ...startupData,
        created_at: new Date().toISOString()
      };
      setStartups(prev => [newStartup, ...prev]);
      setActiveStartup(newStartup);
      localStorage.setItem('inovex_active_startup_id', newStartup.id.toString());
      return newStartup;
    }
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
