
import React from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import { KLineData } from '../types';

interface SentimentKLineProps {
  data: KLineData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isUp = data.close >= data.open;
    return (
      <div className="bg-slate-900/95 border border-white/10 p-3 rounded-lg shadow-2xl backdrop-blur-md">
        <p className="text-[10px] text-slate-400 mb-2 font-mono uppercase">{data.time}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-xs">
          <span className="text-slate-500">OPEN:</span>
          <span className="text-white text-right">{data.open.toFixed(2)}</span>
          <span className="text-slate-500">HIGH:</span>
          <span className="text-emerald-400 text-right">{data.high.toFixed(2)}</span>
          <span className="text-slate-500">LOW:</span>
          <span className="text-red-400 text-right">{data.low.toFixed(2)}</span>
          <span className="text-slate-500">CLOSE:</span>
          <span className={`text-right font-bold ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
            {data.close.toFixed(2)}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const SentimentKLine: React.FC<SentimentKLineProps> = ({ data }) => {
  return (
    <div className="w-full h-64 md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        {/* Minimized bottom margin to let axis sit closer to the bottom border */}
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 2 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey="time" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 9, fill: '#64748b' }}
            minTickGap={30}
          />
          <YAxis 
            domain={[0, 100]} 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 9, fill: '#64748b' }}
            orientation="right"
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1 }} />
          
          <ReferenceLine y={50} stroke="#cbd5e1" strokeDasharray="3 3" />

          {/* 影线部分 (High - Low) */}
          <Bar dataKey="high" barSize={1} fill="#64748b" isAnimationActive={false}>
             {data.map((entry, index) => (
               <Cell key={`cell-line-${index}`} fill={entry.close >= entry.open ? '#10b981' : '#ef4444'} opacity={0.3} />
             ))}
          </Bar>

          {/* 实体部分 */}
          <Bar 
            dataKey={(d: KLineData) => Math.abs(d.close - d.open)} 
            name="Body"
            barSize={12}
          >
            {data.map((entry, index) => {
              const isUp = entry.close >= entry.open;
              const height = Math.abs(entry.close - entry.open);
              return (
                <Cell 
                  key={`cell-${index}`} 
                  fill={isUp ? '#10b981' : '#ef4444'} 
                />
              );
            })}
          </Bar>
          
          <Bar dataKey={(d) => [Math.min(d.open, d.close), Math.max(d.open, d.close)]} barSize={8} isAnimationActive={true}>
            {data.map((entry, index) => (
              <Cell key={`cell-rect-${index}`} fill={entry.close >= entry.open ? '#10b981' : '#ef4444'} />
            ))}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SentimentKLine;
