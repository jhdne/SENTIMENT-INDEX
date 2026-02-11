
export interface IntelligenceItem {
  id: string;
  title: string;
  impact: number;
  timeAgo: string;
  status: 'bullish' | 'bearish' | 'neutral';
  source: string;
  entities: { name: string; type: string }[];
  weights: { label: string; value: number }[];
  summary: string;
  timestamp: number;
  reasoning_logic?: string; // AI评估的逻辑推演过程
  confidence_score?: number; // AI对自己结论的置信度
}

export type ViewType = 'dashboard' | 'detail';
export type TimeframeType = '30m' | '1H' | '2H' | '4H' | '6H' | '8H' | '1D' | '1W' | '1M';

export interface ChartData {
  time: string;
  value: number;
}

export interface KLineData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  timestamp: number;
}
