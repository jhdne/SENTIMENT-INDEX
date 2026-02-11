<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# 🎯 Sentiment Intelligence AI

**实时加密货币市场情绪分析仪表板**

[📖 API文档](API_CONFIG.md)

</div>

---

## ✨ 核心功能

- 🔴 **实时WebSocket数据流** - 接入BWEnews实时新闻推送
- 🤖 **AI智能分析** - Google Gemini API自动评估市场影响
- 📊 **情绪K线图** - 可视化展示情绪趋势（30m-1M多时间周期）
- 🎨 **现代化UI** - 极简主义设计，深色/浅色主题切换
- 🔄 **智能去重** - Jaccard相似度算法避免重复分析
- ⏱️ **时间衰减** - 指数衰减算法（6小时半衰期）
- 💾 **数据持久化** - LocalStorage自动保存历史数据

---

## 🚀 快速开始

**前置要求**: Node.js 18+

1. **安装依赖**
   ```bash
   npm install
   ```

2. **配置API密钥**

   编辑 `.env.local` 文件：
   ```env
   GEMINI_API_KEY=你的Gemini_API密钥
   ```

   获取API密钥：https://aistudio.google.com/app/apikey

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

   访问：http://localhost:3000

---

## 📊 技术栈

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **图表**: Recharts
- **AI**: Google Gemini API (gemini-3-flash-preview)
- **数据源**: BWEnews WebSocket

---

## 🔧 项目结构

```
SENTIMENT-INDEX/
├── components/          # React组件
│   ├── Dashboard.tsx    # 主仪表板
│   ├── DetailView.tsx   # 详情视图
│   ├── Header.tsx       # 顶部导航
│   ├── SentimentChart.tsx  # 情绪图表
│   └── SentimentKLine.tsx  # K线图
├── App.tsx              # 主应用逻辑
├── types.ts             # TypeScript类型定义
├── constants.ts         # 常量配置
├── API_CONFIG.md        # API配置文档
├── DEPLOYMENT.md        # 部署指南
└── .github/workflows/   # GitHub Actions配置
```

---

## 📖 文档

- [API配置说明](API_CONFIG.md) - WebSocket连接、消息格式、自定义配置

---

## 🎯 核心特性详解

### 1. WebSocket实时数据流
- **端点**: `wss://bwenews-api.bwe-ws.com/ws`
- **心跳机制**: 30秒Ping/Pong保活
- **自动重连**: 断线后5秒自动重连
- **智能降级**: 连接失败时使用本地模拟数据

### 2. AI情绪分析
- **模型**: Google Gemini 3 Flash Preview
- **评分标准**: 5级影响力评分（0.0-1.0）
- **分析维度**: 市场影响、情绪方向、置信度、推理逻辑
- **去重机制**: Jaccard相似度算法（70%阈值）

### 3. 时间衰减算法
- **算法**: 指数衰减 `weight = e^(-ln(2) * age / HALF_LIFE)`
- **半衰期**: 6小时
- **效果**: 新闻影响力随时间自然衰减

---

## 🔍 使用示例

### 查看实时情绪指数
Dashboard界面实时显示：
- **综合情绪指数**: 0-100分（50为中性）
- **SYSTEM状态**: WebSocket连接状态
- **Sync Hits**: 已接收新闻总数
- **AI Buffer**: 待分析队列长度

### 分析新闻详情
点击任意新闻查看：
- 完整新闻标题
- AI分析结果（看涨/看跌/中性）
- 影响力评分（0.0-1.0）
- 置信度评分
- 详细推理逻辑

### 查看情绪趋势
切换时间周期（30m/1H/4H/1D/1W/1M）查看K线图：
- 开盘/收盘/最高/最低情绪值
- 趋势线可视化

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License

---

## 🙏 致谢

- [Google Gemini](https://ai.google.dev/) - AI分析引擎
- [BWEnews](https://bwenews.com/) - 实时新闻数据源
- [Recharts](https://recharts.org/) - 图表库
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架

---

<div align="center">

Made with ❤️ for Crypto Traders

</div>
