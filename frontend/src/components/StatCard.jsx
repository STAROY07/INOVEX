import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'primary', badge }) => {
  const colorMap = {
    primary: 'text-primary-700 bg-primary-50 border-primary-200',
    cyan: 'text-cyan-700 bg-cyan-50 border-cyan-200',
    emerald: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    amber: 'text-amber-700 bg-amber-50 border-amber-200',
    purple: 'text-purple-700 bg-purple-50 border-purple-200',
    rose: 'text-rose-700 bg-rose-50 border-rose-200',
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-slate-300 hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
              {value}
            </h3>
            {badge && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>
          )}
        </div>
        
        {Icon && (
          <div className={`p-3 rounded-xl border ${colorMap[color] || colorMap.primary} group-hover:scale-105 transition-transform`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};
