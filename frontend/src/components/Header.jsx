import React from 'react';
import { Menu, Sparkles, Plus, ExternalLink, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStartup } from '../context/StartupContext';
import { useNavigate } from 'react-router-dom';

export const Header = ({ setMobileOpen, pageTitle, pageSubtitle }) => {
  const { user } = useAuth();
  const { activeStartup } = useStartup();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 h-16 bg-surface-100/80 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surface-50"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold font-display text-white truncate flex items-center gap-2">
            {pageTitle}
          </h1>
          {pageSubtitle && (
            <p className="text-xs text-slate-400 hidden sm:block truncate">
              {pageSubtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Active Startup Pill & Actions */}
      <div className="flex items-center gap-3">
        {activeStartup ? (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-50 border border-slate-700/60 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-slate-200 truncate max-w-[140px]">{activeStartup.name}</span>
            <span className="text-slate-500">•</span>
            <span className="text-primary-400 font-medium">{activeStartup.stage} Stage</span>
          </div>
        ) : (
          <button
            onClick={() => navigate('/onboarding')}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white shadow-glow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Startup Idea</span>
          </button>
        )}

        <button
          onClick={() => navigate('/mentor')}
          title="Ask AI Mentor"
          className="p-2 rounded-lg bg-primary-600/10 border border-primary-500/30 text-primary-400 hover:bg-primary-600/20 transition-colors flex items-center gap-1 text-xs font-medium"
        >
          <Sparkles className="w-4 h-4 text-accent-cyan" />
          <span className="hidden md:inline">Ask Mentor</span>
        </button>
      </div>

    </header>
  );
};
