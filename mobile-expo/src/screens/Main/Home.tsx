import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  RefreshControl, FlatList, TextInput,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import { Badge, Card } from '../../components/common';

// ─── Types ────────────────────────────────────────────────────────────────────

type SignalType = 'BUY' | 'SELL' | 'HOLD';
type TradeType  = 'INTRADAY' | 'DELIVERY';

interface Signal {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  type: SignalType;
  tradeType: TradeType;
  confidence: number;        // 0-100
  currentPrice: number;
  targetPrice: number;
  stopLoss: number;
  upside: number;            // % to target
  sector: string;
  generatedAt: string;       // ISO
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_SIGNALS: Signal[] = [
  {
    id: '1', symbol: 'RELIANCE', name: 'Reliance Industries', exchange: 'NSE',
    type: 'BUY', tradeType: 'DELIVERY', confidence: 87, currentPrice: 2845.50,
    targetPrice: 3100, stopLoss: 2720, upside: 8.9, sector: 'Energy',
    generatedAt: new Date(Date.now() - 12 * 60000).toISOString(),
  },
  {
    id: '2', symbol: 'HDFCBANK', name: 'HDFC Bank', exchange: 'NSE',
    type: 'BUY', tradeType: 'INTRADAY', confidence: 74, currentPrice: 1685.20,
    targetPrice: 1740, stopLoss: 1655, upside: 3.2, sector: 'Financials',
    generatedAt: new Date(Date.now() - 28 * 60000).toISOString(),
  },
  {
    id: '3', symbol: 'SIEMENS', name: 'Siemens AG', exchange: 'DAX',
    type: 'SELL', tradeType: 'DELIVERY', confidence: 81, currentPrice: 178.40,
    targetPrice: 162, stopLoss: 185, upside: -9.2, sector: 'Industrials',
    generatedAt: new Date(Date.now() - 45 * 60000).toISOString(),
  },
  {
    id: '4', symbol: 'NVDA', name: 'NVIDIA Corporation', exchange: 'NASDAQ',
    type: 'BUY', tradeType: 'DELIVERY', confidence: 92, currentPrice: 875.60,
    targetPrice: 980, stopLoss: 830, upside: 11.9, sector: 'Technology',
    generatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: '5', symbol: 'TCS', name: 'Tata Consultancy Services', exchange: 'NSE',
    type: 'HOLD', tradeType: 'DELIVERY', confidence: 61, currentPrice: 3945.80,
    targetPrice: 4100, stopLoss: 3820, upside: 3.9, sector: 'IT',
    generatedAt: new Date(Date.now() - 90 * 60000).toISOString(),
  },
  {
    id: '6', symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ',
    type: 'BUY', tradeType: 'INTRADAY', confidence: 78, currentPrice: 189.45,
    targetPrice: 196, stopLoss: 184, upside: 3.5, sector: 'Technology',
    generatedAt: new Date(Date.now() - 18 * 60000).toISOString(),
  },
];

const FILTERS: SignalType[] = ['BUY', 'SELL', 'HOLD'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1)  return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

function formatPrice(n: number) {
  return n >= 1000 ? n.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : n.toFixed(2);
}

// ─── Signal Card ──────────────────────────────────────────────────────────────

function SignalCard({ signal, onPress }: { signal: Signal; onPress: () => void }) {
  const isBull  = signal.type === 'BUY';
  const isBear  = signal.type === 'SELL';
  const accent  = isBull ? Colors.bull : isBear ? Colors.bear : Colors.neutral;
  const bgColor = isBull ? Colors.bullBg : isBear ? Colors.bearBg : Colors.neutralBg;

  const confidenceColor =
    signal.confidence >= 80 ? Colors.bull :
    signal.confidence >= 60 ? Colors.warning : Colors.bear;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <Card style={[styles.signalCard, { borderLeftColor: accent, borderLeftWidth: 3 }]}>
        {/* Row 1 — symbol + signal badge */}
        <View style={styles.row}>
          <View style={styles.symbolWrap}>
            <Text style={styles.symbol}>{signal.symbol}</Text>
            <Text style={styles.exchange}>{signal.exchange} · {signal.sector}</Text>
          </View>
          <View style={styles.rightTop}>
            <Badge
              label={signal.type}
              variant={isBull ? 'bull' : isBear ? 'bear' : 'neutral'}
            />
            <Badge
              label={signal.tradeType}
              variant="info"
              style={{ marginTop: Spacing.xxs }}
              small
            />
          </View>
        </View>

        {/* Row 2 — prices */}
        <View style={[styles.row, { marginTop: Spacing.sm }]}>
          <View style={styles.priceBlock}>
            <Text style={styles.priceLabel}>Current</Text>
            <Text style={styles.priceValue}>₹{formatPrice(signal.currentPrice)}</Text>
          </View>
          <View style={[styles.priceBlock, { alignItems: 'center' }]}>
            <Text style={styles.priceLabel}>Target</Text>
            <Text style={[styles.priceValue, { color: isBull ? Colors.bull : Colors.bear }]}>
              ₹{formatPrice(signal.targetPrice)}
            </Text>
          </View>
          <View style={[styles.priceBlock, { alignItems: 'flex-end' }]}>
            <Text style={styles.priceLabel}>Stop-Loss</Text>
            <Text style={[styles.priceValue, { color: Colors.bear }]}>
              ₹{formatPrice(signal.stopLoss)}
            </Text>
          </View>
        </View>

        {/* Row 3 — upside + confidence */}
        <View style={[styles.row, { marginTop: Spacing.sm, alignItems: 'center' }]}>
          <View style={[styles.upside, { backgroundColor: bgColor }]}>
            <Text style={[styles.upsideText, { color: accent }]}>
              {signal.upside > 0 ? '+' : ''}{signal.upside}%
            </Text>
          </View>

          {/* Confidence bar */}
          <View style={styles.confWrap}>
            <View style={styles.confBar}>
              <View style={[styles.confFill, { width: `${signal.confidence}%` as any, backgroundColor: confidenceColor }]} />
            </View>
            <Text style={[styles.confLabel, { color: confidenceColor }]}>
              {signal.confidence}% conf.
            </Text>
          </View>

          <Text style={styles.timeAgo}>{timeAgo(signal.generatedAt)}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

// ─── Market Summary Strip ─────────────────────────────────────────────────────

const MARKETS = [
  { name: 'NIFTY 50',  value: '22,456', change: '+0.62%', up: true },
  { name: 'SENSEX',    value: '73,910', change: '+0.58%', up: true },
  { name: 'DAX',       value: '18,230', change: '-0.12%', up: false },
  { name: 'NASDAQ',    value: '17,842', change: '+1.34%', up: true },
  { name: 'S&P 500',   value: '5,308',  change: '+0.87%', up: true },
  { name: 'DOW',       value: '39,760', change: '+0.44%', up: true },
];

function MarketStrip() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.stripContent}
      style={styles.strip}
    >
      {MARKETS.map((m) => (
        <View key={m.name} style={styles.marketChip}>
          <Text style={styles.marketName}>{m.name}</Text>
          <Text style={styles.marketValue}>{m.value}</Text>
          <Text style={[styles.marketChange, { color: m.up ? Colors.bull : Colors.bear }]}>
            {m.change}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

type Props = NativeStackScreenProps<any, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [activeFilter, setActiveFilter] = useState<SignalType | 'ALL'>('ALL');
  const [refreshing, setRefreshing]     = useState(false);
  const [searchQuery, setSearchQuery]   = useState('');

  const filtered = MOCK_SIGNALS.filter((s) => {
    const matchesFilter = activeFilter === 'ALL' || s.type === activeFilter;
    const matchesSearch =
      searchQuery === '' ||
      s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>AI Signals</Text>
          <Text style={styles.headerSub}>
            {MOCK_SIGNALS.length} signals · updated 2 min ago
          </Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
          <Text style={styles.refreshIcon}>↻</Text>
        </TouchableOpacity>
      </View>

      {/* Market strip */}
      <MarketStrip />

      {/* Search */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search symbol or company…"
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="characters"
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContent}
        style={styles.filterRow}
      >
        {(['ALL', ...FILTERS] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterPill, activeFilter === f && styles.filterPillActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Signal list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SignalCard
            signal={item}
            onPress={() => navigation.navigate('StockDetail', { symbol: item.symbol, exchange: item.exchange })}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No signals match your filter</Text>
          </View>
        }
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: Colors.bg },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xxxl + 8,
    paddingBottom: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold as any,
    color: Colors.textPrimary,
  },
  headerSub: { fontSize: Typography.xs, color: Colors.textMuted, marginTop: 2 },
  refreshBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  refreshIcon: { fontSize: 18, color: Colors.primary },

  strip: { maxHeight: 72 },
  stripContent: { paddingHorizontal: Spacing.base, gap: Spacing.sm, alignItems: 'center' },
  marketChip: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    minWidth: 90,
    alignItems: 'center',
  },
  marketName:   { fontSize: Typography.xs, color: Colors.textMuted },
  marketValue:  { fontSize: Typography.sm, fontWeight: Typography.semibold as any, color: Colors.textPrimary, marginVertical: 1 },
  marketChange: { fontSize: Typography.xs, fontWeight: Typography.medium as any },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: Spacing.base,
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    height: 40,
  },
  searchIcon:  { fontSize: 14, marginRight: Spacing.xs },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.sm,
    paddingVertical: 0,
  },
  clearBtn: { fontSize: 14, color: Colors.textMuted, paddingHorizontal: Spacing.xs },

  filterRow:    { maxHeight: 44, marginTop: Spacing.sm },
  filterContent: { paddingHorizontal: Spacing.base, gap: Spacing.xs, alignItems: 'center' },
  filterPill: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterPillActive: {
    backgroundColor: Colors.primaryDim,
    borderColor: Colors.primary,
  },
  filterText:       { fontSize: Typography.sm, color: Colors.textSecondary, fontWeight: Typography.medium as any },
  filterTextActive: { color: Colors.primary, fontWeight: Typography.bold as any },

  listContent: { padding: Spacing.base, paddingTop: Spacing.sm, gap: Spacing.sm },

  signalCard: { marginBottom: 0 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  symbolWrap: { flex: 1 },
  symbol:   { fontSize: Typography.md, fontWeight: Typography.bold as any, color: Colors.textPrimary },
  exchange: { fontSize: Typography.xs, color: Colors.textMuted, marginTop: 2 },
  rightTop: { alignItems: 'flex-end', gap: Spacing.xxs },

  priceBlock: { flex: 1 },
  priceLabel: { fontSize: Typography.xs, color: Colors.textMuted },
  priceValue: { fontSize: Typography.sm, fontWeight: Typography.semibold as any, color: Colors.textPrimary, marginTop: 2 },

  upside: {
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
  },
  upsideText: { fontSize: Typography.sm, fontWeight: Typography.bold as any },

  confWrap: { flex: 1, paddingHorizontal: Spacing.sm },
  confBar:  { height: 4, backgroundColor: Colors.surfaceAlt, borderRadius: 2, overflow: 'hidden', marginBottom: 3 },
  confFill: { height: '100%', borderRadius: 2 },
  confLabel: { fontSize: Typography.xs },

  timeAgo: { fontSize: Typography.xs, color: Colors.textMuted },

  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 40 },
  emptyText: { fontSize: Typography.base, color: Colors.textMuted, marginTop: Spacing.sm },
});
