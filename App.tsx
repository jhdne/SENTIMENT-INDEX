
import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import DetailView from './components/DetailView';
import { IntelligenceItem, ViewType, KLineData, TimeframeType } from './types';
import { INTELLIGENCE_FEED, MASTER_NEWS_POOL } from './constants';
import { GoogleGenAI, Type } from "@google/genai";

const MAX_RETRIES = 5;
const INITIAL_BACKOFF = 3000;
const COOLDOWN_DURATION = 60000; // 1 minute cooldown for exhausted quota

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('dashboard');
  const [selectedItem, setSelectedItem] = useState<IntelligenceItem | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [timeframe, setTimeframe] = useState<TimeframeType>('1H');
  
  const [feed, setFeed] = useState<IntelligenceItem[]>(() => {
    const saved = localStorage.getItem('sentiment_feed');
    return saved ? JSON.parse(saved) : INTELLIGENCE_FEED;
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [retryStatus, setRetryStatus] = useState<string | null>(null);
  const [pendingSignals, setPendingSignals] = useState<string[]>([]);
  const [wsStatus, setWsStatus] = useState<'connected' | 'connecting' | 'disconnected'>('disconnected');
  const [messageCount, setMessageCount] = useState(0);
  
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<number | null>(null);
  const pingInterval = useRef<number | null>(null);
  const simulationInterval = useRef<number | null>(null);
  
  const generateMockKLines = (tf: TimeframeType): KLineData[] => {
    const data: KLineData[] = [];
    const now = Date.now();
    const intervals: Record<TimeframeType, number> = {
      '30m': 30 * 60 * 1000,
      '1H': 60 * 60 * 1000,
      '2H': 2 * 60 * 60 * 1000,
      '4H': 4 * 60 * 60 * 1000,
      '6H': 6 * 60 * 60 * 1000,
      '8H': 8 * 60 * 60 * 1000,
      '1D': 24 * 60 * 60 * 1000,
      '1W': 7 * 24 * 60 * 60 * 1000,
      '1M': 30 * 24 * 60 * 60 * 1000,
    };
    
    const interval = intervals[tf];
    let base = 50 + (Math.random() * 20 - 10);

    for (let i = 40; i >= 0; i--) {
      const ts = now - i * interval;
      const open = base;
      const close = base + (Math.random() * 16 - 8);
      const high = Math.max(open, close) + Math.random() * 5;
      const low = Math.min(open, close) - Math.random() * 5;
      
      data.push({
        timestamp: ts,
        time: new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        open: Math.min(Math.max(open, 0), 100),
        high: Math.min(Math.max(high, 0), 100),
        low: Math.min(Math.max(low, 0), 100),
        close: Math.min(Math.max(close, 0), 100),
      });
      base = close;
    }
    return data;
  };

  const [klineData, setKlineData] = useState<KLineData[]>(() => generateMockKLines('1H'));

  useEffect(() => {
    setKlineData(generateMockKLines(timeframe));
  }, [timeframe]);

  useEffect(() => {
    localStorage.setItem('sentiment_feed', JSON.stringify(feed));
  }, [feed]);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  // BWEnews WebSocket 连接
  const connectWebSocket = useCallback(() => {
    if (ws.current) {
      ws.current.close();
    }

    setWsStatus('connecting');
    console.log('🔌 正在连接 BWEnews WebSocket...');

    try {
      const socket = new WebSocket('wss://bwenews-api.bwe-ws.com/ws');

      socket.onopen = () => {
        setWsStatus('connected');
        console.log('✅ BWEnews WebSocket 连接成功');

        // 启动心跳机制 - 每30秒发送一次ping
        pingInterval.current = window.setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send('ping');
            console.log('💓 发送心跳: ping');
          }
        }, 30000);
      };

      socket.onmessage = (event) => {
        try {
          const data = event.data;

          // 处理pong响应
          if (data === 'pong') {
            console.log('💓 收到心跳响应: pong');
            return;
          }

          // 解析JSON数据
          const message = JSON.parse(data);
          console.log('📰 收到新闻:', message);

          // BWEnews 数据格式处理
          if (message.source_name === 'BWENEWS' && message.news_title) {
            const title = message.news_title;
            const coins = message.coins_included || [];
            const url = message.url || '';
            const timestamp = message.timestamp || Date.now() / 1000;

            // 构建完整的新闻标题（包含相关币种）
            const fullTitle = coins.length > 0
              ? `[${coins.join(', ')}] ${title}`
              : title;

            console.log(`📊 处理新闻: ${fullTitle}`);

            setPendingSignals(prev => {
              if (prev.includes(fullTitle)) {
                console.log('⚠️  重复新闻，已跳过');
                return prev;
              }
              return [fullTitle, ...prev].slice(0, 30);
            });

            setMessageCount(prev => prev + 1);
          }
        } catch (err) {
          console.error('❌ 解析消息错误:', err, '原始数据:', event.data);
        }
      };

      socket.onerror = (error) => {
        console.error('❌ WebSocket 错误:', error);
        setWsStatus('disconnected');
      };

      socket.onclose = (event) => {
        ws.current = null;
        setWsStatus('disconnected');
        console.log(`🔌 WebSocket 连接关闭 (code: ${event.code}, reason: ${event.reason})`);

        if (pingInterval.current) {
          clearInterval(pingInterval.current);
          pingInterval.current = null;
        }

        // 5秒后自动重连
        console.log('⏳ 5秒后尝试重新连接...');
        reconnectTimeout.current = window.setTimeout(() => {
          console.log('🔄 开始重新连接...');
          connectWebSocket();
        }, 5000);
      };

      ws.current = socket;

    } catch (error) {
      console.error('❌ 创建WebSocket连接失败:', error);
      setWsStatus('disconnected');

      // 失败后尝试重连
      reconnectTimeout.current = window.setTimeout(connectWebSocket, 5000);
    }
  }, []);

  useEffect(() => {
    // 连接 BWEnews WebSocket
    connectWebSocket();

    // 备用：本地模拟数据（仅在WebSocket长时间无数据时补充）
    simulationInterval.current = window.setInterval(() => {
      // 只有在disconnected状态时才使用模拟数据
      if (wsStatus === 'disconnected') {
        const randomNews = MASTER_NEWS_POOL[Math.floor(Math.random() * MASTER_NEWS_POOL.length)];
        setPendingSignals(prev => {
          if (prev.includes(randomNews)) return prev;
          return [randomNews, ...prev].slice(0, 10);
        });
        setMessageCount(prev => prev + 1);
        console.log('⚠️  WebSocket断开，使用模拟数据:', randomNews);
      }
    }, 180000); // 3分钟（仅作为备用）

    return () => {
      // 清理WebSocket连接
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }

      // 清理定时器
      if (pingInterval.current) {
        clearInterval(pingInterval.current);
        pingInterval.current = null;
      }

      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
        reconnectTimeout.current = null;
      }

      if (simulationInterval.current) {
        clearInterval(simulationInterval.current);
        simulationInterval.current = null;
      }
    };
  }, [connectWebSocket]);

  // 新闻去重函数 - 使用Jaccard相似度
  const isDuplicate = useCallback((newTitle: string, existingFeed: IntelligenceItem[]) => {
    const similarity = (a: string, b: string) => {
      const wordsA = new Set(a.toLowerCase().split(/\s+/));
      const wordsB = new Set(b.toLowerCase().split(/\s+/));
      const intersection = new Set([...wordsA].filter(x => wordsB.has(x)));
      const union = new Set([...wordsA, ...wordsB]);
      return intersection.size / union.size;
    };

    return existingFeed.some(item => {
      const sim = similarity(newTitle, item.title);
      const timeDiff = Date.now() - item.timestamp;
      // 70%相似度阈值，或1小时内50%相似
      return sim > 0.7 || (timeDiff < 3600000 && sim > 0.5);
    });
  }, []);

  // 改进的时间衰减算法 - 使用指数衰减而非索引衰减
  const currentSentiment = useMemo(() => {
    if (feed.length === 0) return 50;

    const now = Date.now();
    const HALF_LIFE = 6 * 60 * 60 * 1000; // 6小时半衰期

    const totalImpact = feed.reduce((acc, item) => {
      const age = now - item.timestamp;
      const weight = Math.exp(-Math.log(2) * age / HALF_LIFE); // 指数衰减
      const score = item.status === 'bullish' ? item.impact :
                    (item.status === 'bearish' ? -item.impact : 0);
      const confidence = item.confidence_score || 0.95; // 加入置信度
      return acc + (score * weight * confidence);
    }, 0);

    const sumWeights = feed.reduce((acc, item) => {
      const age = now - item.timestamp;
      return acc + Math.exp(-Math.log(2) * age / HALF_LIFE);
    }, 0);

    return Math.min(Math.max(50 + (totalImpact / sumWeights) * 50, 0), 100);
  }, [feed]);

  useEffect(() => {
    setKlineData(prev => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      const newClose = currentSentiment;
      const newHigh = Math.max(last.high, newClose);
      const newLow = Math.min(last.low, newClose);
      const updated = [...prev];
      updated[updated.length - 1] = {
        ...last,
        close: newClose,
        high: newHigh,
        low: newLow
      };
      return updated;
    });
  }, [currentSentiment]);

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const handleAutoAnalyze = async (text: string) => {
    if (!text || isRateLimited) return;

    // 新闻去重检查
    if (isDuplicate(text, feed)) {
      console.log('Duplicate news detected, skipping:', text);
      setPendingSignals(prev => prev.filter(s => s !== text));
      return;
    }

    setIsAnalyzing(true);
    setRetryStatus(null);

    let retries = 0;

    while (retries < MAX_RETRIES) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        // 优化的Prompt工程
        const systemInstruction = `You are a Senior Crypto Quantitative Analyst with 10+ years of experience in digital asset markets.

ANALYSIS FRAMEWORK:
1. Identify key entities (coins, institutions, regulators)
2. Assess market impact on a scale of 0.0-1.0
3. Determine sentiment: bullish/bearish/neutral
4. Provide reasoning with specific market mechanisms

IMPACT SCORING CRITERIA:
- 0.9-1.0: Major regulatory changes, institutional adoption, protocol upgrades
- 0.7-0.9: Significant partnerships, large fund flows, macroeconomic shifts
- 0.5-0.7: Medium news (exchange listings, minor regulations)
- 0.3-0.5: Low impact (rumors, minor announcements)
- 0.0-0.3: Negligible impact

REASONING REQUIREMENTS:
- Cite specific price mechanisms (supply/demand, liquidity, sentiment)
- Consider historical precedents
- Account for market cycle context (bull/bear/consolidation)
- Distinguish short-term vs long-term effects

Output ONLY valid JSON.`;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Evaluate: "${text}"`,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                status: { type: Type.STRING, enum: ['bullish', 'bearish', 'neutral'] },
                impact: { type: Type.NUMBER },
                source: { type: Type.STRING },
                entities: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, type: { type: Type.STRING } } } },
                weights: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { label: { type: Type.STRING }, value: { type: Type.NUMBER } } } },
                summary: { type: Type.STRING },
                reasoning_logic: { type: Type.STRING },
                confidence_score: { type: Type.NUMBER }
              },
              required: ["title", "status", "impact", "source", "entities", "weights", "summary", "reasoning_logic", "confidence_score"]
            }
          }
        });

        const result = JSON.parse(response.text || "{}");
        const newItem: IntelligenceItem = {
          ...result,
          id: Math.random().toString(36).substr(2, 9),
          timeAgo: 'Just now',
          timestamp: Date.now()
        };

        setFeed(prev => [newItem, ...prev.slice(0, 99)]);
        setPendingSignals(prev => prev.filter(s => s !== text));
        setRetryStatus(null);
        setIsRateLimited(false);
        break; // Success
      } catch (error: any) {
        const errorMsg = error.message || "";
        const isQuotaExceeded = errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED');
        const isRetryable = isQuotaExceeded || errorMsg.includes('500') || errorMsg.includes('Rpc failed') || errorMsg.includes('UNKNOWN');

        if (isRetryable && retries < MAX_RETRIES - 1) {
          retries++;
          const backoff = INITIAL_BACKOFF * Math.pow(2, retries - 1);
          setRetryStatus(`Retry ${retries}/${MAX_RETRIES} in ${(backoff/1000).toFixed(0)}s`);
          await delay(backoff);
          continue;
        } else if (isQuotaExceeded) {
          setIsRateLimited(true);
          setRetryStatus('Rate limited - cooling down 60s');
          await delay(COOLDOWN_DURATION);
          setIsRateLimited(false);
          break;
        } else {
          console.error('Non-retryable error:', error);
          setPendingSignals(prev => prev.filter(s => s !== text));
          break;
        }
      }
    }

    setIsAnalyzing(false);
  };

  // 自动处理待分析队列
  useEffect(() => {
    if (pendingSignals.length > 0 && !isAnalyzing && !isRateLimited) {
      const nextSignal = pendingSignals[0];
      handleAutoAnalyze(nextSignal);
    }
  }, [pendingSignals, isAnalyzing, isRateLimited]);

  const handleSelectItem = useCallback((item: IntelligenceItem) => {
    setSelectedItem(item);
    setView('detail');
  }, []);

  const handleBack = useCallback(() => {
    setView('dashboard');
    setSelectedItem(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-background-dark dark:via-background-dark dark:to-slate-900 transition-colors duration-300">
      <Header
        view={view}
        onBack={handleBack}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {view === 'dashboard' ? (
        <Dashboard
          onSelectItem={handleSelectItem}
          feed={feed}
          pendingSignals={pendingSignals}
          isAnalyzing={isAnalyzing}
          retryStatus={retryStatus}
          overallScore={currentSentiment}
          wsStatus={wsStatus}
          messageCount={messageCount}
          klineData={klineData}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
        />
      ) : (
        selectedItem && <DetailView item={selectedItem} />
      )}
    </div>
  );
};

export default App;