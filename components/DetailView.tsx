
import React from 'react';
import { IntelligenceItem } from '../types';

interface DetailViewProps {
  item: IntelligenceItem;
}

const DetailView: React.FC<DetailViewProps> = ({ item }) => {
  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20 animate-in fade-in duration-700">
      <header className="mb-16 md:mb-20 text-center max-w-4xl mx-auto">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-[0.2em] mb-8 ${
          item.status === 'bullish' 
          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
          : 'bg-red-500/10 border-red-500/20 text-red-500'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'bullish' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
          {item.status.toUpperCase()} SENTIMENT
        </div>
        <h1 className="text-3xl md:text-5xl font-bold leading-[1.15] tracking-tight text-slate-900 dark:text-white mb-8">
          {item.title}
        </h1>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">database</span> 
            {item.source}
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
          <span>Analyzed {item.timeAgo}</span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
          <span className="text-blue-500 font-bold uppercase tracking-tighter">Inference Confidence: {(item.confidence_score || 0.95) * 100}%</span>
        </div>
      </header>

      {/* Inference Reasoning Section */}
      <section className="mb-20 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[2rem] p-8 md:p-12">
        <div className="flex items-center gap-3 mb-8">
          <span className="material-symbols-outlined text-blue-500">psychology</span>
          <span className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-500">Deep Inference Logic (SOP)</span>
        </div>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-lg md:text-xl font-medium leading-relaxed text-slate-700 dark:text-slate-300">
            {item.reasoning_logic || "Standard reasoning procedure applied based on regulatory alignment and liquidity projection models."}
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 mb-20 border-y border-slate-100 dark:border-border-dark py-12 md:py-16">
        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Key Entities</span>
          </div>
          <ul className="space-y-4">
            {item.entities.map((entity, i) => (
              <li key={i} className="flex items-center justify-between">
                <span className={`text-sm font-medium ${entity.type === 'Related' ? 'text-slate-400' : ''}`}>
                  {entity.name}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                  entity.type === 'Related' 
                  ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 text-slate-400'
                  : 'bg-slate-100 dark:bg-surface-dark border-slate-200 dark:border-border-dark'
                }`}>
                  {entity.type}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Impact Analysis</span>
          </div>
          <div className="space-y-6">
            {item.weights.map((w, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span>{w.label}</span>
                  <span className={w.value >= 0 ? 'text-emerald-500' : 'text-red-500'}>
                    {w.value >= 0 ? `+${w.value.toFixed(2)}` : w.value.toFixed(2)}
                  </span>
                </div>
                <div className="h-1 w-full bg-slate-100 dark:bg-border-dark rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out ${w.value >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`} 
                    style={{ width: `${Math.abs(w.value) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price Upside Probability</span>
          </div>
          <div className="flex flex-col items-center justify-center pt-2">
            <div className="text-6xl font-light tracking-tighter text-slate-900 dark:text-white mb-2">
              {(item.impact * 100).toFixed(0)}<span className="text-2xl text-slate-400">%</span>
            </div>
            <p className={`text-xs font-bold uppercase tracking-widest ${item.impact > 0.7 ? 'text-emerald-500' : 'text-amber-500'}`}>
              {item.impact > 0.7 ? 'High Accumulation' : 'Moderate Volatility'}
            </p>
            <div className="mt-8 grid grid-cols-2 gap-8 w-full">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Price Horizon</p>
                <p className="text-xs font-medium">T+48 Hours</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Vol Delta</p>
                <p className="text-xs font-medium">+/- 1.8%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="max-w-3xl mx-auto text-center pb-24">
        <p className="text-xl md:text-2xl font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic mb-12">
          {item.summary}
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <button className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full text-xs font-bold transition-transform hover:scale-105 active:scale-95 shadow-lg">
            Download Deep Analysis
          </button>
          <button className="px-8 py-3 bg-transparent border border-slate-200 dark:border-border-dark rounded-full text-xs font-bold transition-colors hover:bg-slate-50 dark:hover:bg-surface-dark">
            Execute Signal
          </button>
        </div>
      </footer>
    </main>
  );
};

export default DetailView;
