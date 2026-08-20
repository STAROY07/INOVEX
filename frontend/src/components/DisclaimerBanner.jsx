import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const DisclaimerBanner = ({ compact = false }) => {
  return (
    <div className={`rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-3 ${compact ? 'p-3 text-xs' : 'p-4 text-xs sm:text-sm'}`}>
      <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
      <div className="leading-relaxed">
        <strong className="font-semibold text-amber-200">Legal & Financial Disclaimer: </strong>
        INOVEX provides AI-assisted general informational guidance for educational purposes only. It is not a substitute for formal chartered accountancy, legal counsel, or certified investment advice.
      </div>
    </div>
  );
};
