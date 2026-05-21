import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  FlatList, TextInput,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';
import { Badge, Card } from '../../components/common';

// ─── Types ────────────────────────────────────────────────────────────────────

interface WatchItem {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  currentPrice: number;
  changePct: number;
  signal: 'BUY' | 'SELL' | 'HOLD' | null;
  confidence: number | null;
  alertPrice: number | null;    // price alert set by user
  sector: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_WATCHLIST: WatchItem[] = [
  { id: '1', symbol: 'INFY',     name: 'Infosys Ltd',           exchange: 'NSE',    currentPrice: 1782.40, changePct:  1.24, signal: 'BUY',  confidence: 78, alertPrice: 1850,  sector: 'IT' },
  { id: '2', symbol: 'MARUTI',   name: 'Maruti Suzuki India',   exchange: 'NSE',    currentPrice: 11420,   changePct: -0.55, signal: 'HOLD', confidence: 61, alertPrice: null,  sector: 'Auto' },
  { id: '3', symbol: 'AMZN',     name: 'Amazon.com Inc.',       exchange: 'NASDAQ', currentPrice: 185.20,  changePct:  2.11, signal: 'BUY',  confidence: 84, alertPrice: 200,   sector: 'Tech' },
  { id: '4', symbol: 'BOSCHLTD', name: 'Bosch Ltd',             exchange: 'NSE',    currentPrice: 28450,   changePct:  0.82, signal: 'BUY',  confidence: 69, alertPrice: null,  sector: 'Auto' },
  { id: '5', symbol: 'BAYER',    name: 'Bayer AG',              exchange: 'DAX',    currentPrice: 28.40,   changePct: -3.14, signal: 'SELL', confidence: 76, alertPrice: 27,    sector: 'Pharma' },
  { id: '6', symbol: 'GOOGL',    name: 'Alphabet Inc.',         exchange: 'NASDAQ', currentPrice: 174.50,  changePct:  0.94, signal: 'BUY',  confidence: 80, alertPrice: null,  sector: 'Tech' },
];

// 50 max watchlist items
const MAX_ITEMS = 50;

// ─── Watch Item Row ───────────────────────────────────────────────────────────

function WatchRow({
  item,
  onPress,
  onRemove,
}: {
  item: WatchItem;
  onPress: () => void;
  onRemove: () => void;
}) {
  const up = item.changePct >= 0;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={styles.watchCard}>
        <View style={styles.watchRow}>
          {/* Symbol + name */}
          <View style={styles.watchLeft}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={styles.watchSymbol}>{item.symbol}</Text>
              <Text style={styles.watchExch}> {item.exchange}</Text>
            </View>
            <Text style={styles.watchName} numberOfLines={1}>{item.name}</Text>
            {item.alertPrice != null && (
              <View style={styles.alertTag}>
                <Text style={styles.alertTagText}>🔔 Alert @ {item.alertPrice.toLocaleString('en-IN')}</Text>
              </View>
            )}
          </View>

          {/* Signal */}
          <View style={styles.watchMid}>
            {item.signal && (
              <Badge
                label={item.signal}
                variant={item.signal === 'BUY' ? 'bull' : item.signal === 'SELL' ? 'bear' : 'neutral'}
                small
              />
            )}
            {item.confidence != null && (
              <Text style={styles.watchConf}>{item.confidence}%</Text>
            )}
          </View>

          {/* Price + change */}
          <View style={styles.watchRight}>
            <Text style={styles.watchPrice}>
              {item.currentPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </Text>
            <Text style={[styles.watchChange, { color: up ? Colors.bull : Colors.bear }]}>
              {up ? '+' : ''}{item.changePct.toFixed(2)}%
            </Text>
          </View>

          {/* Remove */}
          <TouchableOpacity style={styles.removeBtn} onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.removeIcon}>✕</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

type SortKey = 'changePct' | 'signal' | 'default';
type Props   = NativeStackScreenProps<any, 'Watchlist'>;

export default function WatchlistScreen({ navigation }: Props) {
  const [items,  setItems]  = useState<WatchItem[]>(MOCK_WATCHLIST);
  const [sortBy, setSortBy] = useState<SortKey>('default');
  const [search, setSearch] = useState('');

  const sorted = [...items]
    .filter(
      (i) =>
        search === '' ||
        i.symbol.toLowerCase().includes(search.toLowerCase()) ||
        i.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'changePct') return b.changePct - a.changePct;
      if (sortBy === 'signal') {
        const order = { BUY: 0, HOLD: 1, SELL: 2 };
        return (order[a.signal ?? 'HOLD'] ?? 1) - (order[b.signal ?? 'HOLD'] ?? 1);
      }
      return 0;
    });

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Watchlist</Text>
          <Text style={styles.headerSub}>{items.length} / {MAX_ITEMS} stocks</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('Discover')}
        >
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Filter watchlist…"
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search !== '' && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Sort row */}
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sort:</Text>
        {(['default', 'changePct', 'signal'] as SortKey[]).map((k) => (
          <TouchableOpacity
            key={k}
            style={[styles.sortPill, sortBy === k && styles.sortPillActive]}
            onPress={() => setSortBy(k)}
          >
            <Text style={[styles.sortText, sortBy === k && styles.sortTextActive]}>
              {k === 'default' ? 'Default' : k === 'changePct' ? 'Change' : 'Signal'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Capacity bar */}
      <View style={styles.capacityRow}>
        <View style={styles.capacityBar}>
          <View
            style={[
              styles.capacityFill,
              {
                width: `${(items.length / MAX_ITEMS) * 100}%` as any,
                backgroundColor: items.length > 40 ? Colors.warning : Colors.primary,
              },
            ]}
          />
        </View>
        <Text style={styles.capacityText}>{MAX_ITEMS - items.length} slots remaining</Text>
      </View>

      {/* List */}
      <FlatList
        data={sorted}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <WatchRow
            item={item}
            onPress={() => navigation.navigate('StockDetail', { symbol: item.symbol, exchange: item.exchange })}
            onRemove={() => removeItem(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>👁</Text>
            <Text style={styles.emptyTitle}>Your watchlist is empty</Text>
            <Text style={styles.emptySub}>Add stocks from Discover to track them here.</Text>
          </View>
        }
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xxxl + 8,
    paddingBottom: Spacing.sm,
  },
  headerTitle: { fontSize: Typography.xl, fontWeight: Typography.bold as any, color: Colors.textPrimary },
  headerSub:   { fontSize: Typography.xs, color: Colors.textMuted, marginTop: 2 },
  addBtn: {
    backgroundColor: Colors.primaryDim,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  addBtnText: { fontSize: Typography.sm, color: Colors.primary, fontWeight: Typography.bold as any },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: Spacing.base,
    paddingHorizontal: Spacing.sm,
    height: 40,
    marginBottom: Spacing.xs,
  },
  searchIcon:  { fontSize: 13, marginRight: Spacing.xs },
  searchInput: { flex: 1, color: Colors.textPrimary, fontSize: Typography.sm, paddingVertical: 0 },
  clearBtn:    { fontSize: 13, color: Colors.textMuted, paddingHorizontal: Spacing.xs },

  sortRow:  { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingHorizontal: Spacing.base, marginBottom: Spacing.xs },
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

  capacityRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, gap: Spacing.sm, marginBottom: Spacing.xs },
  capacityBar:  { flex: 1, height: 3, backgroundColor: Colors.surfaceAlt, borderRadius: 2, overflow: 'hidden' },
  capacityFill: { height: '100%', borderRadius: 2 },
  capacityText: { fontSize: Typography.xs, color: Colors.textMuted },

  listContent: { padding: Spacing.base, gap: Spacing.sm, paddingTop: Spacing.xs },

  watchCard: {},
  watchRow:  { flexDirection: 'row', alignItems: 'center' },
  watchLeft: { flex: 1 },
  watchSymbol: { fontSize: Typography.base, fontWeight: Typography.bold as any, color: Colors.textPrimary },
  watchExch:   { fontSize: Typography.xs, color: Colors.textMuted },
  watchName:   { fontSize: Typography.xs, color: Colors.textSecondary, marginTop: 2 },
  alertTag:    { marginTop: 4 },
  alertTagText:{ fontSize: Typography.xs, color: Colors.warning },
  watchMid:    { alignItems: 'center', marginHorizontal: Spacing.xs, gap: Spacing.xxs },
  watchConf:   { fontSize: Typography.xs, color: Colors.textMuted },
  watchRight:  { alignItems: 'flex-end', marginRight: Spacing.sm, minWidth: 65 },
  watchPrice:  { fontSize: Typography.base, fontWeight: Typography.semibold as any, color: Colors.textPrimary },
  watchChange: { fontSize: Typography.xs, fontWeight: Typography.medium as any, marginTop: 2 },
  removeBtn:   { padding: Spacing.xs },
  removeIcon:  { fontSize: 12, color: Colors.textMuted },

  empty: { alignItems: 'center', paddingTop: 80 },
  emptyIcon:  { fontSize: 48 },
  emptyTitle: { fontSize: Typography.lg, fontWeight: Typography.bold as any, color: Colors.textPrimary, marginTop: Spacing.base },
  emptySub:   { fontSize: Typography.sm, color: Colors.textMuted, marginTop: Spacing.xs, textAlign: 'center' },
});
