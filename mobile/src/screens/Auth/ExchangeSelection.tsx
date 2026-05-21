import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Switch,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../../components/common';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';

type Props = NativeStackScreenProps<any, 'ExchangeSelection'>;

const EXCHANGES = [
  { id:'NSE',    label:'NSE',         country:'India',   flag:'🇮🇳', desc:'National Stock Exchange' },
  { id:'BSE',    label:'BSE',         country:'India',   flag:'🇮🇳', desc:'Bombay Stock Exchange' },
  { id:'NIFTY',  label:'Nifty',       country:'India',   flag:'🇮🇳', desc:'Nifty 50 / Bank / Midcap' },
  { id:'DAX',    label:'DAX',         country:'Germany', flag:'🇩🇪', desc:'Deutsche Börse — 40 stocks' },
  { id:'NYSE',   label:'NYSE',        country:'USA',     flag:'🇺🇸', desc:'New York Stock Exchange' },
  { id:'NASDAQ', label:'NASDAQ',      country:'USA',     flag:'🇺🇸', desc:'Tech & growth listings' },
  { id:'DOW',    label:'DOW',         country:'USA',     flag:'🇺🇸', desc:'Dow Jones Industrial' },
  { id:'SP500',  label:'S&P 500',     country:'USA',     flag:'🇺🇸', desc:'Top 500 US companies' },
];

const COUNTRIES = ['India', 'Germany', 'USA'];

export default function ExchangeSelectionScreen({ navigation }: Props) {
  const [selected, setSelected]   = useState<Set<string>>(new Set(['NSE','BSE','NIFTY']));
  const [setDefault, setSetDefault] = useState(false);

  const toggle = (id: string) =>
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleContinue = () => {
    if (selected.size === 0) return;
    // TODO: persist selection + default flag to user-service
    navigation.navigate('RiskAppetite');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Markets</Text>
      <Text style={styles.subtitle}>
        Select the exchanges you invest in or want to follow.
        You can change this anytime in Settings.
      </Text>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {COUNTRIES.map(country => (
          <View key={country} style={styles.group}>
            <Text style={styles.groupLabel}>{country}</Text>
            {EXCHANGES.filter(e => e.country === country).map(ex => {
              const active = selected.has(ex.id);
              return (
                <TouchableOpacity
                  key={ex.id}
                  style={[styles.card, active && styles.cardActive]}
                  onPress={() => toggle(ex.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.cardLeft}>
                    <Text style={styles.flag}>{ex.flag}</Text>
                    <View>
                      <Text style={[styles.exLabel, active && styles.exLabelActive]}>{ex.label}</Text>
                      <Text style={styles.exDesc}>{ex.desc}</Text>
                    </View>
                  </View>
                  <View style={[styles.check, active && styles.checkActive]}>
                    {active && <Text style={styles.checkMark}>✓</Text>}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        {/* Set as default toggle */}
        <View style={styles.defaultRow}>
          <View>
            <Text style={styles.defaultLabel}>Set as my default</Text>
            <Text style={styles.defaultDesc}>
              Skip this screen on future logins
            </Text>
          </View>
          <Switch
            value={setDefault}
            onValueChange={setSetDefault}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor={Colors.textPrimary}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.selectedCount}>
          {selected.size} exchange{selected.size !== 1 ? 's' : ''} selected
        </Text>
        <Button
          label="Continue"
          onPress={handleContinue}
          disabled={selected.size === 0}
          fullWidth
          size="lg"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  title:     { fontSize: Typography.xxl, fontWeight: Typography.black, color: Colors.textPrimary, paddingHorizontal: Spacing.xl, paddingTop: Spacing.xxxl, marginBottom: Spacing.xs },
  subtitle:  { fontSize: Typography.sm, color: Colors.textSecondary, paddingHorizontal: Spacing.xl, marginBottom: Spacing.xl, lineHeight: 20 },
  scroll:    { flex: 1, paddingHorizontal: Spacing.xl },
  group:     { marginBottom: Spacing.lg },
  groupLabel:{ fontSize: Typography.xs, fontWeight: Typography.bold, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: Spacing.sm },
  card: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.surface, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.base, marginBottom: Spacing.sm,
  },
  cardActive:  { borderColor: Colors.primary, backgroundColor: Colors.primaryDim, ...Shadow.glow },
  cardLeft:    { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  flag:        { fontSize: 28 },
  exLabel:     { fontSize: Typography.base, fontWeight: Typography.semibold, color: Colors.textPrimary },
  exLabelActive:{ color: Colors.primary },
  exDesc:      { fontSize: Typography.sm, color: Colors.textSecondary, marginTop: 2 },
  check: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  checkActive:  { borderColor: Colors.primary, backgroundColor: Colors.primary },
  checkMark:    { color: Colors.textInverse, fontSize: 12, fontWeight: Typography.bold },
  defaultRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.surface, borderRadius: Radius.md,
    padding: Spacing.base, marginBottom: Spacing.xxl,
    borderWidth: 1, borderColor: Colors.border,
  },
  defaultLabel: { fontSize: Typography.base, color: Colors.textPrimary, fontWeight: Typography.medium },
  defaultDesc:  { fontSize: Typography.sm, color: Colors.textSecondary, marginTop: 2 },
  footer:         { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxl, paddingTop: Spacing.base },
  selectedCount:  { fontSize: Typography.sm, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.md },
});
