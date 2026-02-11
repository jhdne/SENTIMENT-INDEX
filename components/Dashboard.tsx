
import React, { useMemo } from 'react';
import SentimentKLine from './SentimentKLine';
import { IntelligenceItem, KLineData, TimeframeType } from '../types';

interface DashboardProps {
  onSelectItem: (item: IntelligenceItem) => void;
  feed: IntelligenceItem[];
  pendingSignals: string[];
  isAnalyzing: boolean;
  retryStatus: string | null;
  overallScore: number;
  wsStatus: 'connected' | 'connecting' | 'disconnected';
  messageCount: number;
  klineData: KLineData[];
  timeframe: TimeframeType;
  setTimeframe: (tf: TimeframeType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  onSelectItem, 
  feed, 
  pendingSignals, 
  isAnalyzing, 
  retryStatus,
  overallScore,
  wsStatus,
  messageCount,
  klineData,
  timeframe,
  setTimeframe
}) => {
  
  const timeframes: TimeframeType[] = ['30m', '1H', '2H', '4H', '6H', '8H', '1D', '1W', '1M'];

  const getStatusColor = () => {
    switch(wsStatus) {
      case 'connected': return 'bg-emerald-500 shadow-glow-green';
      case 'connecting': return 'bg-amber-500 animate-pulse';
      default: return 'bg-red-500';
    }
  };

  // Neutral theme colors (Blue/Indigo)
  const themeColor = '#6366f1'; // Indigo-500
  const glowColor = 'rgba(99,102,241,0.15)';

  const orderBookData = useMemo(() => {
    const sorted = [...feed].sort((a, b) => b.timestamp - a.timestamp);
    const bullish = sorted.filter(item => item.status === 'bullish');
    const bearish = sorted.filter(item => item.status === 'bearish');
    return { bullish, bearish };
  }, [feed]);

  const OrderBookRow = ({ item, side }: { item: IntelligenceItem, side: 'buy' | 'sell' }) => {
    const isBuy = side === 'buy';
    const inferenceValue = isBuy ? (50 + item.impact * 50) : (50 - item.impact * 50);
    
    return (
      <div 
        onClick={() => onSelectItem(item)}
        className="relative group cursor-pointer flex items-center py-2.5 px-6 hover:bg-white/5 transition-colors border-b border-slate-100/50 dark:border-white/5 overflow-hidden"
      >
        <div 
          className={`absolute inset-y-0 right-0 ${isBuy ? 'bg-emerald-500/5' : 'bg-red-500/5'} transition-all duration-1000`}
          style={{ width: `${item.impact * 100}%` }}
        />
        
        <div className="relative flex items-center w-full text-[11px] font-mono gap-4">
          <span className="text-slate-500 w-12 shrink-0 tabular-nums">
            {new Date(item.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className={`w-14 shrink-0 font-bold tabular-nums ${isBuy ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.3)]' : 'text-red-400 drop-shadow-[0_0_5px_rgba(239,68,68,0.3)]'}`}>
            {inferenceValue.toFixed(2)}
          </span>
          <span className="text-slate-500 w-12 shrink-0 text-right tabular-nums">
            {(item.impact * 10).toFixed(1)}
          </span>
          <span className="text-slate-300 truncate flex-1 group-hover:text-blue-400 transition-colors font-medium ml-4">
            {item.title}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
      {/* 综合情绪显示区域 - Adjusted SVG ViewBox and Radius to prevent clipping */}
      <header className="flex flex-col items-center mb-8 mt-6 relative py-4">
        <div className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80">
          {/* Dynamic Glow Base */}
          <div 
            className="absolute inset-0 rounded-full blur-[50px] opacity-15 transition-all duration-1000 scale-90"
            style={{ backgroundColor: themeColor }}
          ></div>
          
          {/* SVG Progress Ring - Reduced radius slightly to allow glow room in viewBox */}
          <svg className="absolute w-full h-full -rotate-90 transform overflow-visible" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="44"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-slate-100 dark:text-white/5"
            />
            <circle
              cx="50" cy="50" r="44"
              fill="none"
              stroke={themeColor}
              strokeWidth="1.5"
              strokeDasharray="276.46" 
              strokeDashoffset={276.46 - (276.46 * overallScore) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{ filter: `drop-shadow(0 0 4px ${themeColor}aa)` }}
            />
          </svg>

          {/* Core Content */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex items-baseline">
              <span className="text-7xl md:text-8xl font-black tracking-tighter tabular-nums text-indigo-600 dark:text-indigo-400 transition-all duration-1000"
                    style={{ textShadow: `0 0 30px ${glowColor}` }}>
                {overallScore.toFixed(1)}
              </span>
            </div>
            
            <div className="flex flex-col items-center mt-2">
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-slate-400 dark:text-slate-500">
                SENTIMENT index
              </span>
              <span className="text-[8px] text-slate-400 font-medium tracking-tight opacity-60 mt-0.5 max-w-[120px] text-center">
                Weighted average based on cumulative daily data
              </span>
            </div>
          </div>
        </div>

        {/* Floating background decorative line */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/5 to-transparent opacity-40"></div>
      </header>

      {/* K 线图区域 */}
      <section className="mb-6 bg-white dark:bg-surface-dark border border-border-gray dark:border-white/[0.05] rounded-[2.5rem] p-10 pb-6 shadow-2xl overflow-hidden flex flex-col relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2 relative z-10">
          <div className="flex flex-col">
            <span className="text-[13px] font-normal font-oswald text-slate-900 dark:text-slate-100 uppercase tracking-wide flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-glow-green animate-pulse"></span>
              Real-time Sentiment
            </span>
          </div>
          
          <div className="flex bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-white/5 rounded-full p-2 overflow-x-auto no-scrollbar md:mr-10">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-5 py-2.5 rounded-full text-[11px] font-black uppercase transition-all whitespace-nowrap ${
                  timeframe === tf 
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-glow-green' 
                  : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 relative z-10">
          <SentimentKLine data={klineData} />
        </div>

        <div className="mt-0 pt-2 border-t border-slate-100 dark:border-white/5 flex items-center gap-8 relative z-10">
          <div className="flex items-center gap-2.5 py-1.5 px-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
            <span className={`w-2 h-2 rounded-full ${getStatusColor()}`}></span>
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
              SYSTEM: {wsStatus}
            </span>
          </div>
          
          <div className="flex items-center gap-8 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 uppercase text-[9px] font-black tracking-tighter">Sync Hits</span>
              <span className="text-emerald-400 font-black tabular-nums">{messageCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 uppercase text-[9px] font-black tracking-tighter">AI Buffer</span>
              <span className={`font-black tabular-nums ${pendingSignals.length > 0 ? 'text-blue-400' : 'text-slate-600'}`}>
                {pendingSignals.length}
              </span>
              {isAnalyzing && (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[10px] text-blue-400 animate-spin">refresh</span>
                  {retryStatus && <span className="text-[8px] font-bold text-amber-500 uppercase animate-pulse">{retryStatus}</span>}
                </div>
              )}
            </div>
          </div>

          {pendingSignals.length > 0 && (
             <div className="flex-1 hidden md:flex items-center overflow-hidden border-l border-slate-100 dark:border-white/10 ml-2 pl-6 h-8">
               <span className="text-[10px] text-slate-500 font-medium italic truncate animate-pulse max-w-[500px]">
                 NODE PROCESSING // {pendingSignals[0]}
               </span>
             </div>
          )}
        </div>
      </section>

      {/* 订单簿式情感流 */}
      <section className="bg-white/40 dark:bg-surface-dark/40 backdrop-blur-3xl border border-white/20 dark:border-white/[0.03] rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-white/5">
          
          {/* 利好侧 */}
          <div className="flex flex-col">
            <div className="bg-emerald-500/[0.03] dark:bg-emerald-500/[0.01] px-8 py-6 flex justify-between items-center border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-1 h-8 bg-emerald-500 rounded-full shadow-glow-green"></div>
                <h2 className="text-[12px] font-black tracking-[0.2em] text-slate-800 dark:text-emerald-400 uppercase">
                  Bullish Pressure
                </h2>
              </div>
              <span className="text-[9px] font-black text-emerald-500/50 uppercase tracking-[0.3em]">Protocol Active</span>
            </div>
            <div className="flex flex-col min-h-[600px] max-h-[1000px] overflow-y-auto no-scrollbar relative">
              <div className="flex items-center px-6 py-3 text-[9px] font-black text-slate-500 dark:text-slate-500 uppercase border-b border-slate-100 dark:border-white/5 bg-white/95 dark:bg-surface-dark/95 sticky top-0 z-10 backdrop-blur-md gap-4">
                <span className="w-12 shrink-0 cursor-help" title="Time of detection">TIME</span>
                <span className="w-14 shrink-0 cursor-help" title="AI Inference Index (0-100)">INFR.</span>
                <span className="w-12 shrink-0 text-right cursor-help" title="Market Impact Weight (0-10)">IMPACT</span>
                <span className="ml-4 flex-1 cursor-help" title="Source News Signal">SOURCE INTELLIGENCE</span>
              </div>
              {orderBookData.bullish.length > 0 ? (
                orderBookData.bullish.map(item => <OrderBookRow key={item.id} item={item} side="buy" />)
              ) : (
                <div className="py-32 text-center">
                  <span className="text-[11px] uppercase tracking-[0.4em] text-slate-600 font-black italic opacity-20">Awaiting Signals...</span>
                </div>
              )}
            </div>
          </div>

          {/* 利空侧 */}
          <div className="flex flex-col">
            <div className="bg-red-500/[0.03] dark:bg-red-500/[0.01] px-8 py-6 flex justify-between items-center border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-1 h-8 bg-red-500 rounded-full shadow-glow-red"></div>
                <h2 className="text-[12px] font-black tracking-[0.2em] text-slate-800 dark:text-red-400 uppercase">
                  Bearish Resistance
                </h2>
              </div>
              <span className="text-[9px] font-black text-red-500/50 uppercase tracking-[0.3em]">Threat Scan</span>
            </div>
            <div className="flex flex-col min-h-[600px] max-h-[1000px] overflow-y-auto no-scrollbar relative">
              <div className="flex items-center px-6 py-3 text-[9px] font-black text-slate-500 dark:text-slate-500 uppercase border-b border-slate-100 dark:border-white/5 bg-white/95 dark:bg-surface-dark/95 sticky top-0 z-10 backdrop-blur-md gap-4">
                <span className="w-12 shrink-0 cursor-help" title="Time of detection">TIME</span>
                <span className="w-14 shrink-0 cursor-help" title="AI Inference Index (0-100)">INFR.</span>
                <span className="w-12 shrink-0 text-right cursor-help" title="Market Impact Weight (0-10)">IMPACT</span>
                <span className="ml-4 flex-1 cursor-help" title="Source News Signal">SOURCE INTELLIGENCE</span>
              </div>
              {orderBookData.bearish.length > 0 ? (
                orderBookData.bearish.map(item => <OrderBookRow key={item.id} item={item} side="sell" />)
              ) : (
                <div className="py-32 text-center">
                  <span className="text-[11px] uppercase tracking-[0.4em] text-slate-600 font-black italic opacity-20">Monitoring Risks...</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Dashboard;
