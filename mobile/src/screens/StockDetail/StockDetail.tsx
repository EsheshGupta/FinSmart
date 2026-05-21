import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';

const { width: SCREEN_W } = Dimensions.get('window');

// ─── Route params ─────────────────────────────────────────────────────────────
type RouteParams = { symbol: string; exchange: string };

// ─── Types ────────────────────────────────────────────────────────────────────
type SignalType    = 'BUY' | 'SELL' | 'HOLD';
type TabName       = 'Overview' | 'Technicals' | 'News' | 'Events' | 'F&O';
type ChartPeriod   = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '5Y';

interface OHLCPoint { time: string; open: number; high: number; low: number; close: number; vol: number }
interface AISignal  {
  type: SignalType; confidence: number; tradeType: 'INTRADAY' | 'DELIVERY';
  currentPrice: number; targetPrice: number; stopLoss: number; upside: number;
  reasoning: string[]; generatedAt: string;
}
interface TechIndicator { name: string; value: string; signal: 'BUY' | 'SELL' | 'NEUTRAL' }
interface NewsItem  { id: string; headline: string; source: string; sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'; time: string; url: string }
interface EventItem { id: string; title: string; type: string; date: string; impact: 'HIGH' | 'MEDIUM' | 'LOW' }
interface FnOData   { instrument: string; oi: string; oiChange: string; iv: string; pcr: string }
interface SignalHistory { date: string; type: SignalType; entry: number; target: number; sl: number; outcome: 'WIN' | 'LOSS' | 'ACTIVE' | 'CANCELLED'; returnPct: number }

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_SIGNAL: AISignal = {
  type: 'BUY', confidence: 84, tradeType: 'DELIVERY',
  currentPrice: 2847.50, targetPrice: 3100.00, stopLoss: 2720.00, upside: 8.87,
  reasoning: [
    'RSI at 42 — oversold bounce expected',
    'MACD golden cross forming on 4H chart',
    'Q4 earnings beat by 12% — institutional accumulation detected',
    'Geo-political tailwinds: INR strengthening vs USD',
    'Sector rotation into IT — FII inflow ₹2,340 Cr last 5 days',
  ],
  generatedAt: '2026-05-21T06:30:00Z',
};

const MOCK_INDICATORS: TechIndicator[] = [
  { name: 'RSI (14)',        value: '42.3',    signal: 'BUY'     },
  { name: 'MACD',           value: '+0.42',   signal: 'BUY'     },
  { name: 'EMA 20',         value: '2,812',   signal: 'BUY'     },
  { name: 'EMA 50',         value: '2,765',   signal: 'BUY'     },
  { name: 'Bollinger Band', value: 'Middle',  signal: 'NEUTRAL' },
  { name: 'Stochastic',     value: '38/22',   signal: 'BUY'     },
  { name: 'ADX',            value: '24.1',    signal: 'NEUTRAL' },
  { name: 'OBV',            value: '↑ Trend', signal: 'BUY'     },
  { name: 'CCI (20)',       value: '-45.2',   signal: 'BUY'     },
  { name: 'VWAP',           value: '2,831',   signal: 'NEUTRAL' },
  { name: 'ATR (14)',       value: '38.5',    signal: 'NEUTRAL' },
  { name: 'Ichimoku',       value: 'Above',   signal: 'BUY'     },
];

const MOCK_NEWS: NewsItem[] = [
  { id: '1', headline: 'TCS wins $500M multi-year cloud transformation deal with European bank', source: 'Economic Times', sentiment: 'POSITIVE', time: '2h ago', url: '#' },
  { id: '2', headline: 'Attrition rate dips to 12.5% — lowest in 8 quarters', source: 'Business Standard', sentiment: 'POSITIVE', time: '5h ago', url: '#' },
  { id: '3', headline: 'SEBI flags concern over IT sector valuation premium', source: 'Mint', sentiment: 'NEGATIVE', time: '8h ago', url: '#' },
  { id: '4', headline: 'INR appreciation may impact TCS Q1 export margins by 80–100 bps', source: 'NDTV Profit', sentiment: 'NEGATIVE', time: '1d ago', url: '#' },
  { id: '5', headline: 'CEO reaffirms double-digit revenue growth guidance for FY27', source: 'Reuters', sentiment: 'POSITIVE', time: '1d ago', url: '#' },
];

const MOCK_EVENTS: EventItem[] = [
  { id: '1', title: 'Q1 FY27 Earnings',             type: '📊 Earnings',   date: '2026-07-11', impact: 'HIGH'   },
  { id: '2', title: 'Annual General Meeting',        type: '🏢 AGM',        date: '2026-06-27', impact: 'MEDIUM' },
  { id: '3', title: 'Dividend Record Date',          type: '💰 Dividend',   date: '2026-06-05', impact: 'MEDIUM' },
  { id: '4', title: 'RBI Monetary Policy Decision',  type: '🏦 Macro',      date: '2026-06-06', impact: 'HIGH'   },
  { id: '5', title: 'MSCI Rebalancing',              type: '📈 Index',      date: '2026-05-30', impact: 'LOW'    },
];

const MOCK_FNO: FnOData = {
  instrument: 'TCS MAY 2900 CE',
  oi: '12,45,600',
  oiChange: '+8.4%',
  iv: '24.6%',
  pcr: '0.72',
};

const MOCK_SIGNAL_HISTORY: SignalHistory[] = [
  { date: '2026-05-10', type: 'BUY',  entry: 2720, target: 2900, sl: 2620, outcome: 'WIN',    returnPct:  6.6 },
  { date: '2026-04-22', type: 'SELL', entry: 2980, target: 2780, sl: 3080, outcome: 'WIN',    returnPct:  6.7 },
  { date: '2026-04-05', type: 'BUY',  entry: 2850, target: 3050, sl: 2750, outcome: 'LOSS',   returnPct: -3.5 },
  { date: '2026-03-18', type: 'HOLD', entry: 2790, target: 2790, sl: 2650, outcome: 'ACTIVE', returnPct:  0.0 },
  { date: '2026-03-01', type: 'BUY',  entry: 2680, target: 2900, sl: 2580, outcome: 'WIN',    returnPct:  8.2 },
];

// ─── Chart Placeholder ────────────────────────────────────────────────────────
// In production this would be react-native-wagmi-charts or Victory Native
function CandlestickPlaceholder({ period }: { period: ChartPeriod }) {
  const bars = period === '1D' ? 28 : period === '1W' ? 20 : 16;
  return (
    <View style={chartStyles.container}>
      <View style={chartStyles.bars}>
        {Array.from({ length: bars }).map((_, i) => {
          const h = 20 + Math.random() * 100;
          const isGreen = Math.random() > 0.42;
          const top = Math.random() * 30;
          return (
            <View key={i} style={[chartStyles.candleWrapper, { height: 140, justifyContent: 'flex-end', paddingBottom: top }]}>
              <View style={[chartStyles.candle, { height: h, backgroundColor: isGreen ? Colors.bull : Colors.bear }]} />
            </View>
          );
        })}
      </View>
      <Text style={chartStyles.note}>Live chart powered by TradingView — coming in v1.1</Text>
    </View>
  );
}

const chartStyles = StyleSheet.create({
  container: { backgroundColor: Colors.surfaceAlt, borderRadius: 10, padding: Spacing.sm, marginBottom: Spacing.md },
  bars: { flexDirection: 'row', alignItems: 'flex-end', height: 160, paddingHorizontal: Spacing.xs },
  candleWrapper: { flex: 1, alignItems: 'center', paddingHorizontal: 1 },
  candle: { width: '70%', borderRadius: 2 },
  note: { fontSize: Typography.xs, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.sm },
});

// ─── Signal Badge ──────────────────────────────────────────────────────────────
function SignalBadge({ type, size = 'md' }: { type: SignalType; size?: 'sm' | 'md' | 'lg' }) {
  const map: Record<SignalType, { bg: string; text: string; label: string }> = {
    BUY:  { bg: Colors.bullBg,    text: Colors.bull,    label: '▲ BUY'  },
    SELL: { bg: Colors.bearBg,    text: Colors.bear,    label: '▼ SELL' },
    HOLD: { bg: Colors.neutralBg, text: Colors.neutral, label: '● HOLD' },
  };
  const c = map[type];
  const fs = size === 'lg' ? 16 : size === 'sm' ? 10 : 12;
  const px = size === 'lg' ? 14 : size === 'sm' ? 6  : 10;
  const py = size === 'lg' ? 6  : size === 'sm' ? 3  : 4;
  return (
    <View style={{ backgroundColor: c.bg, borderRadius: 6, paddingHorizontal: px, paddingVertical: py }}>
      <Text style={{ color: c.text, fontSize: fs, fontWeight: '700' }}>{c.label}</Text>
    </View>
  );
}

// ─── Indicator Signal Dot ─────────────────────────────────────────────────────
function IndicatorDot({ signal }: { signal: 'BUY' | 'SELL' | 'NEUTRAL' }) {
  const color = signal === 'BUY' ? Colors.bull : signal === 'SELL' ? Colors.bear : Colors.neutral;
  return <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />;
}

// ─── AI Signal Panel ──────────────────────────────────────────────────────────
function AISignalPanel({ signal, onShowHistory }: { signal: AISignal; onShowHistory: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const confidenceColor =
    signal.confidence >= 80 ? Colors.bull :
    signal.confidence >= 60 ? Colors.warning : Colors.bear;

  return (
    <View style={panelStyles.card}>
      {/* Top row */}
      <View style={panelStyles.topRow}>
        <View>
          <Text style={panelStyles.aiLabel}>🤖 AI Signal</Text>
          <Text style={panelStyles.generatedAt}>
            {new Date(signal.generatedAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        <SignalBadge type={signal.type} size="lg" />
      </View>

      {/* Price targets */}
      <View style={panelStyles.priceRow}>
        <View style={panelStyles.priceCell}>
          <Text style={panelStyles.priceLabel}>Entry</Text>
          <Text style={panelStyles.priceValue}>₹{signal.currentPrice.toLocaleString('en-IN')}</Text>
        </View>
        <View style={panelStyles.priceDivider} />
        <View style={panelStyles.priceCell}>
          <Text style={panelStyles.priceLabel}>Target</Text>
          <Text style={[panelStyles.priceValue, { color: Colors.bull }]}>₹{signal.targetPrice.toLocaleString('en-IN')}</Text>
        </View>
        <View style={panelStyles.priceDivider} />
        <View style={panelStyles.priceCell}>
          <Text style={panelStyles.priceLabel}>Stop Loss</Text>
          <Text style={[panelStyles.priceValue, { color: Colors.bear }]}>₹{signal.stopLoss.toLocaleString('en-IN')}</Text>
        </View>
        <View style={panelStyles.priceDivider} />
        <View style={panelStyles.priceCell}>
          <Text style={panelStyles.priceLabel}>Upside</Text>
          <Text style={[panelStyles.priceValue, { color: Colors.bull }]}>+{signal.upside.toFixed(1)}%</Text>
        </View>
      </View>

      {/* Confidence bar */}
      <View style={panelStyles.confRow}>
        <Text style={panelStyles.confLabel}>Confidence</Text>
        <View style={panelStyles.confTrack}>
          <View style={[panelStyles.confFill, { width: `${signal.confidence}%` as any, backgroundColor: confidenceColor }]} />
        </View>
        <Text style={[panelStyles.confPct, { color: confidenceColor }]}>{signal.confidence}%</Text>
      </View>

      {/* Trade type pill */}
      <View style={panelStyles.metaRow}>
        <View style={panelStyles.tradePill}>
          <Text style={panelStyles.tradePillText}>{signal.tradeType === 'INTRADAY' ? '⚡ INTRADAY' : '📦 DELIVERY'}</Text>
        </View>
        <TouchableOpacity onPress={onShowHistory} style={panelStyles.historyBtn}>
          <Text style={panelStyles.historyBtnText}>Signal History →</Text>
        </TouchableOpacity>
      </View>

      {/* Reasoning toggle */}
      <TouchableOpacity style={panelStyles.reasoningToggle} onPress={() => setExpanded(e => !e)} activeOpacity={0.8}>
        <Text style={panelStyles.reasoningToggleText}>
          {expanded ? '▲ Hide Reasoning' : '▼ Why this signal?'}
        </Text>
      </TouchableOpacity>
      {expanded && (
        <View style={panelStyles.reasoningList}>
          {signal.reasoning.map((r, i) => (
            <View key={i} style={panelStyles.reasoningRow}>
              <Text style={panelStyles.reasoningBullet}>•</Text>
              <Text style={panelStyles.reasoningText}>{r}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const panelStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.primary + '44',
    padding: Spacing.base,
    marginBottom: Spacing.md,
    ...{ shadowColor: Colors.primary, shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
  },
  topRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.md },
  aiLabel:   { fontSize: Typography.base, fontWeight: '700', color: Colors.textPrimary },
  generatedAt: { fontSize: Typography.xs, color: Colors.textMuted, marginTop: 2 },

  priceRow:   { flexDirection: 'row', backgroundColor: Colors.surfaceAlt, borderRadius: 10, padding: Spacing.sm, marginBottom: Spacing.md },
  priceCell:  { flex: 1, alignItems: 'center' },
  priceLabel: { fontSize: Typography.xs, color: Colors.textSecondary, marginBottom: 4 },
  priceValue: { fontSize: Typography.sm, fontWeight: '700', color: Colors.textPrimary },
  priceDivider: { width: 1, backgroundColor: Colors.border, marginVertical: 4 },

  confRow:    { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  confLabel:  { fontSize: Typography.xs, color: Colors.textSecondary, width: 80 },
  confTrack:  { flex: 1, height: 6, backgroundColor: Colors.surfaceAlt, borderRadius: 3, overflow: 'hidden', marginHorizontal: Spacing.sm },
  confFill:   { height: '100%', borderRadius: 3 },
  confPct:    { fontSize: Typography.xs, fontWeight: '700', width: 32, textAlign: 'right' },

  metaRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm },
  tradePill:  { backgroundColor: Colors.primary + '22', borderRadius: 6, paddingHorizontal: Spacing.sm, paddingVertical: 4 },
  tradePillText: { fontSize: Typography.xs, color: Colors.primary, fontWeight: '700' },
  historyBtn:  {},
  historyBtnText: { fontSize: Typography.xs, color: Colors.primary, fontWeight: '600' },

  reasoningToggle: { paddingVertical: Spacing.sm, alignItems: 'center' },
  reasoningToggleText: { fontSize: Typography.xs, color: Colors.textSecondary },
  reasoningList: { paddingTop: Spacing.xs },
  reasoningRow:  { flexDirection: 'row', marginBottom: Spacing.xs },
  reasoningBullet: { color: Colors.primary, marginRight: Spacing.xs, fontSize: Typography.sm, marginTop: 1 },
  reasoningText: { flex: 1, fontSize: Typography.sm, color: Colors.textSecondary, lineHeight: 20 },
});

// ─── Signal History Modal ──────────────────────────────────────────────────────
function SignalHistoryModal({ visible, onClose, history }: { visible: boolean; onClose: () => void; history: SignalHistory[] }) {
  const wins   = history.filter(h => h.outcome === 'WIN').length;
  const losses = history.filter(h => h.outcome === 'LOSS').length;
  const winRate = history.length > 0 ? Math.round((wins / (wins + losses)) * 100) : 0;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.sheet}>
          <View style={modalStyles.handle} />
          <View style={modalStyles.modalHeader}>
            <Text style={modalStyles.modalTitle}>Signal History</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={modalStyles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Win rate */}
          <View style={modalStyles.statsRow}>
            <View style={modalStyles.statCell}>
              <Text style={[modalStyles.statVal, { color: Colors.bull }]}>{wins}</Text>
              <Text style={modalStyles.statLbl}>Wins</Text>
            </View>
            <View style={modalStyles.statCell}>
              <Text style={[modalStyles.statVal, { color: Colors.bear }]}>{losses}</Text>
              <Text style={modalStyles.statLbl}>Losses</Text>
            </View>
            <View style={modalStyles.statCell}>
              <Text style={[modalStyles.statVal, { color: Colors.primary }]}>{winRate}%</Text>
              <Text style={modalStyles.statLbl}>Win Rate</Text>
            </View>
          </View>

          <FlatList
            data={history}
            keyExtractor={item => item.date}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: Colors.border }} />}
            renderItem={({ item }) => {
              const outcomeColor =
                item.outcome === 'WIN'    ? Colors.bull :
                item.outcome === 'LOSS'   ? Colors.bear :
                item.outcome === 'ACTIVE' ? Colors.primary : Colors.textMuted;
              return (
                <View style={modalStyles.historyRow}>
                  <View>
                    <Text style={modalStyles.histDate}>{new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
                    <Text style={modalStyles.histPrice}>Entry ₹{item.entry.toLocaleString('en-IN')} → T ₹{item.target} / SL ₹{item.sl}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <SignalBadge type={item.type} size="sm" />
                    <Text style={[modalStyles.histReturn, { color: outcomeColor, marginTop: 4 }]}>
                      {item.outcome === 'ACTIVE' ? '🔄 Active' : item.outcome === 'CANCELLED' ? 'Cancelled' : `${item.returnPct > 0 ? '+' : ''}${item.returnPct}%`}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  overlay:  { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  sheet:    { backgroundColor: Colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: Spacing.base, maxHeight: '80%' },
  handle:   { width: 40, height: 4, backgroundColor: Colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.md },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.base },
  modalTitle: { fontSize: Typography.lg, fontWeight: '700', color: Colors.textPrimary },
  closeBtn:   { fontSize: 20, color: Colors.textSecondary },
  statsRow:   { flexDirection: 'row', backgroundColor: Colors.surfaceAlt, borderRadius: 10, padding: Spacing.md, marginBottom: Spacing.base },
  statCell:   { flex: 1, alignItems: 'center' },
  statVal:    { fontSize: Typography.xl, fontWeight: '700' },
  statLbl:    { fontSize: Typography.xs, color: Colors.textSecondary, marginTop: 2 },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.md },
  histDate:   { fontSize: Typography.sm, fontWeight: '600', color: Colors.textPrimary, marginBottom: 2 },
  histPrice:  { fontSize: Typography.xs, color: Colors.textSecondary },
  histReturn: { fontSize: Typography.sm, fontWeight: '700' },
});

// ─── Tab Content ──────────────────────────────────────────────────────────────
function OverviewTab() {
  return (
    <View style={tabStyles.container}>
      <Text style={tabStyles.sectionTitle}>Company Overview</Text>
      <View style={tabStyles.table}>
        {[
          ['Market Cap', '₹10.42L Cr'],
          ['P/E Ratio',  '24.8x'],
          ['EPS (TTM)',  '₹114.7'],
          ['52W High',  '₹3,994'],
          ['52W Low',   '₹2,389'],
          ['Div Yield',  '1.9%'],
          ['Beta',       '0.58'],
          ['Face Value', '₹1'],
          ['Book Value', '₹337'],
          ['Promoter %', '72.3%'],
        ].map(([k, v]) => (
          <View key={k} style={tabStyles.tableRow}>
            <Text style={tabStyles.tableKey}>{k}</Text>
            <Text style={tabStyles.tableVal}>{v}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function TechnicalsTab() {
  const buys    = MOCK_INDICATORS.filter(i => i.signal === 'BUY').length;
  const sells   = MOCK_INDICATORS.filter(i => i.signal === 'SELL').length;
  const neutral = MOCK_INDICATORS.filter(i => i.signal === 'NEUTRAL').length;
  return (
    <View style={tabStyles.container}>
      {/* Summary pills */}
      <View style={tabStyles.techSummary}>
        <View style={[tabStyles.techPill, { backgroundColor: Colors.bullBg }]}>
          <Text style={[tabStyles.techPillText, { color: Colors.bull }]}>▲ {buys} BUY</Text>
        </View>
        <View style={[tabStyles.techPill, { backgroundColor: Colors.neutralBg }]}>
          <Text style={[tabStyles.techPillText, { color: Colors.neutral }]}>● {neutral} NEUTRAL</Text>
        </View>
        <View style={[tabStyles.techPill, { backgroundColor: Colors.bearBg }]}>
          <Text style={[tabStyles.techPillText, { color: Colors.bear }]}>▼ {sells} SELL</Text>
        </View>
      </View>
      {MOCK_INDICATORS.map(ind => (
        <View key={ind.name} style={tabStyles.indicatorRow}>
          <IndicatorDot signal={ind.signal} />
          <Text style={tabStyles.indicatorName}>{ind.name}</Text>
          <Text style={tabStyles.indicatorValue}>{ind.value}</Text>
          <Text style={[tabStyles.indicatorSignal,
            { color: ind.signal === 'BUY' ? Colors.bull : ind.signal === 'SELL' ? Colors.bear : Colors.neutral }
          ]}>{ind.signal}</Text>
        </View>
      ))}
    </View>
  );
}

function NewsTab() {
  return (
    <View style={tabStyles.container}>
      {MOCK_NEWS.map(item => {
        const sentColor = item.sentiment === 'POSITIVE' ? Colors.bull : item.sentiment === 'NEGATIVE' ? Colors.bear : Colors.neutral;
        const sentIcon  = item.sentiment === 'POSITIVE' ? '▲' : item.sentiment === 'NEGATIVE' ? '▼' : '●';
        return (
          <TouchableOpacity key={item.id} style={tabStyles.newsCard} activeOpacity={0.8}>
            <View style={tabStyles.newsTop}>
              <View style={[tabStyles.sentDot, { backgroundColor: sentColor + '22', borderColor: sentColor + '55' }]}>
                <Text style={{ color: sentColor, fontSize: 10, fontWeight: '700' }}>{sentIcon}</Text>
              </View>
              <Text style={tabStyles.newsSource}>{item.source}</Text>
              <Text style={tabStyles.newsTime}>{item.time}</Text>
            </View>
            <Text style={tabStyles.newsHeadline}>{item.headline}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function EventsTab() {
  return (
    <View style={tabStyles.container}>
      {MOCK_EVENTS.map(ev => {
        const impactColor = ev.impact === 'HIGH' ? Colors.bear : ev.impact === 'MEDIUM' ? Colors.warning : Colors.textMuted;
        return (
          <View key={ev.id} style={tabStyles.eventCard}>
            <View style={tabStyles.eventLeft}>
              <Text style={tabStyles.eventType}>{ev.type}</Text>
              <Text style={tabStyles.eventTitle}>{ev.title}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={tabStyles.eventDate}>
                {new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </Text>
              <View style={[tabStyles.impactPill, { backgroundColor: impactColor + '22' }]}>
                <Text style={[tabStyles.impactText, { color: impactColor }]}>{ev.impact}</Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

function FnOTab() {
  return (
    <View style={tabStyles.container}>
      {/* PCR Gauge */}
      <View style={tabStyles.pcrCard}>
        <Text style={tabStyles.sectionTitle}>Put-Call Ratio</Text>
        <Text style={tabStyles.pcrValue}>{MOCK_FNO.pcr}</Text>
        <Text style={tabStyles.pcrLabel}>
          {parseFloat(MOCK_FNO.pcr) < 0.7 ? '🔴 Bearish Sentiment' :
           parseFloat(MOCK_FNO.pcr) > 1.3 ? '🟢 Bullish Sentiment' : '🟡 Neutral Sentiment'}
        </Text>
      </View>

      <View style={tabStyles.table}>
        {[
          ['Instrument',  MOCK_FNO.instrument],
          ['Open Interest', MOCK_FNO.oi],
          ['OI Change',   MOCK_FNO.oiChange],
          ['Implied Vol.', MOCK_FNO.iv],
          ['PCR',          MOCK_FNO.pcr],
        ].map(([k, v]) => (
          <View key={k} style={tabStyles.tableRow}>
            <Text style={tabStyles.tableKey}>{k}</Text>
            <Text style={[tabStyles.tableVal,
              k === 'OI Change' ? { color: v.startsWith('+') ? Colors.bull : Colors.bear } : {}
            ]}>{v}</Text>
          </View>
        ))}
      </View>

      <Text style={tabStyles.fnODisclaimer}>
        F&O data sourced from NSE. Derivatives trading involves significant risk. Not investment advice.
      </Text>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  container:  { paddingBottom: Spacing.xxxl },
  sectionTitle: { fontSize: Typography.base, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.md },

  table: { backgroundColor: Colors.surface, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md, overflow: 'hidden' },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Spacing.base, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tableKey: { fontSize: Typography.sm, color: Colors.textSecondary },
  tableVal: { fontSize: Typography.sm, fontWeight: '600', color: Colors.textPrimary },

  techSummary: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  techPill:    { flex: 1, alignItems: 'center', paddingVertical: Spacing.sm, borderRadius: 8 },
  techPillText: { fontSize: Typography.sm, fontWeight: '700' },
  indicatorRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  indicatorName:   { flex: 1, fontSize: Typography.sm, color: Colors.textSecondary, marginLeft: Spacing.sm },
  indicatorValue:  { fontSize: Typography.sm, color: Colors.textPrimary, marginRight: Spacing.sm, width: 70, textAlign: 'right' },
  indicatorSignal: { fontSize: Typography.xs, fontWeight: '700', width: 52, textAlign: 'right' },

  newsCard: { backgroundColor: Colors.surface, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, padding: Spacing.md, marginBottom: Spacing.sm },
  newsTop:  { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs },
  sentDot:  { width: 20, height: 20, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.xs },
  newsSource: { fontSize: Typography.xs, color: Colors.textMuted, flex: 1 },
  newsTime:   { fontSize: Typography.xs, color: Colors.textMuted },
  newsHeadline: { fontSize: Typography.sm, color: Colors.textPrimary, lineHeight: 20 },

  eventCard:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, padding: Spacing.md, marginBottom: Spacing.sm },
  eventLeft:  { flex: 1 },
  eventType:  { fontSize: Typography.xs, color: Colors.textMuted, marginBottom: 2 },
  eventTitle: { fontSize: Typography.sm, fontWeight: '600', color: Colors.textPrimary },
  eventDate:  { fontSize: Typography.sm, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  impactPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  impactText: { fontSize: 10, fontWeight: '700' },

  pcrCard:  { backgroundColor: Colors.surface, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, padding: Spacing.base, marginBottom: Spacing.md, alignItems: 'center' },
  pcrValue: { fontSize: 40, fontWeight: '900', color: Colors.textPrimary, marginVertical: Spacing.xs },
  pcrLabel: { fontSize: Typography.sm, color: Colors.textSecondary },
  fnODisclaimer: { fontSize: Typography.xs, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.md },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
const TABS: TabName[] = ['Overview', 'Technicals', 'News', 'Events', 'F&O'];
const PERIODS: ChartPeriod[] = ['1D', '1W', '1M', '3M', '6M', '1Y', '5Y'];

export default function StockDetailScreen() {
  const navigation = useNavigation<any>();
  const route      = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const symbol     = route.params?.symbol ?? 'TCS';
  const exchange   = route.params?.exchange ?? 'NSE';

  const [tab, setTab]           = useState<TabName>('Overview');
  const [period, setPeriod]     = useState<ChartPeriod>('1M');
  const [histModal, setHistModal] = useState(false);

  // Mock live price
  const change    = +181.30;
  const changePct = +6.81;
  const livePrice = 2847.50;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* ── Nav Bar ── */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <View style={styles.navCenter}>
          <Text style={styles.navSymbol}>{symbol}</Text>
          <Text style={styles.navExchange}>{exchange}</Text>
        </View>
        <TouchableOpacity style={styles.watchBtn}>
          <Text style={styles.watchIcon}>☆</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ── Price Header ── */}
        <View style={styles.priceHeader}>
          <Text style={styles.companyName}>Tata Consultancy Services Ltd.</Text>
          <View style={styles.priceRow}>
            <Text style={styles.livePrice}>₹{livePrice.toLocaleString('en-IN')}</Text>
            <View style={[styles.changePill, { backgroundColor: change >= 0 ? Colors.bullBg : Colors.bearBg }]}>
              <Text style={[styles.changeText, { color: change >= 0 ? Colors.bull : Colors.bear }]}>
                {change >= 0 ? '+' : ''}{change.toFixed(2)} ({changePct >= 0 ? '+' : ''}{changePct.toFixed(2)}%)
              </Text>
            </View>
          </View>
          <Text style={styles.priceSubtitle}>NSE • Live • {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</Text>
        </View>

        <View style={styles.body}>
          {/* ── Chart ── */}
          <View style={styles.periodRow}>
            {PERIODS.map(p => (
              <TouchableOpacity
                key={p}
                style={[styles.periodPill, period === p && styles.periodPillActive]}
                onPress={() => setPeriod(p)}
              >
                <Text style={[styles.periodText, period === p && styles.periodTextActive]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <CandlestickPlaceholder period={period} />

          {/* ── AI Signal Panel ── */}
          <AISignalPanel signal={MOCK_SIGNAL} onShowHistory={() => setHistModal(true)} />

          {/* ── Tab Bar ── */}
          <View style={styles.tabBar}>
            {TABS.map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.tabItem, tab === t && styles.tabItemActive]}
                onPress={() => setTab(t)}
              >
                <Text style={[styles.tabLabel, tab === t && styles.tabLabelActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Tab Content ── */}
          {tab === 'Overview'    && <OverviewTab />}
          {tab === 'Technicals'  && <TechnicalsTab />}
          {tab === 'News'        && <NewsTab />}
          {tab === 'Events'      && <EventsTab />}
          {tab === 'F&O'         && <FnOTab />}
        </View>
      </ScrollView>

      {/* ── Signal History Modal ── */}
      <SignalHistoryModal
        visible={histModal}
        onClose={() => setHistModal(false)}
        history={MOCK_SIGNAL_HISTORY}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },

  navBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn:    { padding: Spacing.xs, marginRight: Spacing.sm },
  backIcon:   { fontSize: 28, color: Colors.textPrimary, lineHeight: 32 },
  navCenter:  { flex: 1, alignItems: 'center' },
  navSymbol:  { fontSize: Typography.lg, fontWeight: '700', color: Colors.textPrimary },
  navExchange:{ fontSize: Typography.xs, color: Colors.textSecondary },
  watchBtn:   { padding: Spacing.xs },
  watchIcon:  { fontSize: 22, color: Colors.textSecondary },

  priceHeader: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  companyName: { fontSize: Typography.sm, color: Colors.textSecondary, marginBottom: Spacing.xs },
  priceRow:    { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: 4 },
  livePrice:   { fontSize: 32, fontWeight: '800', color: Colors.textPrimary },
  changePill:  { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: 8 },
  changeText:  { fontSize: Typography.sm, fontWeight: '700' },
  priceSubtitle: { fontSize: Typography.xs, color: Colors.textMuted },

  body: { paddingHorizontal: Spacing.base, paddingTop: Spacing.base },

  periodRow: { flexDirection: 'row', marginBottom: Spacing.sm },
  periodPill:       { flex: 1, alignItems: 'center', paddingVertical: 6, borderRadius: 8 },
  periodPillActive: { backgroundColor: Colors.primary + '22' },
  periodText:       { fontSize: Typography.xs, color: Colors.textSecondary, fontWeight: '600' },
  periodTextActive: { color: Colors.primary },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 10,
    padding: 3,
    marginBottom: Spacing.md,
  },
  tabItem:       { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 8 },
  tabItemActive: { backgroundColor: Colors.surface },
  tabLabel:      { fontSize: Typography.xs, color: Colors.textSecondary, fontWeight: '600' },
  tabLabelActive:{ color: Colors.textPrimary },
});
