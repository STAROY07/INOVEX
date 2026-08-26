import React from 'react';
import { PlusCircle } from 'lucide-react';

export const EmptyState = ({
  icon: Icon,
  title = "No data found",
  description = "Get started by adding your first record.",
  actionLabel,
  onAction
}) => {
  return (
    <div className="text-center py-16 px-6 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-lg mx-auto my-8">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-primary-50 border border-primary-200 flex items-center justify-center mx-auto mb-4 text-primary-600">
          <Icon className="w-7 h-7" />
        </div>
      )}
      <h3 className="text-lg font-bold text-slate-900 font-display">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-primary-500/20 transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};
