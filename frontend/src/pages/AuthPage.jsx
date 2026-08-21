import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Lock, Mail, User, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';

export const AuthPage = () => {
  const { login, signup, demoLogin, requestPasswordReset, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const [coldStartNotice, setColdStartNotice] = useState(false);

  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => {
        setColdStartNotice(true);
      }, 3500);
    } else {
      setColdStartNotice(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tab') === 'signup') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [location]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password;
    const cleanFullName = fullName.trim();

    try {
      if (isForgotPassword) {
        if (!cleanEmail) {
          setError('Please enter your email address.');
          setLoading(false);
          return;
        }
        await requestPasswordReset(cleanEmail);
        setSuccess('If an account exists for this email, reset instructions have been sent.');
      } else if (isLogin) {
        if (!cleanEmail || !cleanPassword) {
          setError('Please enter both email and password.');
          setLoading(false);
          return;
        }
        await login(cleanEmail, cleanPassword);
        navigate('/dashboard');
      } else {
        if (!cleanFullName) {
          setError('Please enter your full name');
          setLoading(false);
          return;
        }
        if (cleanPassword.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        await signup(cleanEmail, cleanPassword, cleanFullName);
        navigate('/onboarding');
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail ||
        err.message ||
        'Authentication failed. Please check your credentials or try again.';
      setError(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (loginMode) => {
    setIsLogin(loginMode);
    setIsForgotPassword(false);
    setError('');
    setSuccess('');
  };

  const handleDemoLogin = async () => {
    setEmail('founder@inovex.ai');
    setPassword('startup123');
    setError('');
    setLoading(true);
    try {
      if (demoLogin) {
        await demoLogin();
      } else {
        await login('founder@inovex.ai', 'startup123');
      }
      navigate('/dashboard');
    } catch (err) {
      try {
        await login('founder@inovex.ai', 'startup123');
        navigate('/dashboard');
      } catch (loginErr) {
        const msg =
          err.response?.data?.detail ||
          loginErr.response?.data?.detail ||
          err.message ||
          'Demo login failed. Please register a new account.';
        setError(typeof msg === 'string' ? msg : 'Demo login failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col selection:bg-primary-500 selection:text-white">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
        {/* Glow backdrop */}
        <div className="absolute w-96 h-96 bg-primary-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-glow-sm relative z-10">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-cyan flex items-center justify-center mx-auto mb-3 shadow-glow-sm">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold font-display text-white">
              {isForgotPassword ? 'Reset your password' : isLogin ? 'Welcome back to INOVEX' : 'Create your Founder Account'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {isForgotPassword ? 'Enter your email to receive reset instructions' : isLogin ? 'Sign in to access your startup dashboard' : 'Start turning your idea into an action plan'}
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="grid grid-cols-2 p-1 bg-surface-50 rounded-xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => switchMode(true)}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                isLogin ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode(false)}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                !isLogin ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && !isForgotPassword && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full pl-9 pr-3 py-2.5 bg-surface-50 text-white text-sm rounded-xl border border-slate-700/80 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="founder@startup.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-surface-50 text-white text-sm rounded-xl border border-slate-700/80 focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            {!isForgotPassword && <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-surface-50 text-white text-sm rounded-xl border border-slate-700/80 focus:outline-none focus:border-primary-500 transition-colors"
                />
                  <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
              </div>
              </div>}

            {isLogin && !isForgotPassword && (
              <button type="button" onClick={() => { setIsForgotPassword(true); setError(''); setSuccess(''); }} className="text-xs text-primary-300 hover:text-primary-200">
                Forgot password?
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm shadow-glow-sm transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <span>{coldStartNotice ? 'Waking up server...' : 'Processing...'}</span>
              ) : (
                <>
                  <span>{isForgotPassword ? 'Send Reset Instructions' : isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            {coldStartNotice && (
              <p className="text-[11px] text-amber-300/90 text-center animate-pulse mt-1">
                Waking up backend instance on Render (first request may take ~20-30s)...
              </p>
            )}
          </form>

          {/* Quick Demo Access */}
          {!isForgotPassword && <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="text-xs text-slate-400 hover:text-primary-300 transition-colors py-1.5 px-3 rounded-lg border border-slate-800 bg-surface-50/50 hover:bg-surface-50 inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
              <span>Click for 1-Click Demo Login</span>
            </button>
          </div>}

        </div>
      </div>
    </div>
  );
};
