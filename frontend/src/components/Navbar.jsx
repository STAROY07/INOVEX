import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Layers, ShieldCheck, Compass, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 via-primary-500 to-accent-cyan flex items-center justify-center shadow-glow-sm group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
              INOVEX
            </span>
            <span className="text-[10px] text-primary-400 font-medium tracking-wider uppercase -mt-1">
              AI Startup Mentor
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="/#features" className="hover:text-white transition-colors">Features</a>
          <a href="/#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="/#india-first" className="hover:text-white transition-colors flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            India-First Hub
          </a>
          <a href="/#faq" className="hover:text-white transition-colors">FAQ</a>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-primary-600 hover:bg-primary-500 text-white shadow-glow-sm transition-all flex items-center gap-1.5"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={logout}
                className="px-3 py-2 text-sm font-medium rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/auth?tab=login"
                className="px-4 py-2 text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/auth?tab=signup"
                className="px-4 py-2 text-sm font-medium rounded-lg bg-primary-600 hover:bg-primary-500 text-white shadow-glow-sm transition-all flex items-center gap-1.5 group"
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
