
import { IntelligenceItem, ChartData } from './types';

export const MOCK_CHART_DATA: ChartData[] = [
  { time: '-24H', value: 65 },
  { time: '-20H', value: 68 },
  { time: '-16H', value: 62 },
  { time: '-12H', value: 72 },
  { time: '-8H', value: 70 },
  { time: '-4H', value: 75 },
  { time: 'NOW', value: 78.4 },
];

export const MASTER_NEWS_POOL = [
  "Federal Reserve signals potential rate pause in upcoming Q3 meeting.",
  "Major tech conglomerate announces sovereign-grade blockchain infrastructure.",
  "European Union finalized digital asset framework for cross-border settlements.",
  "Global energy transition leads to massive surge in ESG-linked digital tokens.",
  "SEC Chair discusses new custody requirements for institutional crypto holders.",
  "Asian markets see 15% increase in stablecoin liquidity for trade finance.",
  "New quantum-resistant encryption standard proposed for national digital currencies.",
  "Retail sentiment hit 2-year high following deflationary network upgrade.",
  "Whale accumulation patterns suggest consolidation at $60k support levels.",
  "Decentralized identity protocol reaches 10 million active monthly users."
];

export const INTELLIGENCE_FEED: IntelligenceItem[] = [
  {
    id: '1',
    title: 'Institutional inflow surge as major banks unveil multi-billion digital asset custody expansion',
    impact: 0.92,
    timeAgo: '12m ago',
    // Added timestamp to fix missing property error
    timestamp: Date.now() - 12 * 60 * 1000,
    status: 'bullish',
    source: 'Bloomberg Terminal',
    entities: [
      { name: 'Bitcoin (BTC)', type: 'Asset' },
      { name: 'SEC', type: 'Regulator' },
      { name: 'Fidelity', type: 'Institution' }
    ],
    weights: [
      { label: 'Regulatory Clarity', value: 0.85 },
      { label: 'Adoption Intent', value: 0.72 }
    ],
    summary: '“High probability of positive impact due to institutional adoption keywords and a finalized regulatory consensus.”'
  },
  {
    id: '2',
    title: 'Updated regulatory framework proposes heightened compliance requirements for cross-border settlements',
    impact: 0.65,
    timeAgo: '28m ago',
    // Added timestamp to fix missing property error
    timestamp: Date.now() - 28 * 60 * 1000,
    status: 'bearish',
    source: 'Financial Times',
    entities: [
      { name: 'Ripple (XRP)', type: 'Asset' },
      { name: 'IMF', type: 'Global' }
    ],
    weights: [
      { label: 'Compliance Cost', value: 0.90 },
      { label: 'Settlement Speed', value: 0.45 }
    ],
    summary: '“Regulatory tightening in cross-border corridors suggests a temporary slowdown in liquidity scaling.”'
  }
];

export const PROFILE_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuA2N-ZBJiSBWvLBS0EV0IIbP6PM_Sc2-VbMnK-r1l8jDUVtmTWqvERpqGw7U1OtkvDYdzOE0_Q9BiMF33-dMFwtGn2LMeZK-nP6nkFr_qBjRYXCcODtAyBY1uW6ADc-xD1rr1Rt-8oSV6ls9SGpWErdkHPMiUj7RFQ-Y68XVmI4n1S8jRaCOsgIUFqix77of2XYcZISz2D0hE58yAp7pCoV1pOpW-Ze8qmTI9qLRng0UsIpHwjLMPLHp73ij7GiUnuTd-EX9X9fU3k";