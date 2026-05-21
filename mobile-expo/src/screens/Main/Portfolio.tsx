import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  FlatList,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import { Badge, Card, Button } from '../../components/common';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Holding {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  investedValue: number;
  currentValue: number;
  pnl: number;
  pnlPct: number;
  aiSuggestion: 'BUY' | 'SELL' | 'HOLD';
  sector: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_HOLDINGS: Holding[] = [
  {
    id: '1', symbol: 'RELIANCE', name: 'Reliance Industries', exchange: 'NSE',
    quantity: 50, avgBuyPrice: 2610, currentPrice: 2845.50,
    investedValue: 130500, currentValue: 142275, pnl: 11775, pnlPct: 9.03,
    aiSuggestion: 'BUY', sector: 'Energy',
  },
  {
    id: '2', symbol: 'TCS', name: 'Tata Consultancy Services', exchange: 'NSE',
    quantity: 20, avgBuyPrice: 3820, currentPrice: 3945.80,
    investedValue: 76400, currentValue: 78916, pnl: 2516, pnlPct: 3.29,
    aiSuggestion: 'HOLD', sector: 'IT',
  },
  {
    id: '3', symbol: 'HDFCBANK', name: 'HDFC Bank', exchange: 'NSE',
    quantity: 80, avgBuyPrice: 1720, currentPrice: 1685.20,
    investedValue: 137600, currentValue: 134816, pnl: -2784, pnlPct: -2.02,
    aiSuggestion: 'HOLD', sector: 'Financials',
  },
  {
    id: '4', symbol: 'NVDA', name: 'NVIDIA Corporation', exchange: 'NASDAQ',
    quantity: 15, avgBuyPrice: 680, currentPrice: 875.60,
    investedValue: 10200, currentValue: 13134, pnl: 2934, pnlPct: 28.76,
    aiSuggestion: 'BUY', sector: 'Technology',
  },
  {
    id: '5', symbol: 'SIEMENS', name: 'Siemens AG', exchange: 'DAX',
    quantity: 30, avgBuyPrice: 190, currentPrice: 178.40,
    investedValue: 5700, currentValue: 5352, pnl: -348, pnlPct: -6.10,
    aiSuggestion: 'SELL', sector: 'Industrials',
  },
];

const TOTAL_INVESTED  = MOCK_HOLDINGS.reduce((s, h) => s + h.investedValue, 0);
const TOTAL_CURRENT   = MOCK_HOLDINGS.reduce((s, h) => s + h.currentValue, 0);
const TOTAL_PNL       = TOTAL_CURRENT - TOTAL_INVESTED;
const TOTAL_PNL_PCT   = (TOTAL_PNL / TOTAL_INVESTED) * 100;

// ─── Summary Card ─────────────────────────────────────────────────────────────

function SummaryCard({ onUpload }: { onUpload: () => void }) {
  const isProfit = TOTAL_PNL >= 0;
  return (
    <Card elevated style={styles.summaryCard}>
      <View style={styles.summaryTop}>
        <View>
          <Text style={styles.summaryLabel}>Portfolio Value</Text>
          <Text style={styles.summaryValue}>
            ₹{TOTAL_CURRENT.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </Text>
        </View>
        <TouchableOpacity style={styles.uploadBtn} onPress={onUpload}>
          <Text style={styles.uploadIcon}>⬆️</Text>
          <Text style={styles.uploadText}>Import</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryRow}>
        <View>
          <Text style={styles.summaryLabel}>Invested</Text>
          <Text style={styles.summaryMid}>
            ₹{TOTAL_INVESTED.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.summaryLabel}>P&L</Text>
          <Text style={[styles.summaryMid, { color: isProfit ? Colors.bull : Colors.bear }]}>
            {isProfit ? '+' : ''}₹{Math.abs(TOTAL_PNL).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            {' '}({isProfit ? '+' : ''}{TOTAL_PNL_PCT.toFixed(2)}%)
          </Text>
        </View>
      </View>

      {/* Holdings breakdown bar */}
      <View style={styles.breakdownBar}>
        {MOCK_HOLDINGS.map((h) => (
          <View
            key={h.id}
            style={[
              styles.breakdownSegment,
              {
                flex: h.currentValue / TOTAL_CURRENT,
                backgroundColor: h.pnl >= 0 ? Colors.bull : Colors.bear,
                opacity: 0.7 + (Math.abs(h.pnlPct) / 100) * 0.3,
              },
            ]}
          />
        ))}
      </View>
    </Card>
  );
}

// ─── Holding Row ──────────────────────────────────────────────────────────────

function HoldingRow({ holding, onPress }: { holding: Holding; onPress: () => void }) {
  const isProfit = holding.pnl >= 0;
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={styles.holdingCard}>
        <View style={styles.holdingRow}>
          {/* Left */}
          <View style={styles.holdingLeft}>
            <View style={styles.holdingSymbolRow}>
              <Text style={styles.holdingSymbol}>{holding.symbol}</Text>
              <Text style={styles.holdingExchange}> · {holding.exchange}</Text>
            </View>
            <Text style={styles.holdingName} numberOfLines={1}>{holding.name}</Text>
            <Text style={styles.holdingQty}>{holding.quantity} shares · avg ₹{holding.avgBuyPrice.toFixed(2)}</Text>
          </View>

          {/* Right */}
          <View style={styles.holdingRight}>
            <Text style={styles.holdingCurrent}>
              ₹{holding.currentValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </Text>
            <Text style={[styles.holdingPnl, { color: isProfit ? Colors.bull : Colors.bear }]}>
              {isProfit ? '+' : ''}₹{Math.abs(holding.pnl).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              {' '}({isProfit ? '+' : ''}{holding.pnlPct.toFixed(2)}%)
            </Text>
            <Badge
              label={holding.aiSuggestion}
              variant={holding.aiSuggestion === 'BUY' ? 'bull' : holding.aiSuggestion === 'SELL' ? 'bear' : 'neutral'}
              small
              style={{ marginTop: Spacing.xs, alignSelf: 'flex-end' }}
            />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

// ─── Import Modal overlay (simple) ────────────────────────────────────────────

function ImportSheet({ onClose }: { onClose: () => void }) {
  const BROKERS = [
    { name: 'Zerodha Kite', icon: '🌿', format: 'Excel / CSV' },
    { name: 'Angel One',    icon: '👼', format: 'Excel' },
    { name: 'Groww',        icon: '🌱', format: 'CSV' },
    { name: 'Manual Entry', icon: '✏️', format: 'Type manually' },
  ];
  return (
    <View style={styles.sheetOverlay}>
      <View style={styles.sheet}>
        <Text style={styles.sheetTitle}>Import Portfolio</Text>
        <Text style={styles.sheetSub}>
          Upload your holding statement to analyse and get AI recommendations per lot.
        </Text>
        {BROKERS.map((b) => (
          <TouchableOpacity key={b.name} style={styles.brokerRow}>
            <Text style={styles.brokerIcon}>{b.icon}</Text>
            <View>
              <Text style={styles.brokerName}>{b.name}</Text>
              <Text style={styles.brokerFormat}>{b.format}</Text>
            </View>
            <Text style={styles.brokerArrow}>›</Text>
          </TouchableOpacity>
        ))}
        <Button label="Cancel" variant="ghost" fullWidth onPress={onClose} style={{ marginTop: Spacing.sm }} />
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

type SortKey = 'pnlPct' | 'currentValue' | 'symbol';
type Props   = NativeStackScreenProps<any, 'Portfolio'>;

export default function PortfolioScreen({ navigation }: Props) {
  const [showImport, setShowImport] = useState(false);
  const [sortBy, setSortBy]         = useState<SortKey>('currentValue');

  const sorted = [...MOCK_HOLDINGS].sort((a, b) => {
    if (sortBy === 'symbol')       return a.symbol.localeCompare(b.symbol);
    if (sortBy === 'pnlPct')       return b.pnlPct - a.pnlPct;
    if (sortBy === 'currentValue') return b.currentValue - a.currentValue;
    return 0;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Portfolio</Text>
        <Text style={styles.headerSub}>{MOCK_HOLDINGS.length} holdings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <SummaryCard onUpload={() => setShowImport(true)} />

        {/* Sort row */}
        <View style={styles.sortRow}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          {(['currentValue', 'pnlPct', 'symbol'] as SortKey[]).map((k) => (
            <TouchableOpacity
              key={k}
              style={[styles.sortPill, sortBy === k && styles.sortPillActive]}
              onPress={() => setSortBy(k)}
            >
              <Text style={[styles.sortText, sortBy === k && styles.sortTextActive]}>
                {k === 'currentValue' ? 'Value' : k === 'pnlPct' ? 'P&L %' : 'A–Z'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Holdings */}
        {sorted.map((h) => (
          <HoldingRow
            key={h.id}
            holding={h}
            onPress={() => navigation.navigate('StockDetail', { symbol: h.symbol, exchange: h.exchange })}
          />
        ))}

        {/* Cohort performance teaser */}
        <Card style={styles.cohortCard}>
          <Text style={styles.cohortTitle}>📊 Cohort Performance</Text>
          <Text style={styles.cohortSub}>
            Users with similar risk appetite &amp; Indian mid-cap exposure averaged{' '}
            <Text style={{ color: Colors.bull }}>+14.2%</Text> this quarter.
          </Text>
          <TouchableOpacity style={styles.cohortBtn}>
            <Text style={styles.cohortBtnText}>View detailed breakdown →</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>

      {showImport && <ImportSheet onClose={() => setShowImport(false)} />}
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
  headerSub:   { fontSize: Typography.xs, color: Colors.textMuted, marginTop: 2 },

  scroll: { padding: Spacing.base, gap: Spacing.sm, paddingBottom: Spacing.xxxl },

  summaryCard:  { marginBottom: 0 },
  summaryTop:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  summaryLabel: { fontSize: Typography.xs, color: Colors.textMuted },
  summaryValue: { fontSize: Typography.xxl, fontWeight: Typography.black as any, color: Colors.textPrimary, marginTop: 2 },
  summaryRow:   { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.sm },
  summaryMid:   { fontSize: Typography.md, fontWeight: Typography.semibold as any, color: Colors.textPrimary, marginTop: 2 },

  uploadBtn:  { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceAlt, borderRadius: Radius.md, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, gap: Spacing.xs },
  uploadIcon: { fontSize: 14 },
  uploadText: { fontSize: Typography.sm, color: Colors.textSecondary, fontWeight: Typography.medium as any },

  breakdownBar: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: Spacing.base,
    gap: 1,
  },
  breakdownSegment: { borderRadius: 1 },

  sortRow:  { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginTop: Spacing.xs },
  sortLabel:{ fontSize: Typography.xs, color: Colors.textMuted },
  sortPill: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs + 1,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sortPillActive: { backgroundColor: Colors.primaryDim, borderColor: Colors.primary },
  sortText:       { fontSize: Typography.xs, color: Colors.textSecondary },
  sortTextActive: { color: Colors.primary, fontWeight: Typography.bold as any },

  holdingCard: {},
  holdingRow:  { flexDirection: 'row', justifyContent: 'space-between' },
  holdingLeft: { flex: 1, marginRight: Spacing.sm },
  holdingSymbolRow: { flexDirection: 'row', alignItems: 'baseline' },
  holdingSymbol:  { fontSize: Typography.md, fontWeight: Typography.bold as any, color: Colors.textPrimary },
  holdingExchange:{ fontSize: Typography.xs, color: Colors.textMuted },
  holdingName:    { fontSize: Typography.xs, color: Colors.textSecondary, marginTop: 2 },
  holdingQty:     { fontSize: Typography.xs, color: Colors.textMuted, marginTop: 4 },
  holdingRight:   { alignItems: 'flex-end' },
  holdingCurrent: { fontSize: Typography.md, fontWeight: Typography.semibold as any, color: Colors.textPrimary },
  holdingPnl:     { fontSize: Typography.xs, fontWeight: Typography.medium as any, marginTop: 2 },

  cohortCard:    { marginTop: Spacing.xs },
  cohortTitle:   { fontSize: Typography.base, fontWeight: Typography.bold as any, color: Colors.textPrimary },
  cohortSub:     { fontSize: Typography.sm, color: Colors.textSecondary, lineHeight: 20, marginTop: Spacing.xs },
  cohortBtn:     { marginTop: Spacing.sm },
  cohortBtnText: { fontSize: Typography.sm, color: Colors.primary, fontWeight: Typography.medium as any },

  sheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  sheetTitle: { fontSize: Typography.lg, fontWeight: Typography.bold as any, color: Colors.textPrimary },
  sheetSub:   { fontSize: Typography.sm, color: Colors.textSecondary, marginTop: Spacing.xs, marginBottom: Spacing.base, lineHeight: 20 },
  brokerRow:  {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  brokerIcon:   { fontSize: 24, marginRight: Spacing.base },
  brokerName:   { fontSize: Typography.base, fontWeight: Typography.medium as any, color: Colors.textPrimary },
  brokerFormat: { fontSize: Typography.xs, color: Colors.textMuted, marginTop: 2 },
  brokerArrow:  { marginLeft: 'auto', fontSize: 20, color: Colors.textMuted },
});
