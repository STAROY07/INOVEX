import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'primary', badge }) => {
  const colorMap = {
    primary: 'text-primary-400 bg-primary-500/10 border-primary-500/30',
    cyan: 'text-accent-cyan bg-cyan-500/10 border-cyan-500/30',
    emerald: 'text-accent-emerald bg-emerald-500/10 border-emerald-500/30',
    amber: 'text-accent-amber bg-amber-500/10 border-amber-500/30',
    purple: 'text-accent-purple bg-purple-500/10 border-purple-500/30',
    rose: 'text-accent-rose bg-rose-500/10 border-rose-500/30',
  };

  return (
    <div className="glass-card rounded-xl p-5 border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
              {value}
            </h3>
            {badge && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>
        
        {Icon && (
          <div className={`p-3 rounded-xl border ${colorMap[color] || colorMap.primary} group-hover:scale-110 transition-transform`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};
