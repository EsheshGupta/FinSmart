import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, FlatList, Keyboard,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';
import { Badge, Card } from '../../components/common';

// ─── Types ────────────────────────────────────────────────────────────────────

interface StockResult {
  symbol: string;
  name: string;
  exchange: string;
  currentPrice: number;
  change: number;       // absolute
  changePct: number;
  sector: string;
  signal: 'BUY' | 'SELL' | 'HOLD' | null;
  confidence: number | null;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const TRENDING: StockResult[] = [
  { symbol: 'ZOMATO',   name: 'Zomato Ltd',          exchange: 'NSE',    currentPrice: 178.90,  change: 6.40,  changePct: 3.71,  sector: 'Consumer', signal: 'BUY',  confidence: 83 },
  { symbol: 'TSLA',     name: 'Tesla Inc.',           exchange: 'NASDAQ', currentPrice: 176.40,  change: -5.20, changePct: -2.86, sector: 'EV',       signal: 'HOLD', confidence: 58 },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance',      exchange: 'NSE',    currentPrice: 7245.60, change: 210.5, changePct: 2.99,  sector: 'NBFC',     signal: 'BUY',  confidence: 79 },
  { symbol: 'SAP',      name: 'SAP SE',               exchange: 'DAX',    currentPrice: 182.10,  change: -1.80, changePct: -0.98, sector: 'Tech',     signal: 'HOLD', confidence: 64 },
  { symbol: 'PAYTM',    name: 'One97 Communications', exchange: 'NSE',    currentPrice: 432.15,  change: -12.4, changePct: -2.79, sector: 'Fintech',  signal: 'SELL', confidence: 71 },
  { symbol: 'META',     name: 'Meta Platforms',       exchange: 'NASDAQ', currentPrice: 489.30,  change: 14.20, changePct: 2.99,  sector: 'Tech',     signal: 'BUY',  confidence: 88 },
];

const SECTORS = ['All', 'Technology', 'Financials', 'Energy', 'FMCG', 'Pharma', 'EV', 'Metals', 'Infra'];
const TOP_GAINERS: StockResult[] = [
  { symbol: 'IRFC',     name: 'IRFC',           exchange: 'NSE', currentPrice: 185.40,  change: 14.10, changePct: 8.23,  sector: 'Infra',     signal: 'BUY',  confidence: 76 },
  { symbol: 'POLYCAB',  name: 'Polycab India',  exchange: 'NSE', currentPrice: 5842.10, change: 322.4, changePct: 5.84,  sector: 'Industrials', signal: 'BUY', confidence: 82 },
  { symbol: 'NVDA',     name: 'NVIDIA Corp.',   exchange: 'NASDAQ', currentPrice: 875.60, change: 42.30, changePct: 5.08, sector: 'Tech',    signal: 'BUY',  confidence: 92 },
];
const TOP_LOSERS: StockResult[] = [
  { symbol: 'PAYTM',   name: 'One97 Communications', exchange: 'NSE',    currentPrice: 432.15, change: -12.4,  changePct: -2.79, sector: 'Fintech',   signal: 'SELL', confidence: 71 },
  { symbol: 'TSLA',    name: 'Tesla Inc.',             exchange: 'NASDAQ', currentPrice: 176.40, change: -5.20, changePct: -2.86, sector: 'EV',        signal: 'HOLD', confidence: 58 },
  { symbol: 'SIEMENS', name: 'Siemens AG',             exchange: 'DAX',    currentPrice: 178.40, change: -3.80, changePct: -2.08, sector: 'Industrials', signal: 'SELL', confidence: 81 },
];

// ─── Components ───────────────────────────────────────────────────────────────

function StockRow({ item, onPress }: { item: StockResult; onPress: () => void }) {
  const up = item.changePct >= 0;
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={styles.stockRow}>
        <View style={styles.stockLeft}>
          <View style={styles.stockSymbolRow}>
            <Text style={styles.stockSymbol}>{item.symbol}</Text>
            <Text style={styles.stockExch}> {item.exchange}</Text>
          </View>
          <Text style={styles.stockName} numberOfLines={1}>{item.name}</Text>
        </View>
        <View style={styles.stockMid}>
          {item.signal && (
            <Badge
              label={item.signal}
              variant={item.signal === 'BUY' ? 'bull' : item.signal === 'SELL' ? 'bear' : 'neutral'}
              small
            />
          )}
          {item.confidence != null && (
            <Text style={styles.stockConf}>{item.confidence}%</Text>
          )}
        </View>
        <View style={styles.stockRight}>
          <Text style={styles.stockPrice}>{item.currentPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</Text>
          <Text style={[styles.stockChange, { color: up ? Colors.bull : Colors.bear }]}>
            {up ? '+' : ''}{item.changePct.toFixed(2)}%
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

type Props = NativeStackScreenProps<any, 'Discover'>;

export default function DiscoverScreen({ navigation }: Props) {
  const [query,    setQuery]    = useState('');
  const [sector,   setSector]   = useState('All');
  const [mode,     setMode]     = useState<'trending' | 'gainers' | 'losers'>('trending');
  const inputRef = useRef<TextInput>(null);

  const searchResults: StockResult[] = query.length > 1
    ? [...TRENDING, ...TOP_GAINERS, ...TOP_LOSERS].filter(
        (s, i, arr) =>
          arr.findIndex((x) => x.symbol === s.symbol) === i &&
          (s.symbol.toLowerCase().includes(query.toLowerCase()) ||
           s.name.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const listData =
    mode === 'gainers' ? TOP_GAINERS :
    mode === 'losers'  ? TOP_LOSERS  : TRENDING;

  const navigate = (item: StockResult) => {
    Keyboard.dismiss();
    navigation.navigate('StockDetail', { symbol: item.symbol, exchange: item.exchange });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          placeholder="Search any stock across your exchanges…"
          placeholderTextColor={Colors.textMuted}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="characters"
          returnKeyType="search"
        />
        {query !== '' && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Search results */}
      {query.length > 1 ? (
        <FlatList
          data={searchResults}
          keyExtractor={(i) => i.symbol}
          contentContainerStyle={styles.listPad}
          renderItem={({ item }) => <StockRow item={item} onPress={() => navigate(item)} />}
          ListEmptyComponent={
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>No results for "{query}"</Text>
            </View>
          }
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Sector pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sectorContent}
            style={styles.sectorRow}
          >
            {SECTORS.map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.sectorPill, sector === s && styles.sectorPillActive]}
                onPress={() => setSector(s)}
              >
                <Text style={[styles.sectorText, sector === s && styles.sectorTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Mode tabs */}
          <View style={styles.modeTabs}>
            {(['trending', 'gainers', 'losers'] as const).map((m) => (
              <TouchableOpacity
                key={m}
                style={[styles.modeTab, mode === m && styles.modeTabActive]}
                onPress={() => setMode(m)}
              >
                <Text style={[styles.modeText, mode === m && styles.modeTextActive]}>
                  {m === 'trending' ? '🔥 Trending' : m === 'gainers' ? '📈 Gainers' : '📉 Losers'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Stock list */}
          <View style={styles.listPad}>
            {listData.map((item) => (
              <StockRow key={item.symbol} item={item} onPress={() => navigate(item)} />
            ))}
          </View>

          {/* Sectoral Heatmap teaser */}
          <Card style={styles.heatmapCard}>
            <Text style={styles.heatmapTitle}>🗺  Sectoral Heatmap</Text>
            <View style={styles.heatmapGrid}>
              {[
                { name: 'IT', pct: 2.4, hot: true },
                { name: 'Banks', pct: -0.8, hot: false },
                { name: 'Energy', pct: 1.1, hot: true },
                { name: 'FMCG', pct: 0.3, hot: true },
                { name: 'Pharma', pct: -1.5, hot: false },
                { name: 'Metals', pct: 3.2, hot: true },
              ].map((sec) => (
                <View
                  key={sec.name}
                  style={[
                    styles.heatCell,
                    { backgroundColor: sec.hot ? `${Colors.bull}22` : `${Colors.bear}22` },
                  ]}
                >
                  <Text style={styles.heatName}>{sec.name}</Text>
                  <Text style={[styles.heatPct, { color: sec.hot ? Colors.bull : Colors.bear }]}>
                    {sec.pct > 0 ? '+' : ''}{sec.pct}%
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        </ScrollView>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xxxl + 8,
    paddingBottom: Spacing.sm,
  },
  headerTitle: { fontSize: Typography.xl, fontWeight: Typography.bold as any, color: Colors.textPrimary },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: Spacing.base,
    paddingHorizontal: Spacing.sm,
    height: 44,
    marginBottom: Spacing.sm,
  },
  searchIcon:  { fontSize: 14, marginRight: Spacing.xs },
  searchInput: { flex: 1, color: Colors.textPrimary, fontSize: Typography.base, paddingVertical: 0 },
  clearBtn:    { fontSize: 14, color: Colors.textMuted, paddingHorizontal: Spacing.xs },

  sectorRow:    { maxHeight: 44, marginBottom: Spacing.xs },
  sectorContent:{ paddingHorizontal: Spacing.base, gap: Spacing.xs, alignItems: 'center' },
  sectorPill:   {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectorPillActive: { backgroundColor: Colors.primaryDim, borderColor: Colors.primary },
  sectorText:       { fontSize: Typography.xs, color: Colors.textSecondary },
  sectorTextActive: { color: Colors.primary, fontWeight: Typography.bold as any },

  modeTabs: {
    flexDirection: 'row',
    marginHorizontal: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  modeTab:       { flex: 1, alignItems: 'center', paddingVertical: Spacing.sm },
  modeTabActive: { backgroundColor: Colors.surfaceAlt },
  modeText:      { fontSize: Typography.xs, color: Colors.textSecondary },
  modeTextActive:{ color: Colors.primary, fontWeight: Typography.bold as any },

  listPad: { padding: Spacing.base, gap: Spacing.sm },

  stockRow:      {},
  stockLeft:     { flex: 1, marginRight: Spacing.sm },
  stockSymbolRow:{ flexDirection: 'row', alignItems: 'baseline' },
  stockSymbol:   { fontSize: Typography.base, fontWeight: Typography.bold as any, color: Colors.textPrimary },
  stockExch:     { fontSize: Typography.xs, color: Colors.textMuted },
  stockName:     { fontSize: Typography.xs, color: Colors.textSecondary, marginTop: 2 },
  stockMid:      { alignItems: 'center', marginRight: Spacing.sm, gap: Spacing.xxs },
  stockConf:     { fontSize: Typography.xs, color: Colors.textMuted },
  stockRight:    { alignItems: 'flex-end', minWidth: 70 },
  stockPrice:    { fontSize: Typography.base, fontWeight: Typography.semibold as any, color: Colors.textPrimary },
  stockChange:   { fontSize: Typography.xs, fontWeight: Typography.medium as any, marginTop: 2 },

  sectionHeader: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold as any,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },

  noResults:     { alignItems: 'center', paddingTop: 60 },
  noResultsText: { fontSize: Typography.base, color: Colors.textMuted },

  heatmapCard:  { marginHorizontal: Spacing.base, marginBottom: Spacing.xxxl },
  heatmapTitle: { fontSize: Typography.base, fontWeight: Typography.bold as any, color: Colors.textPrimary, marginBottom: Spacing.sm },
  heatmapGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  heatCell:     {
    width: (width - Spacing.base * 2 - Spacing.base * 2 - Spacing.xs * 2) / 3,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  heatName: { fontSize: Typography.xs, color: Colors.textSecondary },
  heatPct:  { fontSize: Typography.sm, fontWeight: Typography.bold as any, marginTop: 2 },
});
