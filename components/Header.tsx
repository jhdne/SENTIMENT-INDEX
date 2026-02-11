
import React from 'react';
import { PROFILE_IMAGE } from '../constants';

interface HeaderProps {
  onBack?: () => void;
  isDetailView?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onBack, isDetailView }) => {
  return (
    <nav className="border-b border-border-gray dark:border-border-dark px-4 md:px-8 py-4 flex justify-between items-center bg-white dark:bg-background-dark sticky top-0 z-50">
      <div className="flex items-center gap-4 md:gap-6">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={onBack}
        >
          {isDetailView ? (
            <span className="material-symbols-outlined text-primary font-bold text-blue-600">analytics</span>
          ) : null}
          <h1 className="text-sm font-bold tracking-[0.2em] uppercase whitespace-nowrap">
            {isDetailView ? 'SENTIMENT.AI' : 'Sentiment Intelligence'}
          </h1>
        </div>
        <div className="h-4 w-px bg-border-gray dark:bg-border-dark"></div>
        {isDetailView ? (
          <div className="flex items-center gap-1 text-[10px] md:text-xs font-medium text-slate-400">
            <span className="hover:text-blue-600 transition-colors cursor-pointer" onClick={onBack}>Analyses</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-900 dark:text-white">Detail View</span>
          </div>
        ) : (
          <span className="text-[10px] md:text-xs text-slate-400 font-medium tracking-wide uppercase">AI-DRIVEN MARKET ANALYSIS</span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden md:inline text-[10px] text-slate-400 font-mono uppercase">
          {isDetailView ? 'Market Live' : 'Last Refresh: 14:22:10 UTC'}
        </span>
        <div className="w-8 h-8 rounded-full overflow-hidden border border-border-gray dark:border-border-dark">
          <img alt="Profile" className="w-full h-full object-cover" src={PROFILE_IMAGE} />
        </div>
      </div>
    </nav>
  );
};

export default Header;
