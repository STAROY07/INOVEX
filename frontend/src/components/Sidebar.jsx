import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Award,
  Milestone,
  CheckSquare,
  Bot,
  FlaskConical,
  FileText,
  Files,
  Scale,
  BadgePercent,
  BookOpen,
  UserCheck,
  Sparkles,
  PlusCircle,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStartup } from '../context/StartupContext';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/assessment', label: 'Idea Assessment', icon: Award },
  { path: '/roadmap', label: 'Startup Roadmap', icon: Milestone },
  { path: '/actions', label: 'Next Actions', icon: CheckSquare, badge: 'Daily' },
  { path: '/mentor', label: 'AI Startup Mentor', icon: Bot, highlight: true },
  { path: '/validation', label: 'Validation Evidence', icon: FlaskConical },
  { path: '/business-plan', label: 'Business Plan', icon: FileText },
  { path: '/documents', label: 'Document Generator', icon: Files },
  { path: '/legal', label: 'Legal & Compliance', icon: Scale },
  { path: '/funding', label: 'Funding & Schemes', icon: BadgePercent },
  { path: '/resources', label: 'Learning Resources', icon: BookOpen },
  { path: '/profile', label: 'Profile & Settings', icon: UserCheck },
];

export const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const { activeStartup, startups, selectStartup } = useStartup();
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 via-primary-500 to-indigo-600 flex items-center justify-center shadow-glow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-extrabold text-lg tracking-tight text-slate-900">
              INOVEX
            </span>
          </div>
          <span className="text-[10px] font-semibold tracking-wider text-primary-700 bg-primary-50 border border-primary-200 px-2 py-0.5 rounded-full">
            AI MENTOR
          </span>
        </div>

        {/* Active Startup Picker */}
        <div className="p-3 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center justify-between mb-1 px-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active Startup</span>
            <button
              onClick={() => {
                navigate('/onboarding');
                setMobileOpen && setMobileOpen(false);
              }}
              title="Create new startup"
              className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
          </div>

          {activeStartup ? (
            <div className="relative group">
              <select
                aria-label="Select active startup"
                value={activeStartup.id}
                onChange={(e) => {
                  const s = startups.find(x => x.id === parseInt(e.target.value, 10));
                  if (s) selectStartup(s);
                }}
                className="w-full text-xs font-medium bg-white text-slate-900 rounded-lg px-2.5 py-2 border border-slate-300 focus:outline-none focus:border-primary-500 cursor-pointer appearance-none truncate pr-7 shadow-sm"
              >
                {startups.map(s => (
                  <option key={s.id} value={s.id} className="bg-white text-slate-900">
                    {s.name} ({s.stage})
                  </option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                ▾
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                navigate('/onboarding');
                setMobileOpen && setMobileOpen(false);
              }}
              className="w-full py-2 px-3 text-xs font-medium rounded-lg bg-primary-50 border border-primary-200 text-primary-700 hover:bg-primary-100 flex items-center justify-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add Your Startup Idea
            </button>
          )}
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen && setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-semibold border border-primary-200 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  } ${item.highlight ? 'text-primary-700 font-semibold' : ''}`
                }
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    item.highlight ? 'text-primary-600' : 'text-slate-500 group-hover:text-slate-900'
                  }`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] bg-primary-100 text-primary-700 border border-primary-200 px-1.5 py-0.2 rounded font-semibold">
                    {item.badge}
                  </span>
                )}
                {item.highlight && (
                  <Sparkles className="w-3 h-3 text-primary-600 animate-pulse flex-shrink-0" />
                )}
              </NavLink>
            );
          })}
        </div>

        {/* User Footer Profile */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white uppercase flex-shrink-0 shadow-sm">
              {user?.full_name?.charAt(0) || 'F'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 truncate">{user?.full_name || 'Founder'}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.profile?.founder_type || 'Founder'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </aside>
    </>
  );
};
