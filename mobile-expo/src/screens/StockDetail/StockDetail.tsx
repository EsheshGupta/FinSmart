import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList,
  Modal, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors, Typography, Spacing } from '../../constants/theme';

type SignalType  = 'BUY' | 'SELL' | 'HOLD';
type TabName     = 'Overview' | 'Technicals' | 'News' | 'Events' | 'F&O';
type ChartPeriod = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '5Y';

const MOCK_SIGNAL = {
  type: 'BUY' as SignalType, confidence: 84, tradeType: 'DELIVERY',
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

const MOCK_INDICATORS = [
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

const MOCK_NEWS = [
  { id: '1', headline: 'TCS wins $500M multi-year cloud transformation deal with European bank', source: 'Economic Times', sentiment: 'POSITIVE', time: '2h ago' },
  { id: '2', headline: 'Attrition rate dips to 12.5% — lowest in 8 quarters', source: 'Business Standard', sentiment: 'POSITIVE', time: '5h ago' },
  { id: '3', headline: 'SEBI flags concern over IT sector valuation premium', source: 'Mint', sentiment: 'NEGATIVE', time: '8h ago' },
  { id: '4', headline: 'INR appreciation may impact TCS Q1 export margins', source: 'NDTV Profit', sentiment: 'NEGATIVE', time: '1d ago' },
  { id: '5', headline: 'CEO reaffirms double-digit revenue growth guidance for FY27', source: 'Reuters', sentiment: 'POSITIVE', time: '1d ago' },
];

const MOCK_EVENTS = [
  { id: '1', title: 'Q1 FY27 Earnings',            type: '📊 Earnings', date: '2026-07-11', impact: 'HIGH'   },
  { id: '2', title: 'Annual General Meeting',       type: '🏢 AGM',      date: '2026-06-27', impact: 'MEDIUM' },
  { id: '3', title: 'Dividend Record Date',         type: '💰 Dividend', date: '2026-06-05', impact: 'MEDIUM' },
  { id: '4', title: 'RBI Monetary Policy Decision', type: '🏦 Macro',    date: '2026-06-06', impact: 'HIGH'   },
];

const MOCK_HISTORY = [
  { date: '2026-05-10', type: 'BUY'  as SignalType, entry: 2720, target: 2900, sl: 2620, outcome: 'WIN',    returnPct:  6.6 },
  { date: '2026-04-22', type: 'SELL' as SignalType, entry: 2980, target: 2780, sl: 3080, outcome: 'WIN',    returnPct:  6.7 },
  { date: '2026-04-05', type: 'BUY'  as SignalType, entry: 2850, target: 3050, sl: 2750, outcome: 'LOSS',   returnPct: -3.5 },
  { date: '2026-03-01', type: 'BUY'  as SignalType, entry: 2680, target: 2900, sl: 2580, outcome: 'WIN',    returnPct:  8.2 },
];

function SignalBadge({ type, size = 'md' }: { type: SignalType; size?: 'sm'|'md'|'lg' }) {
  const map = {
    BUY:  { bg: Colors.bullBg,    text: Colors.bull,    label: '▲ BUY'  },
    SELL: { bg: Colors.bearBg,    text: Colors.bear,    label: '▼ SELL' },
    HOLD: { bg: Colors.neutralBg, text: Colors.neutral, label: '● HOLD' },
  };
  const c  = map[type];
  const fs = size === 'lg' ? 16 : size === 'sm' ? 10 : 12;
  const px = size === 'lg' ? 14 : size === 'sm' ? 6  : 10;
  const py = size === 'lg' ? 6  : size === 'sm' ? 3  : 4;
  return (
    <View style={{ backgroundColor: c.bg, borderRadius: 6, paddingHorizontal: px, paddingVertical: py }}>
      <Text style={{ color: c.text, fontSize: fs, fontWeight: '700' }}>{c.label}</Text>
    </View>
  );
}

function AIPanel({ signal, onHistory }: { signal: typeof MOCK_SIGNAL; onHistory: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const cc = signal.confidence >= 80 ? Colors.bull : signal.confidence >= 60 ? Colors.warning : Colors.bear;
  return (
    <View style={ps.card}>
      <View style={ps.topRow}>
        <View>
          <Text style={ps.aiLabel}>🤖 AI Signal</Text>
          <Text style={ps.gen}>{new Date(signal.generatedAt).toLocaleString('en-IN', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}</Text>
        </View>
        <SignalBadge type={signal.type} size="lg" />
      </View>
      <View style={ps.priceRow}>
        {[['Entry', `₹${signal.currentPrice.toLocaleString('en-IN')}`, Colors.textPrimary],
          ['Target', `₹${signal.targetPrice.toLocaleString('en-IN')}`, Colors.bull],
          ['Stop Loss', `₹${signal.stopLoss.toLocaleString('en-IN')}`, Colors.bear],
          ['Upside', `+${signal.upside.toFixed(1)}%`, Colors.bull]].map(([l, v, col], i) => (
          <View key={l as string} style={[ps.priceCell, i < 3 && { borderRightWidth: 1, borderRightColor: Colors.border }]}>
            <Text style={ps.priceLabel}>{l}</Text>
            <Text style={[ps.priceVal, { color: col as string }]}>{v}</Text>
          </View>
        ))}
      </View>
      <View style={ps.confRow}>
        <Text style={ps.confLabel}>Confidence</Text>
        <View style={ps.confTrack}><View style={[ps.confFill, { width: `${signal.confidence}%` as any, backgroundColor: cc }]} /></View>
        <Text style={[ps.confPct, { color: cc }]}>{signal.confidence}%</Text>
      </View>
      <View style={ps.metaRow}>
        <View style={ps.tradePill}><Text style={ps.tradePillText}>{signal.tradeType === 'INTRADAY' ? '⚡ INTRADAY' : '📦 DELIVERY'}</Text></View>
        <TouchableOpacity onPress={onHistory}><Text style={ps.histBtn}>Signal History →</Text></TouchableOpacity>
      </View>
      <TouchableOpacity style={ps.toggle} onPress={() => setExpanded(e => !e)}>
        <Text style={ps.toggleText}>{expanded ? '▲ Hide Reasoning' : '▼ Why this signal?'}</Text>
      </TouchableOpacity>
      {expanded && signal.reasoning.map((r, i) => (
        <View key={i} style={ps.reasonRow}>
          <Text style={{ color: Colors.primary, marginRight: 6 }}>•</Text>
          <Text style={ps.reasonText}>{r}</Text>
        </View>
      ))}
    </View>
  );
}

const ps = StyleSheet.create({
  card:       { backgroundColor: Colors.surface, borderRadius: 14, borderWidth: 1, borderColor: Colors.primary+'44', padding: Spacing.base, marginBottom: Spacing.md },
  topRow:     { flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom: Spacing.md },
  aiLabel:    { fontSize: Typography.base, fontWeight:'700', color: Colors.textPrimary },
  gen:        { fontSize: Typography.xs, color: Colors.textMuted, marginTop: 2 },
  priceRow:   { flexDirection:'row', backgroundColor: Colors.surfaceAlt, borderRadius: 10, padding: Spacing.sm, marginBottom: Spacing.md },
  priceCell:  { flex:1, alignItems:'center' },
  priceLabel: { fontSize: Typography.xs, color: Colors.textSecondary, marginBottom: 4 },
  priceVal:   { fontSize: Typography.sm, fontWeight:'700', color: Colors.textPrimary },
  confRow:    { flexDirection:'row', alignItems:'center', marginBottom: Spacing.md },
  confLabel:  { fontSize: Typography.xs, color: Colors.textSecondary, width: 80 },
  confTrack:  { flex:1, height:6, backgroundColor: Colors.surfaceAlt, borderRadius:3, overflow:'hidden', marginHorizontal: Spacing.sm },
  confFill:   { height:'100%', borderRadius:3 },
  confPct:    { fontSize: Typography.xs, fontWeight:'700', width:32, textAlign:'right' },
  metaRow:    { flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom: Spacing.sm },
  tradePill:  { backgroundColor: Colors.primary+'22', borderRadius:6, paddingHorizontal: Spacing.sm, paddingVertical:4 },
  tradePillText: { fontSize: Typography.xs, color: Colors.primary, fontWeight:'700' },
  histBtn:    { fontSize: Typography.xs, color: Colors.primary, fontWeight:'600' },
  toggle:     { paddingVertical: Spacing.sm, alignItems:'center' },
  toggleText: { fontSize: Typography.xs, color: Colors.textSecondary },
  reasonRow:  { flexDirection:'row', marginBottom: Spacing.xs },
  reasonText: { flex:1, fontSize: Typography.sm, color: Colors.textSecondary, lineHeight:20 },
});

function HistoryModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const wins = MOCK_HISTORY.filter(h => h.outcome === 'WIN').length;
  const losses = MOCK_HISTORY.filter(h => h.outcome === 'LOSS').length;
  const wr = Math.round(wins / (wins + losses) * 100);
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={ms.overlay}>
        <View style={ms.sheet}>
          <View style={ms.handle} />
          <View style={ms.header}>
            <Text style={ms.title}>Signal History</Text>
            <TouchableOpacity onPress={onClose}><Text style={ms.close}>✕</Text></TouchableOpacity>
          </View>
          <View style={ms.stats}>
            {[[wins.toString(), 'Wins', Colors.bull],[losses.toString(), 'Losses', Colors.bear],[`${wr}%`, 'Win Rate', Colors.primary]].map(([v,l,c]) => (
              <View key={l as string} style={ms.statCell}>
                <Text style={[ms.statVal, { color: c as string }]}>{v}</Text>
                <Text style={ms.statLbl}>{l}</Text>
              </View>
            ))}
          </View>
          <FlatList data={MOCK_HISTORY} keyExtractor={i => i.date}
            ItemSeparatorComponent={() => <View style={{ height:1, backgroundColor: Colors.border }} />}
            renderItem={({ item }) => {
              const c = item.outcome === 'WIN' ? Colors.bull : Colors.bear;
              return (
                <View style={ms.row}>
                  <View>
                    <Text style={ms.rowDate}>{new Date(item.date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</Text>
                    <Text style={ms.rowPrice}>Entry ₹{item.entry} → T ₹{item.target} / SL ₹{item.sl}</Text>
                  </View>
                  <View style={{ alignItems:'flex-end' }}>
                    <SignalBadge type={item.type} size="sm" />
                    <Text style={[ms.rowReturn, { color: c, marginTop:4 }]}>{item.returnPct > 0 ? '+' : ''}{item.returnPct}%</Text>
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

const ms = StyleSheet.create({
  overlay: { flex:1, backgroundColor:'rgba(0,0,0,0.7)', justifyContent:'flex-end' },
  sheet:   { backgroundColor: Colors.surface, borderTopLeftRadius:20, borderTopRightRadius:20, padding: Spacing.base, maxHeight:'80%' },
  handle:  { width:40, height:4, backgroundColor: Colors.border, borderRadius:2, alignSelf:'center', marginBottom: Spacing.md },
  header:  { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom: Spacing.base },
  title:   { fontSize: Typography.lg, fontWeight:'700', color: Colors.textPrimary },
  close:   { fontSize:20, color: Colors.textSecondary },
  stats:   { flexDirection:'row', backgroundColor: Colors.surfaceAlt, borderRadius:10, padding: Spacing.md, marginBottom: Spacing.base },
  statCell:{ flex:1, alignItems:'center' },
  statVal: { fontSize: Typography.xl, fontWeight:'700' },
  statLbl: { fontSize: Typography.xs, color: Colors.textSecondary, marginTop:2 },
  row:     { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingVertical: Spacing.md },
  rowDate: { fontSize: Typography.sm, fontWeight:'600', color: Colors.textPrimary, marginBottom:2 },
  rowPrice:{ fontSize: Typography.xs, color: Colors.textSecondary },
  rowReturn:{ fontSize: Typography.sm, fontWeight:'700' },
});

const TABS: TabName[]     = ['Overview','Technicals','News','Events','F&O'];
const PERIODS: ChartPeriod[] = ['1D','1W','1M','3M','6M','1Y','5Y'];

export default function StockDetailScreen() {
  const navigation = useNavigation<any>();
  const route      = useRoute<any>();
  const symbol   = route.params?.symbol   ?? 'TCS';
  const exchange = route.params?.exchange ?? 'NSE';

  const [tab, setTab]         = useState<TabName>('Overview');
  const [period, setPeriod]   = useState<ChartPeriod>('1M');
  const [showHist, setShowHist] = useState(false);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      <View style={s.navBar}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Text style={s.backIcon}>‹</Text>
        </TouchableOpacity>
        <View style={s.navCenter}>
          <Text style={s.navSym}>{symbol}</Text>
          <Text style={s.navEx}>{exchange}</Text>
        </View>
        <TouchableOpacity style={s.watchBtn}><Text style={s.watchIcon}>☆</Text></TouchableOpacity>
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.priceHeader}>
          <Text style={s.companyName}>Tata Consultancy Services Ltd.</Text>
          <View style={s.priceRow}>
            <Text style={s.livePrice}>₹2,847.50</Text>
            <View style={s.changePill}>
              <Text style={s.changeText}>+₹181.30 (+6.81%)</Text>
            </View>
          </View>
          <Text style={s.priceSub}>NSE · Live · {new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}</Text>
        </View>

        <View style={s.body}>
          {/* Period picker */}
          <View style={s.periodRow}>
            {PERIODS.map(p => (
              <TouchableOpacity key={p} style={[s.periodPill, period === p && s.periodActive]} onPress={() => setPeriod(p)}>
                <Text style={[s.periodText, period === p && s.periodTextActive]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Chart placeholder */}
          <View style={s.chartBox}>
            <View style={s.chartBars}>
              {Array.from({ length: 20 }).map((_, i) => {
                const h = 20 + (i * 7 + 30) % 100;
                const green = i % 3 !== 0;
                return (
                  <View key={i} style={[s.bar, { height: h, backgroundColor: green ? Colors.bull : Colors.bear }]} />
                );
              })}
            </View>
            <Text style={s.chartNote}>Live chart · TradingView integration — coming in v1.1</Text>
          </View>

          <AIPanel signal={MOCK_SIGNAL} onHistory={() => setShowHist(true)} />

          {/* Tab bar */}
          <View style={s.tabBar}>
            {TABS.map(t => (
              <TouchableOpacity key={t} style={[s.tabItem, tab === t && s.tabActive]} onPress={() => setTab(t)}>
                <Text style={[s.tabLabel, tab === t && s.tabLabelActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab content */}
          {tab === 'Overview' && (
            <View>
              <Text style={s.sectionTitle}>Company Overview</Text>
              <View style={s.table}>
                {[['Market Cap','₹10.42L Cr'],['P/E Ratio','24.8x'],['EPS (TTM)','₹114.7'],
                  ['52W High','₹3,994'],['52W Low','₹2,389'],['Div Yield','1.9%'],
                  ['Beta','0.58'],['Book Value','₹337'],['Promoter %','72.3%']].map(([k,v]) => (
                  <View key={k} style={s.tableRow}>
                    <Text style={s.tableKey}>{k}</Text>
                    <Text style={s.tableVal}>{v}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {tab === 'Technicals' && (
            <View>
              <View style={s.techSummary}>
                {[['BUY', MOCK_INDICATORS.filter(i=>i.signal==='BUY').length, Colors.bull, Colors.bullBg],
                  ['NEUTRAL', MOCK_INDICATORS.filter(i=>i.signal==='NEUTRAL').length, Colors.neutral, Colors.neutralBg],
                  ['SELL', MOCK_INDICATORS.filter(i=>i.signal==='SELL').length, Colors.bear, Colors.bearBg]].map(([l,n,c,bg]) => (
                  <View key={l as string} style={[s.techPill, { backgroundColor: bg as string }]}>
                    <Text style={[s.techPillText, { color: c as string }]}>{n} {l}</Text>
                  </View>
                ))}
              </View>
              {MOCK_INDICATORS.map(ind => {
                const ic = ind.signal==='BUY'?Colors.bull:ind.signal==='SELL'?Colors.bear:Colors.neutral;
                return (
                  <View key={ind.name} style={s.indRow}>
                    <View style={[s.indDot, { backgroundColor: ic }]} />
                    <Text style={s.indName}>{ind.name}</Text>
                    <Text style={s.indVal}>{ind.value}</Text>
                    <Text style={[s.indSig, { color: ic }]}>{ind.signal}</Text>
                  </View>
                );
              })}
            </View>
          )}

          {tab === 'News' && MOCK_NEWS.map(item => {
            const sc = item.sentiment==='POSITIVE'?Colors.bull:item.sentiment==='NEGATIVE'?Colors.bear:Colors.neutral;
            return (
              <View key={item.id} style={s.newsCard}>
                <View style={s.newsTop}>
                  <View style={[s.sentDot, { backgroundColor: sc+'22', borderColor: sc+'55' }]}>
                    <Text style={{ color: sc, fontSize:10, fontWeight:'700' }}>{item.sentiment==='POSITIVE'?'▲':item.sentiment==='NEGATIVE'?'▼':'●'}</Text>
                  </View>
                  <Text style={s.newsSource}>{item.source}</Text>
                  <Text style={s.newsTime}>{item.time}</Text>
                </View>
                <Text style={s.newsHeadline}>{item.headline}</Text>
              </View>
            );
          })}

          {tab === 'Events' && MOCK_EVENTS.map(ev => {
            const ic = ev.impact==='HIGH'?Colors.bear:ev.impact==='MEDIUM'?Colors.warning:Colors.textMuted;
            return (
              <View key={ev.id} style={s.eventCard}>
                <View style={{ flex:1 }}>
                  <Text style={{ fontSize: Typography.xs, color: Colors.textMuted, marginBottom:2 }}>{ev.type}</Text>
                  <Text style={{ fontSize: Typography.sm, fontWeight:'600', color: Colors.textPrimary }}>{ev.title}</Text>
                </View>
                <View style={{ alignItems:'flex-end' }}>
                  <Text style={{ fontSize: Typography.sm, fontWeight:'700', color: Colors.textPrimary, marginBottom:4 }}>
                    {new Date(ev.date).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}
                  </Text>
                  <View style={{ backgroundColor: ic+'22', paddingHorizontal:8, paddingVertical:3, borderRadius:4 }}>
                    <Text style={{ color: ic, fontSize:10, fontWeight:'700' }}>{ev.impact}</Text>
                  </View>
                </View>
              </View>
            );
          })}

          {tab === 'F&O' && (
            <View>
              <View style={[s.table, { marginBottom: Spacing.md }]}>
                <View style={s.tableRow}><Text style={s.tableKey}>Instrument</Text><Text style={s.tableVal}>TCS MAY 2900 CE</Text></View>
                <View style={s.tableRow}><Text style={s.tableKey}>Open Interest</Text><Text style={s.tableVal}>12,45,600</Text></View>
                <View style={s.tableRow}><Text style={s.tableKey}>OI Change</Text><Text style={[s.tableVal, { color: Colors.bull }]}>+8.4%</Text></View>
                <View style={s.tableRow}><Text style={s.tableKey}>Implied Vol.</Text><Text style={s.tableVal}>24.6%</Text></View>
                <View style={s.tableRow}><Text style={s.tableKey}>Put-Call Ratio</Text><Text style={s.tableVal}>0.72</Text></View>
              </View>
              <Text style={{ fontSize: Typography.xs, color: Colors.textMuted, textAlign:'center' }}>
                F&O data sourced from NSE. Derivatives trading involves significant risk.
              </Text>
            </View>
          )}

          <View style={{ height: 80 }} />
        </View>
      </ScrollView>

      <HistoryModal visible={showHist} onClose={() => setShowHist(false)} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:   { flex:1, backgroundColor: Colors.bg },
  scroll: { flex:1 },
  navBar: { flexDirection:'row', alignItems:'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, borderBottomWidth:1, borderBottomColor: Colors.border },
  backBtn:{ padding: Spacing.xs, marginRight: Spacing.sm },
  backIcon:{ fontSize:28, color: Colors.textPrimary, lineHeight:32 },
  navCenter:{ flex:1, alignItems:'center' },
  navSym: { fontSize: Typography.lg, fontWeight:'700', color: Colors.textPrimary },
  navEx:  { fontSize: Typography.xs, color: Colors.textSecondary },
  watchBtn:{ padding: Spacing.xs },
  watchIcon:{ fontSize:22, color: Colors.textSecondary },
  priceHeader:{ paddingHorizontal: Spacing.base, paddingTop: Spacing.base, paddingBottom: Spacing.md, borderBottomWidth:1, borderBottomColor: Colors.border },
  companyName:{ fontSize: Typography.sm, color: Colors.textSecondary, marginBottom: Spacing.xs },
  priceRow:{ flexDirection:'row', alignItems:'center', gap: Spacing.sm, marginBottom:4 },
  livePrice:{ fontSize:32, fontWeight:'800', color: Colors.textPrimary },
  changePill:{ backgroundColor: Colors.bullBg, paddingHorizontal: Spacing.sm, paddingVertical:4, borderRadius:8 },
  changeText:{ fontSize: Typography.sm, fontWeight:'700', color: Colors.bull },
  priceSub:{ fontSize: Typography.xs, color: Colors.textMuted },
  body: { paddingHorizontal: Spacing.base, paddingTop: Spacing.base },
  periodRow:{ flexDirection:'row', marginBottom: Spacing.sm },
  periodPill:{ flex:1, alignItems:'center', paddingVertical:6, borderRadius:8 },
  periodActive:{ backgroundColor: Colors.primary+'22' },
  periodText:{ fontSize: Typography.xs, color: Colors.textSecondary, fontWeight:'600' },
  periodTextActive:{ color: Colors.primary },
  chartBox:{ backgroundColor: Colors.surfaceAlt, borderRadius:10, padding: Spacing.sm, marginBottom: Spacing.md },
  chartBars:{ flexDirection:'row', alignItems:'flex-end', height:120, paddingHorizontal: Spacing.xs, gap:3 },
  bar:{ flex:1, borderRadius:2 },
  chartNote:{ fontSize: Typography.xs, color: Colors.textMuted, textAlign:'center', marginTop: Spacing.sm },
  tabBar:{ flexDirection:'row', backgroundColor: Colors.surfaceAlt, borderRadius:10, padding:3, marginBottom: Spacing.md },
  tabItem:{ flex:1, alignItems:'center', paddingVertical:8, borderRadius:8 },
  tabActive:{ backgroundColor: Colors.surface },
  tabLabel:{ fontSize: Typography.xs, color: Colors.textSecondary, fontWeight:'600' },
  tabLabelActive:{ color: Colors.textPrimary },
  sectionTitle:{ fontSize: Typography.base, fontWeight:'700', color: Colors.textPrimary, marginBottom: Spacing.md },
  table:{ backgroundColor: Colors.surface, borderRadius:12, borderWidth:1, borderColor: Colors.border, overflow:'hidden' },
  tableRow:{ flexDirection:'row', justifyContent:'space-between', paddingHorizontal: Spacing.base, paddingVertical:12, borderBottomWidth:1, borderBottomColor: Colors.border },
  tableKey:{ fontSize: Typography.sm, color: Colors.textSecondary },
  tableVal:{ fontSize: Typography.sm, fontWeight:'600', color: Colors.textPrimary },
  techSummary:{ flexDirection:'row', gap: Spacing.sm, marginBottom: Spacing.md },
  techPill:{ flex:1, alignItems:'center', paddingVertical: Spacing.sm, borderRadius:8 },
  techPillText:{ fontSize: Typography.sm, fontWeight:'700' },
  indRow:{ flexDirection:'row', alignItems:'center', paddingVertical:10, borderBottomWidth:1, borderBottomColor: Colors.border },
  indDot:{ width:8, height:8, borderRadius:4, marginRight: Spacing.sm },
  indName:{ flex:1, fontSize: Typography.sm, color: Colors.textSecondary },
  indVal:{ fontSize: Typography.sm, color: Colors.textPrimary, marginRight: Spacing.sm, width:70, textAlign:'right' },
  indSig:{ fontSize: Typography.xs, fontWeight:'700', width:52, textAlign:'right' },
  newsCard:{ backgroundColor: Colors.surface, borderRadius:12, borderWidth:1, borderColor: Colors.border, padding: Spacing.md, marginBottom: Spacing.sm },
  newsTop:{ flexDirection:'row', alignItems:'center', marginBottom: Spacing.xs },
  sentDot:{ width:20, height:20, borderRadius:10, borderWidth:1, alignItems:'center', justifyContent:'center', marginRight: Spacing.xs },
  newsSource:{ fontSize: Typography.xs, color: Colors.textMuted, flex:1 },
  newsTime:{ fontSize: Typography.xs, color: Colors.textMuted },
  newsHeadline:{ fontSize: Typography.sm, color: Colors.textPrimary, lineHeight:20 },
  eventCard:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor: Colors.surface, borderRadius:12, borderWidth:1, borderColor: Colors.border, padding: Spacing.md, marginBottom: Spacing.sm },
});
