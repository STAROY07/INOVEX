import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ message = "Processing with AI...", submessage = "Analyzing market dynamics, customer profile, and unit economics..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center my-8 rounded-2xl glass-card border border-primary-500/20 max-w-md mx-auto">
      <div className="relative mb-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-cyan flex items-center justify-center shadow-glow-md animate-pulse">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <div className="absolute -inset-1 rounded-2xl border-2 border-primary-400/40 animate-spin"></div>
      </div>

      <h3 className="text-base font-bold text-white font-display flex items-center gap-2 justify-center">
        <Loader2 className="w-4 h-4 text-primary-400 animate-spin" />
        {message}
      </h3>
      
      {submessage && (
        <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
          {submessage}
        </p>
      )}
    </div>
  );
};
