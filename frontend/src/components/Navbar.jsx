import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 via-primary-500 to-indigo-600 flex items-center justify-center shadow-glow-sm group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-xl tracking-tight text-slate-900">
              INOVEX
            </span>
            <span className="text-[10px] text-primary-600 font-semibold tracking-wider uppercase -mt-1">
              AI Startup Mentor
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="/#features" className="hover:text-primary-600 transition-colors">Features</a>
          <a href="/#how-it-works" className="hover:text-primary-600 transition-colors">How It Works</a>
          <a href="/#india-first" className="hover:text-primary-600 transition-colors flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            India-First Hub
          </a>
          <a href="/#faq" className="hover:text-primary-600 transition-colors">FAQ</a>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary-600 hover:bg-primary-700 text-white shadow-glow-sm transition-all flex items-center gap-1.5"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={logout}
                className="px-3 py-2 text-sm font-medium rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/auth?tab=login"
                className="px-4 py-2 text-sm font-medium rounded-lg text-slate-700 hover:text-primary-600 hover:bg-slate-100 transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/auth?tab=signup"
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary-600 hover:bg-primary-700 text-white shadow-glow-sm transition-all flex items-center gap-1.5 group"
              >
                Get started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
};
