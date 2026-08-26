import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const DisclaimerBanner = ({ compact = false }) => {
  return (
    <div className={`rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-sm ${compact ? 'p-3 text-xs' : 'p-4 text-xs sm:text-sm'}`}>
      <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
      <div className="leading-relaxed">
        <strong className="font-bold text-amber-950">Legal & Financial Disclaimer: </strong>
        INOVEX provides AI-assisted general informational guidance for educational purposes only. It is not a substitute for formal chartered accountancy, legal counsel, or certified investment advice.
      </div>
    </div>
  );
};
