import React from 'react';
import { Menu, Sparkles, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStartup } from '../context/StartupContext';
import { useNavigate } from 'react-router-dom';

export const Header = ({ setMobileOpen, pageTitle, pageSubtitle }) => {
  const { user } = useAuth();
  const { activeStartup } = useStartup();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold font-display text-slate-900 truncate flex items-center gap-2">
            {pageTitle}
          </h1>
          {pageSubtitle && (
            <p className="text-xs text-slate-500 hidden sm:block truncate">
              {pageSubtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Active Startup Pill & Actions */}
      <div className="flex items-center gap-3">
        {activeStartup ? (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-slate-800 truncate max-w-[140px]">{activeStartup.name}</span>
            <span className="text-slate-400">•</span>
            <span className="text-primary-700 font-medium">{activeStartup.stage} Stage</span>
          </div>
        ) : (
          <button
            onClick={() => navigate('/onboarding')}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white shadow-glow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Startup Idea</span>
          </button>
        )}

        <button
          onClick={() => navigate('/mentor')}
          title="Ask AI Mentor"
          className="p-2 rounded-lg bg-primary-50 border border-primary-200 text-primary-700 hover:bg-primary-100 transition-colors flex items-center gap-1 text-xs font-semibold"
        >
          <Sparkles className="w-4 h-4 text-primary-600" />
          <span className="hidden md:inline">Ask Mentor</span>
        </button>
      </div>

    </header>
  );
};
