# 📈 FinSmart — Senior PM Portfolio

> **Case Study · B2C Mobile SaaS · AI-Powered Investment Intelligence**
> A production-grade investment intelligence platform that collapses real-time multi-exchange market data ingestion, LLM-powered sentiment analysis, ML signal generation (LSTM + XGBoost), and portfolio analytics into a single autonomous mobile agent — built for retail investors who want institutional-grade signals, not just price tickers.

---

## 📋 Document Index

| Section | Topic |
|---|---|
| [01 · Executive Snapshot](#01--executive-snapshot) | What this is and why it matters |
| [02 · Problem Space](#02--problem-space) | Five validated pain points with business impact |
| [03 · Market Opportunity](#03--market-opportunity) | TAM/SAM/SOM, target segments, competitive positioning |
| [04 · Solution Architecture](#04--solution-architecture) | Data pipeline design and end-to-end system flow |
| [05 · Core Platform Modules](#05--core-platform-modules) | Six product modules and their design rationale |
| [06 · Data Model & Business Logic](#06--data-model--business-logic) | Key entities, relationships, and constraint logic |
| [07 · AI & ML Layer — Signal Generation](#07--ai--ml-layer--signal-generation) | LLM sentiment + ML prediction architecture |
| [08 · Signal Analytics & Portfolio Intelligence](#08--signal-analytics--portfolio-intelligence) | Feedback loop, signal accuracy, and portfolio analysis |
| [09 · Go-to-Market Strategy](#09--go-to-market-strategy) | Phased entry, pricing, and sales motion |
| [10 · Feature Roadmap](#10--feature-roadmap) | MVP → V1.0 → V2.0 milestones |
| [11 · Risk Assessment](#11--risk-assessment) | Technical, business, and regulatory risks |
| [12 · PM Competencies Demonstrated](#12--pm-competencies-demonstrated) | Skills surface for senior product roles |
| [13 · Key Metrics & KPIs](#13--key-metrics--kpis) | Numbers that matter |

---

## 01 · Executive Snapshot

| Attribute | Detail |
|---|---|
| **Product Name** | FinSmart |
| **Domain** | B2C Mobile SaaS · AI Investment Intelligence |
| **Architecture** | Real-time data pipeline + LLM sentiment + ML signal engine + React Native mobile app |
| **Target Users** | Retail investors (active traders and delivery investors); SEBI-registered advisors managing client portfolios |
| **North Star Metric** | **Signal Hit Rate** — % of AI-generated BUY/SELL signals where target price is reached before stop-loss within the signal window |
| **Revenue Target** | ₹5 Cr ARR by end of Year 2 |
| **Exchanges Covered** | NSE, BSE, Nifty (all indices), NASDAQ, NYSE, S&P 500, DOW, DAX, LSE, HangSeng, CAC, KOSPI, Nikkei, Gift Nifty |

> **Strategic Insight**
>
> Every financial app — Zerodha Kite, Groww, Angel One — is architected around *transaction execution*, not *signal quality*. They help investors act; they do nothing to improve the probability that the action leads to a gain. FinSmart is built around the inverse insight: investment decisions are a prediction problem, and prediction problems are solved by combining structured market data with unstructured signal intelligence at scale. The platform doesn't just show prices — it closes the gap between market data and decision quality.

---

## 02 · Problem Space

### Five Validated Pain Points

> The core insight: retail investors conducting active market participation are running three disconnected processes — discovery (which stocks to track), analysis (whether to buy/sell/hold), and tracking (understanding whether past signals worked) — stitched together manually across brokerage apps, financial news, social media, and analyst reports. The cost shows up as missed entries, emotional exits, and zero feedback signal on what market conditions actually correlated with gains.

| # | Pain Point | Business Impact | Root Cause |
|---|---|---|---|
| 1 | **Signal overload without prioritisation** | Retail investors receive hundreds of price alerts, news items, and tips daily — with no mechanism to rank them by quality or relevance | No tool aggregates signals across sources and scores them by predicted outcome probability |
| 2 | **ATS for stocks: the manual analysis bottleneck** | Evaluating a single stock across technicals, fundamentals, news sentiment, and macro context takes 45–90 minutes per stock — unsustainable for any active portfolio | Analysis tools are siloed; no platform synthesises all dimensions into a single actionable recommendation |
| 3 | **No signal quality feedback loop** | Investors cannot tell if losses are a market timing issue, a sector rotation miss, or poor stock selection — after the fact | Brokerage P&L shows outcomes; it does not attribute them to the quality of the original entry signal |
| 4 | **Multi-exchange portfolio fragmentation** | Investors holding NSE, BSE, and US-listed stocks across Zerodha, Groww, and Angel One have no unified view of cross-exchange portfolio risk | Brokerages operate in regulatory silos; no unified portfolio intelligence layer exists across exchanges |
| 5 | **Macro and sentiment opacity** | Crude oil movements, RBI rate decisions, geopolitical events, and AGM reports all impact stock prices — but investors have no tool that quantifies these impacts per holding | Macro events are covered by news; their stock-level impact is left to the investor to infer manually |

### Target Persona Pain Mapping

| Persona | Primary Frustration | How FinSmart Resolves It |
|---|---|---|
| **Active Retail Trader** | Spends hours analysing before every trade; still misses optimal entry/exit points | AI signals with confidence score, target, and stop-loss remove the analysis paralysis |
| **Delivery Investor (SIP + Select Stocks)** | Holds a mixed portfolio with no systematic review cadence | Portfolio intelligence engine flags Hold/Sell signals with reasoning; quarterly review becomes automated |
| **SEBI-Registered Investment Advisor (RIA)** | Cannot scale personalised portfolio advice across 50+ clients | White-label signal dashboard for client portfolio management |
| **NRI Investor** | Manages Indian + US portfolio with no unified cross-currency P&L view | Multi-exchange, multi-currency portfolio view with AI suggestions across all holdings |
| **First-Time Equity Investor** | Paralysed by complexity of stock selection; relies on unverified tips | Beginner-mode signals with plain-language reasoning and risk ratings |

---

## 03 · Market Opportunity

### Market Sizing

| Market | Size | Basis |
|---|---|---|
| **TAM** | $34B | Global retail investment analytics and wealth tech software market |
| **SAM** | $5.8B | AI-powered stock signal and portfolio intelligence segment (mobile-first, retail focus) |
| **SOM** | $780M | India + NRI + DACH active retail investor segment; English and Hindi language markets; NSE/BSE + US exchanges |

### Target Segments

| Segment | Description | Wedge Pain |
|---|---|---|
| **Active Retail Traders** | Daily/weekly traders on NSE/BSE and US exchanges via Zerodha, Angel One, Groww | Analysis time cost; no signal quality tracking; over-reliance on tips and gut instinct |
| **Delivery Investors** | Long-hold equity investors managing 10–50 stock portfolios across Indian and global exchanges | No systematic Hold/Sell review cadence; macro blind spots; no cross-exchange unified view |
| **SEBI-Registered Advisors (RIAs)** | Licensed advisors managing client equity portfolios | Manual research bottleneck; no scalable portfolio intelligence tool for client management |
| **NRI Investors** | Indian diaspora holding Indian and US-listed assets simultaneously | Currency risk + multi-exchange fragmentation + no unified advisory layer |
| **Wealth Tech Platforms** | Fintechs embedding investment intelligence as a product feature | No off-the-shelf multi-exchange ML signal API with sentiment integration |

### Competitive Positioning

| Capability | Zerodha Kite | Groww | Tickertape | Screener.in | **FinSmart** |
|---|---|---|---|---|---|
| AI BUY/SELL/HOLD signals | ✗ | ✗ | Partial | ✗ | ✅ |
| Multi-exchange signal coverage (NSE + US + EU) | ✗ | ✗ | ✗ | ✗ | ✅ |
| LLM news sentiment per stock | ✗ | ✗ | ✗ | ✗ | ✅ |
| LSTM + XGBoost ML prediction engine | ✗ | ✗ | ✗ | ✗ | ✅ |
| Portfolio import + AI hold/sell advice | ✗ | ✗ | ✗ | ✗ | ✅ |
| Macro & geo-political impact scoring | ✗ | ✗ | ✗ | ✗ | ✅ |
| Cohort performance benchmarking | ✗ | ✗ | ✗ | ✗ | ✅ |
| F&O data integration | ✅ | ✗ | Partial | ✗ | ✅ |

> **Positioning Statement**
>
> For active retail investors who can't afford a 20% signal miss rate, FinSmart is the only AI investment intelligence platform that synthesises real-time multi-exchange market data, LLM news sentiment, and ML prediction models into a single confidence-ranked signal — unlike transaction-first brokerages that execute decisions without improving them.

---

## 04 · Solution Architecture

### Data Pipeline Design

> The core architectural insight is that investment signal generation is a **multi-source data fusion problem**, not a chart-reading task. Each data type — OHLCV price action, technical indicators, news sentiment, macro events, AGM reports, F&O open interest — requires a different ingestion cadence, a different model capability, and a different quality gate before it influences a signal. The pipeline is deliberately staged so each data type is processed at the cadence appropriate to its volatility: tick data every 10 minutes; sentiment embeddings every hour; macro signals on event trigger.

```
FINSMART DATA PIPELINE — END-TO-END FLOW

  STEP 1: MULTI-SOURCE INGESTION (Kafka · 10 Topics)
  ┌──────────────────────────────────────────────────────────────────────┐
  │  Market data: NSE/BSE tick feeds · US exchanges · EU/APAC exchanges  │
  │  News scraping: Economic Times · Mint · Reuters · Bloomberg India    │
  │  Social sentiment: Twitter/X · Reddit · StockTwits · Telegram groups │
  │  Macro events: RBI decisions · SEBI notifications · crude futures    │
  │  AGM/Corporate: quarterly results · dividend announcements           │
  └──────────────────────────────────────────────────────────────────────┘
                               │
                    Kafka topic routing by data type
                               │
  STEP 2: DATA PROCESSING & STORAGE
  ┌──────────────────────────────────────────────────────────────────────┐
  │  TimescaleDB: OHLCV time-series with hypertable compression          │
  │  pgvector: 384-dim LLM sentiment embeddings per stock per hour       │
  │  PostgreSQL: fundamentals, events, AGM data, user portfolios         │
  │  Redis: 10-minute signal cache per stock · watchlist alert state     │
  └──────────────────────────────────────────────────────────────────────┘
                               │
                    Every 10 minutes (market hours) / on-demand
                               │
  STEP 3: SIGNAL GENERATION (ML Pipeline)
  ┌──────────────────────────────────────────────────────────────────────┐
  │  Feature engineering: 47 technical indicators + 12 macro features   │
  │  LSTM: sequence-based price direction prediction (5-day window)      │
  │  XGBoost: ensemble classifier (BUY / SELL / HOLD)                   │
  │  Logistic Regression: calibration layer for confidence scores        │
  │  Sentiment fusion: pgvector cosine similarity → sentiment score      │
  └──────────────────────────────────────────────────────────────────────┘
                               │
                    Signal confidence ≥ threshold (default 60%)
                               │
  STEP 4: SIGNAL ENRICHMENT (LLM Layer — Claude Haiku)
  ┌──────────────────────────────────────────────────────────────────────┐
  │  Plain-language reasoning: why this signal, what drove confidence    │
  │  Target price calculation: ATR-based; stop-loss: support level       │
  │  Trade type classification: INTRADAY vs DELIVERY                     │
  │  Risk rating: LOW / MEDIUM / HIGH based on sector + beta + VIX       │
  └──────────────────────────────────────────────────────────────────────┘
                               │
  STEP 5: DELIVERY & ANALYTICS
  ┌──────────────────────────────────────────────────────────────────────┐
  │  Push notification: signal alert to mobile app (FCM)                 │
  │  Signal history: stored per stock with outcome tracking              │
  │  Portfolio analysis: per-holding signal vs. user's avg buy price     │
  │  Cohort benchmarking: anonymised aggregate signal performance        │
  └──────────────────────────────────────────────────────────────────────┘
```

---

### Kafka Topic Architecture

```
FINSMART KAFKA TOPICS (10)

  TOPIC                       PRODUCER              CONSUMER             CADENCE
  ──────────────────────────  ──────────────────    ────────────────     ──────────
  market.price.tick           Exchange feed adapter  ML pipeline          Every 10 min
  market.ohlcv.daily          EOD aggregator         TimescaleDB writer   Daily close
  sentiment.news.raw          News scraper           LLM embedder         Every 30 min
  sentiment.social.raw        Social scraper         LLM embedder         Every 15 min
  sentiment.embeddings        LLM embedder           pgvector writer      On completion
  macro.events.trigger        Event monitor          Signal invalidator   On event
  signal.generated            ML pipeline            Signal enricher      On completion
  signal.enriched             LLM enricher           Mobile push + DB     On completion
  portfolio.import            Import processor       Portfolio analyser   On upload
  alert.watchlist             Price monitor          Push notification    On trigger
```

---

### Signal Confidence Architecture

```
SIGNAL CONFIDENCE — COMPUTATION HIERARCHY

  RAW ML OUTPUT
  ┌───────────────────────────────────────────────────────────────────┐
  │  LSTM direction probability: P(up) = 0.72, P(down) = 0.21        │
  │  XGBoost class probability:  BUY=0.68, SELL=0.18, HOLD=0.14     │
  │  Logistic calibration:       calibrated_confidence = 0.71        │
  └───────────────────────────────────────────────────────────────────┘
                               │
                        Sentiment adjustment
                               │
  ┌───────────────────────────────────────────────────────────────────┐
  │  LLM sentiment score: +0.42 (range -1.0 to +1.0)                 │
  │  Sentiment weight: 0.15 of final confidence                       │
  │  Adjusted confidence = 0.71 × 0.85 + 0.42 × 0.15 = 0.666        │
  └───────────────────────────────────────────────────────────────────┘
                               │
                        Macro override gate
                               │
  ┌───────────────────────────────────────────────────────────────────┐
  │  Active macro event (e.g. RBI rate decision in 24h)?              │
  │  YES → confidence capped at 55% (elevated uncertainty)            │
  │  NO  → confidence passed through unchanged                        │
  └───────────────────────────────────────────────────────────────────┘
                               │
                   Final signal: BUY @ 66% confidence
                   Target: ₹3,100 | Stop-Loss: ₹2,720 | Upside: +8.9%
```

---

### System Component Map

```
FINSMART — MICROSERVICE ARCHITECTURE (9 SERVICES + GATEWAY)

  ┌──────────────────────────────────────────────────────────────────────┐
  │                        REACT NATIVE MOBILE APP                      │
  │  iOS + Android · Redux Toolkit + RTK Query · MMKV offline cache     │
  │  Screens: Signals · Portfolio · Discover · Watchlist · StockDetail  │
  └──────────────────┬───────────────────────────────────────────────────┘
                     │  HTTPS + JWT (access + refresh token pair)
                     ▼
  ┌──────────────────────────────────────────────────────────────────────┐
  │                         API GATEWAY (FastAPI)                        │
  │  Rate limiting · JWT validation · service routing · audit log        │
  └──────────────────┬───────────────────────────────────────────────────┘
                     │  Internal service mesh
          ┌──────────┼────────────────────────────────────────┐
          ▼          ▼          ▼          ▼          ▼        ▼
  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
  │  Auth    │ │  Market  │ │  Signal  │ │Portfolio │ │ Watchlist│ │ Notif.   │
  │  Service │ │  Ingest  │ │  Engine  │ │ Service  │ │ Service  │ │ Service  │
  │ (FastAPI)│ │ (FastAPI)│ │ (FastAPI)│ │ (FastAPI)│ │ (FastAPI)│ │ (FastAPI)│
  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
          │          │          │                              │
          ▼          ▼          ▼                              ▼
      PostgreSQL  TimescaleDB  pgvector                      Redis
      (users,      (OHLCV       (sentiment                  (signal cache
       portfolios)  time-series) embeddings)                 watchlist state)
                         │
                    Kafka Topics (10)
                         │
              ┌──────────┼──────────────┐
              ▼          ▼              ▼
        Exchange     News/Social    AGM/Event
        Feed APIs    Scrapers       Monitor
```

---

## 05 · Core Platform Modules

### Module Design Rationale

> Each module was scoped to solve exactly one stage of the investment intelligence pipeline. Keeping modules independently operable means the system can run in partial modes (signal-only without portfolio context, portfolio analysis without live signals) — enabling faster iteration cycles and reducing blast radius when a single data source degrades.

| Module | Problem Solved | Key Design Decisions |
|---|---|---|
| **Multi-Exchange Market Ingestor** | OHLCV data fragmentation across 14 exchanges in 4 time zones | Kafka-based fan-out with per-exchange normalisation adapters; TimescaleDB hypertables for time-series compression |
| **LLM Sentiment Engine** | Unstructured news/social signal too noisy to act on directly | Claude Haiku embeds sentiment as 384-dim pgvector; cosine similarity retrieval per stock; confidence-weighted fusion into signal score |
| **ML Signal Generator** | Pure technical analysis misses sentiment and macro context | Three-model ensemble (LSTM for sequence, XGBoost for ensemble, LR for calibration); 47 technical + 12 macro features; 5-year training set |
| **Signal Enricher** | Raw ML output (probability scores) not actionable for retail investors | LLM enrichment: plain-language reasoning, ATR-based target/SL calculation, trade type classification, risk rating |
| **Portfolio Intelligence Engine** | Investors hold stocks with no systematic AI review trigger | Import from Zerodha/Angel One/Groww XLSX; per-holding signal overlay on avg buy price; cohort P&L benchmarking |
| **Watchlist & Alert Manager** | Price alerts fire on raw price movement with no signal context | Alert triggers enriched with current signal type + confidence before delivery; watchlist capacity management (50-item cap) |

### Module Interdependency Map

```
INGESTOR ──→ SENTIMENT ENGINE ──→ ML SIGNAL GENERATOR
    │               │                       │
    │           (pgvector                  (signal
    │            store)               confidence score)
    │                                       │
    └──────────────────────────────────────→│
                                            ▼
                                   SIGNAL ENRICHER
                                   (LLM reasoning +
                                    target/SL/risk)
                                            │
                         ┌──────────────────┼──────────────────┐
                         ▼                  ▼                  ▼
                  MOBILE DELIVERY    PORTFOLIO ENGINE    WATCHLIST ALERTS
                  (push + feed)      (holding overlay)   (price + signal)
                         │
                  SIGNAL ANALYTICS
                  (hit rate, accuracy,
                   cohort benchmarking)
```

---

### Plan Architecture

| Plan | Price | Signals/Day | Exchanges | Portfolio Import | Support |
|---|---|---|---|---|---|
| **Free** | ₹0 (30 days) | 5 | NSE + BSE only | Manual entry | Self-serve |
| **Starter** | ₹299/mo | 15 | All Indian indices | 1 broker import | Self-serve |
| **Pro** | ₹799/mo | Unlimited | All 14 exchanges | All brokers + manual | Priority |
| **Elite** | ₹1,999/mo | Unlimited + API | All 14 + custom | White-label + bulk | Dedicated |

> **Signal Limit Design**
>
> Limits are not arbitrary — they are calibrated to the attention bandwidth of a retail investor. Research consistently shows that investors tracking more than 15–20 active signals simultaneously experience decision paralysis and higher loss rates from impulsive exits. Limits protect signal quality as much as they manage platform costs.

---

## 06 · Data Model & Business Logic

### Entity Relationship Overview

```
users
  │
  │ 1:1
  ▼
profiles ─────────────── tax_id_encrypted (AES-256)
  │                      risk_appetite: CONSERVATIVE/MODERATE/AGGRESSIVE
  │                      exchanges: string[] (active subscriptions)
  │                      recommendation_mode: AI/MANUAL/BOTH
  │
  │ 1:N
  ▼
portfolios ──── holdings (per broker import)
  │                 │
  │                 │── symbol, exchange, qty, avg_buy_price
  │                 │── current_signal (FK → signals)
  │                 └── import_source: ZERODHA/ANGELONE/GROWW/MANUAL
  │
  │ 1:N
  ▼
watchlists ──── watchlist_items ──── alert_price (optional)
  │                                   alert_triggered_at
  │
  ▼
signal_views ──── signal_id (FK → signals)
                  viewed_at · acted_on: bool · outcome_logged: bool

signals ──── stock_id (FK → stocks)
  │          type: BUY/SELL/HOLD
  │          trade_type: INTRADAY/DELIVERY
  │          confidence: float (0–1)
  │          current_price, target_price, stop_loss, upside_pct
  │          reasoning: text[] (LLM-generated)
  │          generated_at · expires_at
  │
  │ 1:1
  ▼
signal_outcomes ──── hit_target: bool · hit_stop_loss: bool
                     actual_return_pct · resolved_at
                     (populated by price monitor post-signal)

stocks ──── exchange · sector · market_cap_tier
  │         beta · 52w_high · 52w_low · pe_ratio
  │
  ▼
sentiment_embeddings ──── vector (384-dim) · score (–1 to +1)
                          source: NEWS/SOCIAL · timestamp
```

### Key Business Logic Rules

| Logic | Rule | Why It Matters |
|---|---|---|
| **Signal Confidence Gate** | Signals below 60% confidence are generated but not surfaced on the main feed; available in "All Signals" view only | Prevents low-quality signals from polluting the primary user experience and degrading trust in the platform |
| **Macro Override** | Active macro event within 24 hours caps any signal confidence at 55% | High-impact events (RBI decisions, earnings windows) introduce systemic uncertainty that ML models cannot price in from historical patterns alone |
| **Intraday vs. Delivery Classification** | INTRADAY: signal window ≤ 1 trading day; DELIVERY: 3–30 days; determined by ATR × trade_type_classifier | Different user behaviour is required; conflating trade types leads to intraday signals being held and delivery signals being exited intraday |
| **Portfolio Signal Overlay** | Signal for a held stock is contextualised against avg_buy_price: SELL signal on a -15% holding shown as "Cut Loss" not just "SELL" | Absolute signal type without holding context is misleading; a SELL on a 40% gain is different from a SELL on a 15% loss |
| **Cohort k-Anonymity Floor** | Cohort performance benchmarks require minimum 50 members in the cohort before the aggregate is surfaced | Protects individual portfolio privacy; prevents reverse-engineering of specific user holdings from aggregate statistics |
| **Tax ID Encryption** | AES-256 encryption for Tax ID (PAN/AADHAAR); decrypted only at import time; never stored in plaintext | Regulatory requirement under Indian data protection frameworks; PAN number exposure is a direct identity theft vector |
| **Signal Hit Rate Calculation** | `hit_rate = count(hit_target) / count(resolved_signals) × 100`; only signals with resolved outcomes (target hit or SL hit) are included | Pending signals excluded to prevent denominator inflation during market stress periods when outcomes resolve slowly |
| **Watchlist Capacity Enforcement** | Hard cap of 50 items per watchlist; enforced at add-time with capacity bar shown above 40 items | Cognitive overload above 50 tracked stocks correlates with lower signal act-on rates in user research; limits protect engagement quality |

### Core Table Summary

| Table | Purpose | Key Fields |
|---|---|---|
| `users` | Auth and subscription record | `tier`, `is_onboarded`, `location_granted`, `trial_end_at` |
| `profiles` | Investor configuration | `risk_appetite`, `exchanges`, `recommendation_mode`, `tax_id_encrypted` |
| `stocks` | Master security reference | `symbol`, `exchange`, `sector`, `market_cap_tier`, `beta` |
| `signals` | AI-generated trade signals | `type`, `trade_type`, `confidence`, `target_price`, `stop_loss`, `reasoning` |
| `signal_outcomes` | Signal resolution tracking | `hit_target`, `hit_stop_loss`, `actual_return_pct`, `resolved_at` |
| `holdings` | User portfolio positions | `symbol`, `exchange`, `qty`, `avg_buy_price`, `import_source` |
| `sentiment_embeddings` | Per-stock NLP sentiment vectors | `vector` (384-dim), `score`, `source`, `timestamp` |
| `watchlist_items` | User watchlist entries | `symbol`, `exchange`, `alert_price`, `alert_triggered_at` |
| `notifications` | Alert and signal delivery queue | `type`, `signal_id`, `priority`, `is_read`, `delivered_at` |

---

## 07 · AI & ML Layer — Signal Generation

> **Design Philosophy**
>
> Investment signal generation is a layered inference problem. Price action tells you what happened; technicals tell you the statistical pattern; sentiment tells you what the market believes; macro context tells you the regime. Each layer reduces a different type of uncertainty. The architecture explicitly separates these four inference layers and fuses them only at the final confidence calculation — because fusing them earlier makes it impossible to debug which layer degraded when signals miss.

### ML Model Architecture

```
FINSMART ML SIGNAL PIPELINE — THREE-MODEL ENSEMBLE

  FEATURE ENGINEERING (47 technical + 12 macro features)
  ┌──────────────────────────────────────────────────────────────────────┐
  │  Technical: RSI, MACD, EMA(9/20/50/200), Bollinger Bands, ATR,       │
  │             Stochastic, ADX, OBV, CCI, VWAP, Ichimoku, Williams %R  │
  │  Macro:     Nifty/Sensex trend, crude oil price, USD/INR, VIX India, │
  │             FII/DII net flow, RBI rate (days since last change),      │
  │             sector rotation index, options PCR                        │
  └──────────────────────────────────────────────────────────────────────┘
                               │
               ┌───────────────┼───────────────┐
               ▼               ▼               ▼
  ┌─────────────────┐ ┌──────────────────┐ ┌──────────────────┐
  │     LSTM         │ │    XGBoost        │ │  Logistic Regr.  │
  │  Sequence model  │ │  Ensemble tree    │ │  Calibration     │
  │  5-day window    │ │  classifier       │ │  layer           │
  │  Price direction │ │  BUY/SELL/HOLD    │ │  Confidence →    │
  │  probability     │ │  multi-class      │ │  probability     │
  └────────┬─────────┘ └────────┬─────────┘ └────────┬─────────┘
           └────────────────────┼────────────────────┘
                                │
                       Ensemble fusion (weighted vote)
                       LSTM weight: 0.45
                       XGBoost weight: 0.40
                       LR calibration: 0.15
                                │
                                ▼
                      Raw signal class + confidence
                                │
                   Sentiment fusion (+pgvector layer)
                                │
                   Macro override gate (event calendar)
                                │
                   Final: BUY/SELL/HOLD @ confidence%
```

### LLM Enrichment Architecture

```
SIGNAL ENRICHMENT — CLAUDE HAIKU CALL STRUCTURE

  CALL STRUCTURE              CACHE TIER          COST IMPACT
  ─────────────────────────   ──────────────      ─────────────────────────
  System prompt               Cache breakpoint    Written once per deployment
  (enrichment rules ~200t)    point 1             Read at 90% discount thereafter

  Stock profile + history     Cache breakpoint    Written once per stock
  (technicals snapshot ~600t) point 2             Same stock → cache hit on repeat calls

  Current signal context      NOT CACHED          Charged at standard input rate
  (ML output + sentiment ~300t) (dynamic tail)

  RESULT: On a 50-signal batch (market open), ~75% of static input cost
  is eliminated. At $0.0008/1K tokens, saves ~$0.018 per batch.
  Compounds to significant savings during high-volatility market days.
```

### Sentiment Embedding Pipeline

```
NEWS/SOCIAL TEXT → LLM SENTIMENT EMBEDDING FLOW

  Raw text (headline / post / report)
           │
           ▼
  Preprocessing: remove boilerplate, extract stock mentions,
  normalise ticker aliases (TCS = "Tata Consultancy" = "TCS.NS")
           │
           ▼
  Claude Haiku: generate 384-dim embedding + sentiment score (–1 to +1)
           │
           ▼
  pgvector store: upsert embedding with (symbol, source, timestamp)
           │
           ▼
  At signal generation time:
  pgvector cosine query: retrieve top-5 most recent embeddings per stock
  Weighted average sentiment score (recency decay: 1h=1.0, 6h=0.6, 24h=0.2)
           │
           ▼
  Sentiment score injected into confidence calculation (weight: 0.15)
```

### Model Training & Retraining Strategy

| Trigger | Action | Cadence |
|---|---|---|
| Scheduled retraining | Full LSTM + XGBoost retrain on 5-year + new data | Weekly (Sunday 02:00 IST) |
| Signal hit rate drops below 45% over 30-day rolling window | Alert to ML team; emergency retrain trigger | On threshold breach |
| New exchange onboarded | Per-exchange model variant trained on exchange-specific data | On exchange launch |
| Black swan event detected (VIX > 35) | Confidence cap applied to all signals; models deprioritised; macro override active | Automatic |
| Manual override | ML team can suppress specific stock signals pending investigation | Ad-hoc |

---

## 08 · Signal Analytics & Portfolio Intelligence

> **Design Rationale**
>
> Most investment apps show you what happened — P&L, portfolio value, transaction history. FinSmart is built around *why* it happened and *what to do next*. The analytics layer surfaces three things: which signals led to actual gains, which market conditions produce the best hit rates for a given risk profile, and how the user's portfolio performance compares to anonymised peers. The goal is to make the feedback loop shorter — from months of intuition-building to a dashboard-driven calibration cycle.

### Signal Hit Rate Funnel

```
SIGNAL OUTCOME HIERARCHY

  GENERATED (100%)
       │
       │  ← Pre-resolution signals (pending):
       │    Not yet hit target or stop-loss (n)
       │
  ┌────▼───────────────────────────────────────────┐
  │  ⭐ HIT TARGET  XX%  (north star)               │  ← highlighted gate row
  │  "Signal reached target before stop-loss"      │
  └────┬───────────────────────────────────────────┘
       │
       │  Sub-outcomes within hit signals:
       ├── Hit target within 1 day    (INTRADAY signals)
       ├── Hit target within 1 week   (short DELIVERY)
       └── Hit target within 1 month  (medium DELIVERY)

  Pre-gate outcomes shown as side stats:
  Hit Stop-Loss (n) · Expired unresolved (n)

  North star callout:
  "FinSmart optimises signals to reach target before stop-loss.
   Execution timing and position sizing depend on you."

  Signal Hit Rate = Hit Target / (Hit Target + Hit Stop-Loss) × 100
```

### Portfolio Intelligence Dimensions

| Dimension | Signal | Action |
|---|---|---|
| **Signal hit rate by sector** | Which sectors produce the most reliable signals for this user's risk profile | Adjust sector exposure in watchlist and search preferences |
| **Signal hit rate by trade type** | Does INTRADAY or DELIVERY produce better outcomes for this user | Personalise default trade type recommendation per user |
| **Signal hit rate by confidence band** | Does the 60–70% band underperform vs. 80%+ band empirically | Recommend user raise their personal confidence threshold |
| **Portfolio vs. cohort benchmark** | How this user's portfolio P&L compares to anonymised peers with similar profiles | Identify whether underperformance is idiosyncratic or systematic |
| **Skill demand matrix (for stocks)** | Which sectors and stocks appear most in signals that actually hit target | Guide watchlist curation toward high-signal-quality sectors |
| **Macro correlation heatmap** | Which macro events (RBI, crude, USD/INR) most impacted signal outcomes | Help user understand regime sensitivity of their portfolio |

### Portfolio Import & AI Review Flow

```
PORTFOLIO IMPORT → SIGNAL OVERLAY FLOW

  User uploads broker statement (XLSX)
           │
           ▼
  Parser: detect broker format (Zerodha / Angel One / Groww / Manual)
  Extract: symbol, exchange, qty, avg_buy_price, import_date
           │
           ▼
  Holdings written to DB
           │
           ▼
  For each holding:
  ┌─────────────────────────────────────────────────────────────────────┐
  │  Is there an active signal for this stock?                          │
  │  YES → Overlay signal on holding:                                   │
  │         BUY signal + holding already profitable → "Add to Position" │
  │         SELL signal + holding profitable → "Book Profit"            │
  │         SELL signal + holding at loss → "Cut Loss"                  │
  │         HOLD signal → "Monitor — no action required"                │
  │  NO  → "No current AI signal — next signal in ~X hours"             │
  └─────────────────────────────────────────────────────────────────────┘
           │
           ▼
  Portfolio summary: Total value · P&L · AI suggestions by holding
  Cohort benchmark: compare to peers (k-anonymity ≥ 50 members)
```

---

## 09 · Go-to-Market Strategy

### Market Entry Phases

```
PHASE 1 — Beachhead: Active Retail Traders, India (Q1–Q2 2025)
  Target:   NSE/BSE active traders; Nifty50 + midcap focus
  Pain:     Manual analysis bottleneck; tip-driven decisions; zero signal tracking
  Motion:   Free trial → paid conversion via first signal hit event
  Hook:     "Your first AI-predicted shortlist. Know what the market rewards."

PHASE 2 — Expansion: Delivery Investors + NRI Segment (Q3–Q4 2025)
  Target:   Long-hold equity investors; Indian diaspora in UAE/UK/US
  Pain:     No multi-exchange unified view; no systematic hold/sell review cadence
  Motion:   Portfolio import hook (Zerodha/Groww XLSX) → AI hold/sell suggestions
  Hook:     "Upload your portfolio. Get AI hold/sell advice in 60 seconds."

PHASE 3 — Platform & Ecosystem (2026+)
  Target:   SEBI-RIAs managing client portfolios; wealth tech platforms
  Motion:   White-label signal dashboard + API licensing for embedded intelligence
  Hook:     Platform layer — FinSmart as the intelligence layer inside advisory tools
```

### Pricing Strategy

| Tier | Price | Target | Expansion Lever |
|---|---|---|---|
| **Free** | ₹0 / 30 days | Discovery; building signal hit rate baseline | Natural conversion after first signal hit event |
| **Starter** | ₹299/mo | Active NSE/BSE retail traders | Hits signal limit rapidly in active search periods (earnings season, budget) |
| **Pro** | ₹799/mo | Multi-exchange investors; delivery + intraday mix | Full signal analytics + portfolio import creates stickiness |
| **Elite** | ₹1,999/mo | RIAs, NRI investors, wealth tech integrators | API access + white-label potential + multi-portfolio management |

> **Conversion Design**
>
> The free trial is not a feature-limited version. It is a full-capability run with a 30-day window — calibrated to give the user enough time to receive signals across at least one market cycle (earnings releases, macro events), track at least 3 signal outcomes, and see a feedback signal before the conversion decision. The first signal-hit event is the conversion trigger, not a paywall.

### Sales Motion

| Channel | Target Segment | Approach |
|---|---|---|
| Inbound / SEO | All tiers | Content around "best stocks to buy today" + "AI stock signals India" — owned intent keywords with high search volume, low paid competition |
| Product-led free trial | Starter | Self-serve with zero sales touch; in-app trigger at first signal hit event |
| Community outbound | Pro individual investors | Targeted engagement in investment-focused communities (TradingQnA, Varsity forums, Reddit r/IndiaInvestments) |
| Partnership / B2B | RIA and coaching market | Co-sell with SEBI-registered advisory platforms; revenue share model |
| API licensing | Wealth tech / fintech | Enterprise AE led; pilot programme → annual contract |

---

## 10 · Feature Roadmap

### Milestone Summary

| Milestone | Timeline | Theme | Success Gate |
|---|---|---|---|
| **MVP** | Q1 2025 | Core signal engine | 50+ pilot users · signal pipeline stable · hit rate tracked |
| **V1.0** | Q2 2025 | Full platform + portfolio intelligence | 500+ paying users · ₹15L+ MRR · portfolio import live · NPS >45 |
| **V2.0** | Q4 2025 | Analytics + platform expansion | 2,000+ users · ₹60L+ MRR · API programme · 55%+ signal hit rate |
| **2026+** | Ongoing | Ecosystem + international | White-label · US/EU exchange coverage · UAE/UK NRI market entry |

### MVP — Q1 2025

| Feature | Rationale |
|---|---|
| NSE/BSE real-time signal feed | Core value delivery — the signal is the product |
| LSTM + XGBoost signal engine (NSE/BSE) | Primary intelligence layer; without it the app is a price ticker |
| LLM signal enrichment (reasoning + target/SL) | Makes raw ML output actionable for non-technical retail investors |
| Stock Detail screen (chart + 5 tabs) | Minimum viable depth for a user to validate a signal before acting |
| Watchlist with price alerts | Captures intent to monitor; creates daily active usage habit |
| User auth + risk appetite onboarding | Personalises signal feed from day one; prevents irrelevant signal noise |

### V1.0 — Q2 2025

| Feature | Rationale |
|---|---|
| Portfolio import (Zerodha, Angel One, Groww XLSX) | Closes the loop from signals to existing holdings; highest-intent engagement hook |
| Signal outcome tracking (Hit / Miss / Pending) | Enables signal hit rate calculation; closes the feedback loop |
| Signal Analytics dashboard | First version of the learning loop — hit rate by sector, confidence band, trade type |
| Multi-exchange coverage (NASDAQ, S&P, DAX) | Opens NRI segment and multi-exchange portfolio holders |
| LLM news sentiment integration (full pipeline) | Improves signal quality; reduces macro-driven false positives |
| Push notifications (signal alerts, watchlist hits) | Creates pull back to app; reduces uninstall rate from silent failures |

### V2.0 — Q4 2025

| Feature | Rationale |
|---|---|
| Cohort performance benchmarking | Highest-value analytics feature; answers "am I a good investor vs. peers" |
| Macro impact scoring per holding | Tells users which of their holdings are most exposed to upcoming events |
| F&O signal integration (PCR, OI, IV) | Opens derivative trader segment; adds depth for advanced users |
| Scheduled signal digest (daily/weekly) | Fire-and-forget mode for users who want a morning briefing not active monitoring |
| SEBI-RIA white-label dashboard | Opens B2B revenue stream; enables professional advisor use case |
| API programme (signal + portfolio intelligence) | Platform layer for wealth tech integrators |

---

## 11 · Risk Assessment

### Technical Risks

| Risk | Severity | Mitigation |
|---|---|---|
| **Exchange feed latency and outages** | High | Multi-provider feed redundancy; fallback to delayed data with user notification; circuit breaker per exchange |
| **ML model degradation post-regime change** | High | 30-day rolling hit rate monitoring; auto-alert below 45%; weekly retraining on new data; black swan confidence cap |
| **LLM hallucination in signal reasoning** | High | Reasoning generated from structured ML output only (not market data directly); factual fields (price, target, SL) computed from ATR formulas, not LLM; user-facing disclaimer on all signals |
| **Kafka consumer lag during market open** | Medium | Per-topic consumer group lag monitoring; auto-scaling signal enrichment workers; priority queue for high-confidence signals |
| **pgvector query latency at scale** | Medium | Index type: IVFFlat with 100 lists; approximate nearest neighbour acceptable for sentiment use case; query cache for repeat stock lookups |
| **MMKV cache staleness on mobile** | Medium | 10-minute TTL on all cached signal data; version hash on signal objects; hard invalidation on market open/close events |

### Business Risks

| Risk | Severity | Mitigation |
|---|---|---|
| **SEBI regulatory action on AI investment advice** | High | Signals explicitly framed as "informational" not "advice"; SEBI disclaimer on every signal; no personalised portfolio management claim; legal review before launch |
| **Low trial-to-paid conversion** | High | First signal-hit as conversion trigger; in-app celebration moment on hit; NPS loop from week 2 |
| **LLM inference cost overruns at scale** | Medium | Claude Haiku for enrichment (cheapest capable model); prompt caching on stock profiles; signal batching at market open; BYOLLM for Elite tier |
| **Broker XLSX format changes breaking import** | Medium | Per-broker parser versioning; format detection + graceful failure to manual entry; changelog monitoring for Zerodha/Groww API updates |

### Market Risks

| Risk | Severity | Mitigation |
|---|---|---|
| **Zerodha / Groww building native AI signals** | High | Moat in multi-exchange coverage (brokerages are single-exchange); signal outcome tracking (no broker closes the loop); neutral platform positioning |
| **Investor reluctance to trust AI signals** | Medium | Explicit hit rate display per signal type; historical accuracy shown per stock; signal reasoning transparency; "verify before you act" UX copy |
| **SEBI tightening algorithmic trading regulations** | Medium | Platform provides signals only, not execution; architecture keeps signal generation and order execution strictly separated; regulatory counsel on retainer |
| **Market downturn reducing active investor base** | Low-Medium | Signals cover SELL/SHORT setups; bear market = increased need for protective signals; subscription pricing anchored to value (signal quality), not market direction |

---

## 12 · PM Competencies Demonstrated

### Product Thinking Competency Map

| Competency | Demonstrated Through |
|---|---|
| **North Star Metric Design** | Signal Hit Rate chosen over signal volume or user engagement — a counter-intuitive decision that reframes the entire product. All ML training objectives, confidence thresholds, and analytics are organised around moving this single number. |
| **Pipeline Thinking** | The signal generation system is architected as a four-layer inference pipeline (price action → technicals → sentiment → macro), not a single model. Each layer has a defined input, a different model type, and independent failure modes — enabling layer-by-layer debugging when signals miss. |
| **Cost-Aware AI Architecture** | Smart model routing (Haiku for enrichment, full ensemble only for high-confidence signals) + prompt caching on stock profiles + signal batching — three independent cost levers operating in the same system without sacrificing quality. |
| **Feedback Loop as Product Strategy** | The signal outcome tracking system is not a reporting feature — it is the product's primary learning mechanism. Hit rate, cohort benchmarking, and macro correlation heatmaps all exist to close the loop between signal quality and investor behaviour change. |
| **Regulatory Design as First-Class Constraint** | SEBI disclaimer on every signal, PAN encryption with AES-256, k-anonymity floor on cohort data, and strict separation between signal generation and execution are all present before the platform scales — not retrofitted after a regulatory enquiry. |
| **Expansion Revenue by Design** | The Elite tier API programme is not just a feature gate — it's a deliberate moat in the B2B segment. RIAs and wealth tech platforms that integrate FinSmart signals have the highest LTV and the lowest churn. The B2B motion is sequenced to V2.0 precisely when signal accuracy history is strong enough to underpin commercial SLAs. |
| **Multi-Source Data Fusion Architecture** | The Kafka + TimescaleDB + pgvector stack creates a provider-agnostic data layer that normalises tick feeds from 14 exchanges, strips exchange-specific formatting, and feeds a unified feature set to the ML models — all transparently at the ingestion layer, not duplicated per exchange. |
| **Constraint-First Analytics** | Signal hit rate calculation excludes pending signals; cohort benchmarking requires k ≥ 50; macro override caps confidence at 55% — all encode business constraints (what is and isn't a valid signal quality measurement) as data model decisions, not display-layer heuristics. |
| **Persona-Specific UX Architecture** | Three-stage onboarding (location gate → exchange selection → risk appetite) creates a structured activation journey where the signal feed is personalised before the user sees their first signal — reducing irrelevant noise and increasing act-on rates from day one. |
| **Roadmap Sequencing Logic** | Cohort benchmarking and macro correlation analytics are sequenced to V2.0, after outcome tracking (V1.0) has accumulated enough resolved signals to make them statistically meaningful. Building analytics before signal history exists produces vanity dashboards. |

### What Differentiates This Case Study

> This is not a feature specification. It is a **product strategy record** — showing how a platform is designed to win a specific niche through architectural choices that compound over time, not just through functional completeness.

**Five things that signal senior PM thinking:**

1. **North star clarity over vanity metrics** — Choosing signal hit rate over DAU or signal volume is a deliberate product strategy decision. DAU is easy to inflate with notifications; hit rate is hard to fake. Building around outcome quality from day one prevents the platform from optimising for engagement while degrading investor outcomes.

2. **Four-layer inference architecture** — Separating price action, technicals, sentiment, and macro into discrete pipeline layers is a debuggability decision as much as a quality decision. When signals miss, you need to know which layer failed. Monolithic models hide the failure mode; staged pipelines expose it.

3. **Feedback loop as competitive moat** — The signal outcome data that accumulates on FinSmart is not available anywhere else. No broker, no financial news platform, no charting tool closes the loop from signal to outcome at the individual investor level. The longer a user tracks outcomes on the platform, the richer their personal accuracy dataset — and the harder it is to replicate elsewhere.

4. **Regulatory design that doesn't require trust** — The SEBI disclaimer, signal-execution separation, and k-anonymity floor on cohort data are not compliance checkboxes — they are architectural constraints that make the platform structurally defensible against regulatory action. The design doesn't ask the regulator to trust that the platform is responsible; it makes irresponsible use structurally impossible at every layer.

5. **Analytics that encode business understanding** — The macro override confidence cap (VIX > 35 → cap at 55%), the cohort k-anonymity floor (≥ 50 members), and the signal hit rate exclusion of pending signals all reflect a clear mental model of what constitutes valid signal quality measurement. Encoding domain understanding into the data model is what separates investment intelligence from financial data display.

---

## 13 · Key Metrics & KPIs

### Business Metrics

| Metric | Target | Measurement Frequency |
|---|---|---|
| MRR / ARR | ₹15L MRR by V1.0 · ₹60L MRR by V2.0 | Monthly |
| Trial-to-Paid Conversion | >20% within 30 days of trial start | Weekly |
| QoQ Revenue Growth | 35%+ in first 18 months | Quarterly |
| Monthly Churn Rate | <4% | Monthly |
| Net Promoter Score (NPS) | Target >50 by V1.0 | Quarterly survey |
| Customer Acquisition Cost (CAC) | <₹800 blended (all channels) | Monthly |
| LTV / CAC Ratio | >4× at 12 months | Quarterly |

### Product Metrics

| Metric | Target | Why It Matters |
|---|---|---|
| **Signal Hit Rate** (north star) | ≥55% of resolved signals hit target before stop-loss | The single number that validates the ML pipeline is working |
| Time to First Signal Hit | <7 days from first active session | First hit is the activation event; drives retention and conversion |
| Signal Act-On Rate | >30% of surfaced signals result in watchlist add or portfolio action | Measures whether signals are perceived as credible and actionable |
| Signal Outcome Logging Rate | >65% of expired signals receive a user-confirmed outcome | Data density required for hit rate analytics to be statistically valid |
| Portfolio Import Completion | >50% of Pro/Elite users import at least one portfolio | Validates portfolio intelligence as a real purchase driver |
| Watchlist to Signal Conversion | >40% of watchlist items receive an actionable signal within 14 days | Measures whether the watchlist is seeding the signal discovery loop |
| Cohort Benchmark Engagement | >40% of active users view cohort analytics monthly | Measures whether the feedback loop is driving portfolio behaviour change |

### Technical Metrics

| Metric | Target |
|---|---|
| Signal Generation Latency | <60s from market data ingest to mobile push delivery |
| ML Ensemble Inference Time | <8s per stock for full three-model ensemble |
| Kafka Consumer Lag (peak) | <30s lag on `signal.generated` topic during market open |
| Prompt Cache Hit Rate | ≥70% on stock profile block after first enrichment call |
| pgvector Query Latency | <120ms p95 for top-5 sentiment retrieval per stock |
| API Response Time | <200ms at p95 for mobile app endpoints |
| Signal Pipeline Uptime | ≥99.5% during market hours (09:15–15:30 IST) |
| Tax ID Decrypt Failure Rate | 0% — any AES-256 failure blocks import with clear user error |

---

*Portfolio Document · FinSmart · Senior Product Manager*

*B2C Mobile SaaS · AI Investment Intelligence · Multi-Exchange Signal Engine · React Native · Available for DACH / Dubai relocation*
