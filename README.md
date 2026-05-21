# FinSmart — AI-Powered Investment Intelligence Platform

> **B2C Mobile SaaS · React Native · FastAPI · Kafka · LSTM + XGBoost · Claude Haiku**
>
> A production-grade investment intelligence platform that collapses real-time multi-exchange market data ingestion, LLM-powered sentiment analysis, ML signal generation, and portfolio analytics into a single autonomous mobile agent — built for retail investors who want institutional-grade signals, not just price tickers.

---

## Table of Contents

1. [What is FinSmart?](#what-is-finsmart)
2. [The Problem](#the-problem)
3. [Market Opportunity](#market-opportunity)
4. [Architecture Overview](#architecture-overview)
5. [Repository Structure](#repository-structure)
6. [Core Modules](#core-modules)
7. [AI & ML Layer](#ai--ml-layer)
8. [Mobile App](#mobile-app)
9. [Data Model](#data-model)
10. [Pricing & Plans](#pricing--plans)
11. [Feature Roadmap](#feature-roadmap)
12. [Getting Started](#getting-started)
13. [Key Metrics & KPIs](#key-metrics--kpis)
14. [Risks & Mitigations](#risks--mitigations)

---

## What is FinSmart?

FinSmart is an AI investment intelligence platform built for retail investors who are tired of making decisions blind. Every financial app — Zerodha Kite, Groww, Angel One — is architected around *transaction execution*, not *signal quality*. They help investors act; they do nothing to improve the probability that the action leads to a gain.

FinSmart is built around the inverse insight: **investment decisions are a prediction problem**, and prediction problems are solved by combining structured market data with unstructured signal intelligence at scale.

**North Star Metric:** Signal Hit Rate — the percentage of AI-generated BUY/SELL signals where the target price is reached before the stop-loss, within the signal window.

| Attribute | Detail |
|---|---|
| **Domain** | B2C Mobile SaaS · AI Investment Intelligence |
| **Architecture** | Real-time data pipeline + LLM sentiment + ML signal engine + React Native |
| **Exchanges Covered** | NSE, BSE, NASDAQ, NYSE, S&P 500, DOW, DAX, LSE, HangSeng, CAC, KOSPI, Nikkei, Gift Nifty (14 total) |
| **Revenue Target** | ₹5 Cr ARR by end of Year 2 |
| **Target Users** | Active retail traders, delivery investors, SEBI-registered advisors (RIAs), NRI investors |

---

## The Problem

Retail investors conducting active market participation are running three disconnected processes — **discovery** (which stocks to track), **analysis** (whether to buy/sell/hold), and **tracking** (understanding whether past signals worked) — stitched together manually across brokerage apps, financial news, social media, and analyst reports.

| Pain Point | Business Impact |
|---|---|
| **Signal overload without prioritisation** | Hundreds of price alerts and tips daily with no quality ranking mechanism |
| **Manual analysis bottleneck** | Evaluating one stock across technicals, fundamentals, news, and macro takes 45–90 minutes |
| **No signal quality feedback loop** | Investors cannot attribute losses to timing, sector rotation, or poor signal quality |
| **Multi-exchange portfolio fragmentation** | No unified view of cross-exchange portfolio risk across NSE, BSE, and US exchanges |
| **Macro and sentiment opacity** | No tool quantifies how macro events (RBI, crude, geopolitical) impact individual holdings |

---

## Market Opportunity

| Market | Size | Basis |
|---|---|---|
| **TAM** | $34B | Global retail investment analytics and wealth tech software |
| **SAM** | $5.8B | AI-powered stock signal and portfolio intelligence (mobile-first, retail focus) |
| **SOM** | $780M | India + NRI + DACH active retail investor segment; NSE/BSE + US exchanges |

### Competitive Positioning

| Capability | Zerodha | Groww | Tickertape | Screener | **FinSmart** |
|---|---|---|---|---|---|
| AI BUY/SELL/HOLD signals | ✗ | ✗ | Partial | ✗ | ✅ |
| Multi-exchange (NSE + US + EU) | ✗ | ✗ | ✗ | ✗ | ✅ |
| LLM news sentiment per stock | ✗ | ✗ | ✗ | ✗ | ✅ |
| LSTM + XGBoost ML engine | ✗ | ✗ | ✗ | ✗ | ✅ |
| Portfolio import + AI hold/sell | ✗ | ✗ | ✗ | ✗ | ✅ |
| Macro & geopolitical impact scoring | ✗ | ✗ | ✗ | ✗ | ✅ |
| Cohort performance benchmarking | ✗ | ✗ | ✗ | ✗ | ✅ |

---

## Architecture Overview

### End-to-End Data Pipeline

```
STEP 1: MULTI-SOURCE INGESTION (Kafka · 10 Topics)
  Market data: NSE/BSE tick feeds · US/EU/APAC exchanges
  News scraping: Economic Times · Mint · Reuters · Bloomberg India
  Social sentiment: Twitter/X · Reddit · StockTwits · Telegram
  Macro events: RBI decisions · SEBI notifications · crude futures
  AGM/Corporate: quarterly results · dividend announcements
                         ↓
STEP 2: DATA PROCESSING & STORAGE
  TimescaleDB   → OHLCV time-series (hypertable compression)
  pgvector      → 384-dim LLM sentiment embeddings per stock per hour
  PostgreSQL    → fundamentals, events, AGM data, user portfolios
  Redis         → 10-minute signal cache · watchlist alert state
                         ↓
STEP 3: SIGNAL GENERATION (ML Pipeline — every 10 min, market hours)
  Feature engineering: 47 technical indicators + 12 macro features
  LSTM          → sequence-based price direction prediction (5-day window)
  XGBoost       → ensemble classifier (BUY / SELL / HOLD)
  Logistic Reg. → calibration layer for confidence scores
  Sentiment fusion: pgvector cosine similarity → sentiment score
                         ↓  [confidence ≥ 60%]
STEP 4: SIGNAL ENRICHMENT (Claude Haiku)
  Plain-language reasoning · Target price (ATR-based) · Stop-loss
  Trade type: INTRADAY vs DELIVERY · Risk rating: LOW / MEDIUM / HIGH
                         ↓
STEP 5: DELIVERY & ANALYTICS
  Push notification (FCM) · Signal history · Portfolio overlay
  Cohort benchmarking · Signal outcome tracking
```

### Kafka Topic Architecture (10 Topics)

| Topic | Producer | Consumer | Cadence |
|---|---|---|---|
| `market.price.tick` | Exchange feed adapter | ML pipeline | Every 10 min |
| `market.ohlcv.daily` | EOD aggregator | TimescaleDB writer | Daily close |
| `sentiment.news.raw` | News scraper | LLM embedder | Every 30 min |
| `sentiment.social.raw` | Social scraper | LLM embedder | Every 15 min |
| `sentiment.embeddings` | LLM embedder | pgvector writer | On completion |
| `macro.events.trigger` | Event monitor | Signal invalidator | On event |
| `signal.generated` | ML pipeline | Signal enricher | On completion |
| `signal.enriched` | LLM enricher | Mobile push + DB | On completion |
| `portfolio.import` | Import processor | Portfolio analyser | On upload |
| `alert.watchlist` | Price monitor | Push notification | On trigger |

### Microservice Architecture (9 Services + Gateway)

```
React Native Mobile App (iOS + Android)
  │  HTTPS + JWT (access + refresh token pair)
  ▼
API Gateway (FastAPI) — rate limiting · JWT validation · audit log
  │
  ├── Auth Service         (FastAPI → PostgreSQL)
  ├── Market Data Service  (FastAPI → TimescaleDB + Kafka)
  ├── Signal Service       (FastAPI → pgvector + Redis + Kafka)
  ├── Portfolio Service    (FastAPI → PostgreSQL)
  ├── Watchlist Service    (FastAPI → Redis)
  ├── Notification Service (FastAPI → FCM)
  ├── Sentiment Service    (FastAPI → pgvector + Kafka)
  ├── Cohort Service       (FastAPI → PostgreSQL)
  └── News/Events Service  (FastAPI → Kafka)
```

---

## Repository Structure

```
finsmart/
├── backend/
│   ├── api-gateway/          # FastAPI gateway: JWT auth, rate limiting, routing
│   ├── user-service/         # Auth, profiles, subscription management
│   ├── market-data-service/  # Exchange feed adapters, OHLCV ingest
│   ├── signal-service/       # Signal generation, confidence scoring, caching
│   ├── sentiment-service/    # LLM embedding pipeline, pgvector writes
│   ├── portfolio-service/    # Portfolio import, holdings, AI overlay
│   ├── watchlist-service/    # Watchlist CRUD, price alert management
│   ├── notification-service/ # FCM push delivery queue
│   ├── news-events-service/  # News scraper, AGM event monitor
│   ├── cohort-service/       # Anonymised cohort benchmarking
│   └── requirements-base.txt # Shared Python dependencies
│
├── ml-engine/
│   ├── feature_engineering/  # 47 technical + 12 macro feature builders
│   ├── ml_models/            # LSTM, XGBoost, Logistic Regression models
│   ├── training/             # Training scripts + dataset loaders (5-year history)
│   ├── model_serving/        # Inference API for signal generation
│   ├── llm_pipeline/         # Claude Haiku enrichment + prompt caching
│   └── experiments/          # MLflow experiment tracking
│
├── mobile/                   # React Native app (iOS + Android)
│   ├── src/
│   │   ├── screens/          # Signals · Portfolio · Discover · Watchlist · StockDetail
│   │   ├── components/       # Shared UI components
│   │   ├── store/            # Redux Toolkit + RTK Query
│   │   ├── services/         # API client layer
│   │   ├── hooks/            # Custom React hooks
│   │   ├── navigation/       # React Navigation stack + bottom tabs
│   │   ├── types/            # TypeScript type definitions
│   │   ├── constants/        # App constants, theme tokens
│   │   └── utils/            # Formatters, helpers
│   ├── android/
│   ├── ios/
│   └── package.json
│
├── mobile-expo/              # Expo variant (development/demo)
├── infrastructure/
│   ├── k8s/                  # Kubernetes manifests
│   ├── terraform/            # Cloud infrastructure as code
│   └── monitoring/           # Observability stack (Grafana, Prometheus)
│
├── tests/
│   ├── backend/              # Service integration tests
│   ├── ml-engine/            # Model accuracy + pipeline tests
│   └── mobile/               # React Native component tests
│
├── docs/
│   └── FinSmart_Architecture_v1.docx
│
├── docker-compose.yml        # Full local stack: Kafka + Postgres + Redis + all services
├── FinSmart_PM_Portfolio.md  # Full product strategy document
└── README.md
```

---

## Core Modules

Each module is independently operable — the system can run in partial modes (signal-only without portfolio context, portfolio analysis without live signals), enabling faster iteration and reducing blast radius when a single data source degrades.

### 1. Multi-Exchange Market Ingestor
Normalises OHLCV data from 14 exchanges across 4 time zones into a unified TimescaleDB hypertable. Per-exchange adapters handle format differences; Kafka fan-out decouples ingest from downstream consumers.

### 2. LLM Sentiment Engine
Raw news and social text is too noisy to act on directly. Claude Haiku converts each article or post into a 384-dimensional pgvector embedding plus a sentiment score (−1 to +1). At signal generation time, the top-5 most recent embeddings per stock are retrieved via cosine similarity and fused into the confidence calculation with recency decay (1h=1.0, 6h=0.6, 24h=0.2).

### 3. ML Signal Generator
Three-model ensemble trained on 5 years of historical data:

- **LSTM** (weight 0.45) — sequence-based price direction prediction over a 5-day window
- **XGBoost** (weight 0.40) — multi-class ensemble classifier: BUY / SELL / HOLD
- **Logistic Regression** (weight 0.15) — calibration layer converting raw probabilities to confidence scores

Input features: 47 technical indicators (RSI, MACD, EMA 9/20/50/200, Bollinger Bands, ATR, Stochastic, ADX, OBV, CCI, VWAP, Ichimoku, Williams %R) + 12 macro features (Nifty/Sensex trend, crude oil price, USD/INR, VIX India, FII/DII net flow, RBI rate, sector rotation index, PCR).

### 4. Signal Enricher (Claude Haiku)
Converts raw ML probability output into plain-language signals retail investors can act on: human-readable reasoning, ATR-based target price and stop-loss, trade type classification (INTRADAY ≤1 day vs DELIVERY 3–30 days), and a risk rating (LOW / MEDIUM / HIGH based on sector + beta + VIX).

Prompt caching is structured in two layers — system prompt and stock profile are cached at a ~90% token discount; only the dynamic signal context is charged at standard rate. This yields ~75% input cost savings on a 50-signal batch at market open.

### 5. Portfolio Intelligence Engine
Users import their broker statement (XLSX from Zerodha, Angel One, or Groww). Each holding is overlaid with the current AI signal and contextualised against the user's average buy price: "Book Profit" vs "Cut Loss" vs "Add to Position" vs "Monitor." Cohort benchmarking (k-anonymity floor: ≥50 members) shows how a user's portfolio P&L compares to anonymised peers with similar risk profiles.

### 6. Watchlist & Alert Manager
Hard cap of 50 items per watchlist (cognitive overload above this threshold correlates with lower signal act-on rates in user research). Price alerts are enriched with the current signal type and confidence before delivery — users receive contextual alerts, not bare price ticks.

---

## AI & ML Layer

### Signal Confidence Computation

```
Raw ML output
  LSTM P(up) = 0.72 · XGBoost BUY = 0.68 · LR calibrated = 0.71
                              ↓
           Ensemble fusion (weighted vote) → 0.71
                              ↓
           Sentiment adjustment (+0.42 score, weight 0.15)
           → 0.71 × 0.85 + 0.42 × 0.15 = 0.666
                              ↓
           Macro override gate:
           Active macro event within 24h? → cap at 55%
           No event?          → pass through unchanged
                              ↓
           Final: BUY @ 66% confidence
           Target: ₹3,100 · Stop-Loss: ₹2,720 · Upside: +8.9%
```

Signals below 60% confidence are generated but not surfaced on the main feed — only visible in the "All Signals" view. This prevents low-quality signals from degrading trust in the platform.

### Model Retraining Strategy

| Trigger | Action | Cadence |
|---|---|---|
| Scheduled | Full LSTM + XGBoost retrain on 5-year + new data | Weekly (Sun 02:00 IST) |
| Hit rate < 45% (30-day rolling) | Alert to ML team; emergency retrain | On threshold breach |
| New exchange added | Per-exchange model variant trained | On exchange launch |
| Black swan (VIX > 35) | Confidence cap on all signals; macro override active | Automatic |
| Manual override | ML team suppresses specific stock signals pending investigation | Ad-hoc |

---

## Mobile App

**Stack:** React Native 0.74 · TypeScript · Redux Toolkit + RTK Query · MMKV offline cache · React Navigation · Firebase Messaging (FCM) · react-native-reanimated

### Screens

| Screen | Purpose |
|---|---|
| **Signals** | Main feed — ranked AI signals with confidence, target, stop-loss, and reasoning |
| **Stock Detail** | 5-tab deep-dive: Chart · Signal · Fundamentals · News Sentiment · F&O |
| **Portfolio** | Holding-by-holding AI overlay with cohort P&L benchmark |
| **Discover** | Search and filter stocks by sector, exchange, market cap, signal type |
| **Watchlist** | Up to 50 stocks with combined price + signal alerts |

### Key Technical Decisions

- **MMKV** for offline cache with 10-minute TTL on signal data; hard invalidation on market open/close events
- **Redux Toolkit + RTK Query** for server state management and background polling during market hours
- **react-native-document-picker + XLSX** for in-app broker statement import (Zerodha/Groww/Angel One)
- **react-native-aes-crypto** for on-device PAN/tax ID encryption (AES-256) — decrypted only at import time, never stored in plaintext
- **FCM** for reliable push delivery of signal alerts and watchlist price hits

### Onboarding Flow
Three-stage activation before the user sees their first signal: (1) Location gate for exchange and market-hours personalisation, (2) Exchange selection from all 14 available, (3) Risk appetite: CONSERVATIVE / MODERATE / AGGRESSIVE. The signal feed is personalised before the first impression — reducing irrelevant noise from day one.

---

## Data Model

### Core Tables

| Table | Purpose | Key Fields |
|---|---|---|
| `users` | Auth and subscription record | `tier`, `is_onboarded`, `trial_end_at` |
| `profiles` | Investor configuration | `risk_appetite`, `exchanges`, `recommendation_mode`, `tax_id_encrypted` |
| `stocks` | Master security reference | `symbol`, `exchange`, `sector`, `market_cap_tier`, `beta` |
| `signals` | AI-generated trade signals | `type`, `trade_type`, `confidence`, `target_price`, `stop_loss`, `reasoning` |
| `signal_outcomes` | Signal resolution tracking | `hit_target`, `hit_stop_loss`, `actual_return_pct`, `resolved_at` |
| `holdings` | User portfolio positions | `symbol`, `exchange`, `qty`, `avg_buy_price`, `import_source` |
| `sentiment_embeddings` | Per-stock NLP sentiment vectors | `vector` (384-dim), `score`, `source`, `timestamp` |
| `watchlist_items` | Watchlist entries | `symbol`, `exchange`, `alert_price`, `alert_triggered_at` |
| `notifications` | Alert and signal delivery queue | `type`, `signal_id`, `priority`, `is_read`, `delivered_at` |

### Key Business Logic Rules

| Rule | Implementation |
|---|---|
| **Signal confidence gate** | Signals < 60% generated but hidden from main feed |
| **Macro override** | Active macro event within 24h caps any signal confidence at 55% |
| **Trade type classification** | INTRADAY: window ≤ 1 trading day; DELIVERY: 3–30 days (ATR-based classifier) |
| **Portfolio signal overlay** | Contextualised against `avg_buy_price` — "Cut Loss" is not the same as "SELL" |
| **Cohort k-anonymity floor** | Benchmarks require ≥ 50 cohort members before surfacing to protect privacy |
| **Tax ID encryption** | AES-256; decrypted only at import time; never stored in plaintext |
| **Signal hit rate calculation** | `hit_target / (hit_target + hit_stop_loss) × 100`; pending signals excluded from denominator |
| **Watchlist capacity cap** | Hard limit of 50 items; capacity bar shown above 40 to nudge pruning |

---

## Pricing & Plans

| Plan | Price | Signals/Day | Exchanges | Portfolio Import | Support |
|---|---|---|---|---|---|
| **Free** | ₹0 (30-day trial) | 5 | NSE + BSE | Manual entry | Self-serve |
| **Starter** | ₹299/mo | 15 | All Indian indices | 1 broker import | Self-serve |
| **Pro** | ₹799/mo | Unlimited | All 14 exchanges | All brokers + manual | Priority |
| **Elite** | ₹1,999/mo | Unlimited + API | All 14 + custom feeds | White-label + bulk | Dedicated |

The free trial is a full-capability 30-day window — not a feature-limited version. It is calibrated to let the user receive signals across at least one market cycle, track at least 3 signal outcomes, and experience a signal-hit event before the conversion decision. The first signal hit is the conversion trigger, not a paywall.

---

## Feature Roadmap

### MVP — Q2 2026 (Core Signal Engine)
NSE/BSE real-time signal feed · LSTM + XGBoost signal engine · Claude Haiku signal enrichment (reasoning + target/SL) · Stock Detail screen (chart + 5 tabs) · Watchlist with price alerts · User auth + risk appetite onboarding

Success gate: 50+ pilot users · signal pipeline stable · hit rate tracked

### V1.0 — Q4 2026 (Full Platform + Portfolio Intelligence)
Portfolio import (Zerodha, Angel One, Groww XLSX) · Signal outcome tracking (Hit / Miss / Pending) · Signal Analytics dashboard · Multi-exchange coverage (NASDAQ, S&P 500, DAX) · Full LLM news sentiment pipeline · FCM push notifications

Success gate: 500+ paying users · ₹15L+ MRR · NPS > 45

### V2.0 — Q2 2027 (Analytics + Platform Expansion)
Cohort performance benchmarking · Macro impact scoring per holding · F&O signal integration (PCR, OI, IV) · Scheduled signal digest (daily/weekly) · SEBI-RIA white-label dashboard · API programme for wealth tech integrators

Success gate: 2,000+ users · ₹60L+ MRR · 55%+ signal hit rate

### 2026+ (Ecosystem + International)
White-label ecosystem · UAE/UK NRI market entry · US/EU exchange expansion · BYOLLM option for Elite tier

---

## Getting Started

### Prerequisites
- Docker + Docker Compose
- Node 20+ (mobile development)
- Python 3.11+ (backend + ML engine)

### Full Local Stack

```bash
# Clone the repo
git clone <repo-url>
cd finsmart

# Copy environment files for each service
cp backend/user-service/.env.example backend/user-service/.env
# (repeat for each backend service)

# Start all infrastructure and services
docker-compose up -d

# Services available at:
# API Gateway:        http://localhost:8000
# User Service:       http://localhost:8001
# Portfolio Service:  http://localhost:8002
# Market Data:        http://localhost:8003
# Signal Service:     http://localhost:8004
# Kafka:              localhost:9092
# PostgreSQL:         localhost:5432
# Redis:              localhost:6379
```

### Mobile App (Development)

```bash
cd mobile
npm install

# iOS
npx pod-install ios
npm run ios

# Android
npm run android
```

### ML Engine

```bash
cd ml-engine
pip install -r ../backend/requirements-base.txt

# Build features from historical data
python feature_engineering/build_features.py

# Train the three-model ensemble
python training/train_ensemble.py

# Start the model serving API
python model_serving/serve.py
```

---

## Key Metrics & KPIs

### Business Metrics

| Metric | Target | Frequency |
|---|---|---|
| MRR / ARR | ₹15L MRR by V1.0 · ₹60L MRR by V2.0 | Monthly |
| Trial-to-Paid Conversion | >20% within 30 days of trial start | Weekly |
| Monthly Churn Rate | <4% | Monthly |
| NPS | >50 by V1.0 | Quarterly |
| CAC (blended) | <₹800 across all channels | Monthly |
| LTV / CAC | >4× at 12 months | Quarterly |

### Product Metrics

| Metric | Target | Why It Matters |
|---|---|---|
| **Signal Hit Rate** (north star) | ≥55% of resolved signals hit target before stop-loss | Validates the entire ML pipeline |
| Time to First Signal Hit | <7 days from first active session | First hit is the activation and conversion trigger |
| Signal Act-On Rate | >30% of surfaced signals → watchlist add or portfolio action | Measures whether signals are perceived as credible |
| Signal Outcome Logging Rate | >65% of expired signals receive a user-confirmed outcome | Required for statistically valid hit rate analytics |
| Portfolio Import Completion | >50% of Pro/Elite users import ≥1 portfolio | Validates portfolio intelligence as a purchase driver |
| Cohort Benchmark Engagement | >40% of active users view cohort analytics monthly | Measures whether the feedback loop changes investor behaviour |

### Technical Metrics

| Metric | Target |
|---|---|
| Signal generation latency | <60s from market data ingest to mobile push delivery |
| ML ensemble inference time | <8s per stock for full three-model ensemble |
| Kafka consumer lag (peak) | <30s on `signal.generated` topic during market open |
| Prompt cache hit rate | ≥70% on stock profile block after first enrichment call |
| pgvector query latency | <120ms p95 for top-5 sentiment retrieval per stock |
| API response time | <200ms p95 for all mobile app endpoints |
| Signal pipeline uptime | ≥99.5% during market hours (09:15–15:30 IST) |
| Tax ID decrypt failure rate | 0% — any AES-256 failure blocks import with clear user error |

---

## Risks & Mitigations

### Technical

| Risk | Severity | Mitigation |
|---|---|---|
| Exchange feed latency / outages | High | Multi-provider redundancy; fallback to delayed data with user notification; circuit breaker per exchange |
| ML model degradation post-regime change | High | 30-day rolling hit rate monitoring; auto-alert below 45%; weekly retraining; black swan VIX cap |
| LLM hallucination in signal reasoning | High | Reasoning generated from structured ML output only; factual fields (price, target, SL) from ATR formulas; SEBI disclaimer on all signals |
| Kafka consumer lag at market open | Medium | Per-topic consumer lag monitoring; auto-scaling signal enrichment workers; priority queue for high-confidence signals |
| pgvector query latency at scale | Medium | IVFFlat index with 100 lists; approximate nearest-neighbour acceptable for sentiment use case; query cache for repeat lookups |
| MMKV cache staleness on mobile | Medium | 10-minute TTL; version hash on signal objects; hard invalidation on market open/close events |

### Business & Market

| Risk | Severity | Mitigation |
|---|---|---|
| SEBI regulatory action on AI investment advice | High | Signals framed as "informational" not "advice"; strict signal/execution separation; legal review before launch |
| Low trial-to-paid conversion | High | First signal-hit event as conversion trigger; in-app celebration moment; NPS loop from week 2 |
| Zerodha / Groww building native AI signals | High | Moat in multi-exchange coverage + signal outcome tracking — no single-exchange broker closes this loop |
| LLM inference cost overruns at scale | Medium | Claude Haiku + prompt caching + signal batching; BYOLLM for Elite tier |
| Broker XLSX format changes breaking import | Medium | Per-broker parser versioning; format detection with graceful fallback to manual entry |
| Investor reluctance to trust AI signals | Medium | Explicit hit rate display per signal type; historical accuracy per stock; "verify before you act" UX copy |

---

## Design Philosophy

FinSmart's visual identity — internally named **Signal Bloom** — treats market data as organic rather than mechanical: luminous, breathing, pulsing with the rhythms of human decision. The palette is built on three semantic anchors: **emerald** (growth, affirmation — the signal that says *act*), **crimson** (urgency, the necessary correction), and **deep violet** (the algorithmic intelligence beneath). Vast open fields of warm ivory give way to concentrated nodes of chromatic intensity, guiding the eye through the composition the way a signal travels from source to receiver.

---

*FinSmart · B2C Mobile SaaS · AI Investment Intelligence · Multi-Exchange Signal Engine*

*React Native · FastAPI · Kafka · TimescaleDB · pgvector · LSTM + XGBoost · Claude Haiku*
