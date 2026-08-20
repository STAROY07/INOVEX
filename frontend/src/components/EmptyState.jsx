import React from 'react';
import { PlusCircle, ArrowRight } from 'lucide-react';

export const EmptyState = ({
  icon: Icon,
  title = "No data found",
  description = "Get started by adding your first record.",
  actionLabel,
  onAction
}) => {
  return (
    <div className="text-center py-16 px-6 glass-card rounded-2xl border border-slate-800/80 max-w-lg mx-auto my-8">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-surface-50 border border-slate-700/80 flex items-center justify-center mx-auto mb-4 text-primary-400">
          <Icon className="w-7 h-7" />
        </div>
      )}
      <h3 className="text-lg font-bold text-white font-display">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs sm:text-sm font-semibold shadow-glow-sm transition-all inline-flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};
