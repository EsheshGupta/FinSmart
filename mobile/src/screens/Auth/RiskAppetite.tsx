import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../../components/common';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';

type Props = NativeStackScreenProps<any, 'RiskAppetite'>;

const LEVELS = [
  {
    id: 'LOW',
    label: 'Low Risk',
    icon: '🛡️',
    color: Colors.info,
    bg: '#63B3ED20',
    desc: 'Capital preservation first. Targets stable, well-established companies with lower volatility. Conservative stop-losses.',
    example: 'e.g. Blue-chip delivery trades, Nifty50 index stocks',
  },
  {
    id: 'MEDIUM',
    label: 'Medium Risk',
    icon: '⚖️',
    color: Colors.primary,
    bg: Colors.primaryDim,
    desc: 'Balanced approach. Mix of growth and stability. Moderate targets with reasonable stop-losses.',
    example: 'e.g. Large-cap + select mid-cap, mix of intraday and delivery',
  },
  {
    id: 'HIGH',
    label: 'High Risk',
    icon: '🚀',
    color: Colors.warning,
    bg: '#F6AD5520',
    desc: 'Growth-oriented. Higher target prices and wider stop-losses. More volatile instruments included.',
    example: 'e.g. Mid-cap, small-cap, sector plays, F&O signals',
  },
  {
    id: 'ULTRA_HIGH',
    label: 'Ultra High',
    icon: '⚡',
    color: Colors.bear,
    bg: Colors.bearBg,
    desc: 'Maximum aggression. Short-term intraday focus, derivatives, high-beta stocks. Significant drawdown risk.',
    example: 'e.g. Intraday F&O, small-cap momentum, aggressive sector rotation',
  },
];

export default function RiskAppetiteScreen({ navigation }: Props) {
  const [selected, setSelected] = useState('MEDIUM');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Risk Appetite</Text>
      <Text style={styles.subtitle}>
        This shapes how aggressive our AI signals are. Be honest — you can change this anytime.
      </Text>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {LEVELS.map(level => {
          const active = selected === level.id;
          return (
            <TouchableOpacity
              key={level.id}
              style={[styles.card, active && { borderColor: level.color, backgroundColor: level.bg }]}
              onPress={() => setSelected(level.id)}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardLeft}>
                  <Text style={styles.icon}>{level.icon}</Text>
                  <Text style={[styles.label, active && { color: level.color }]}>{level.label}</Text>
                </View>
                <View style={[styles.radio, active && { borderColor: level.color }]}>
                  {active && <View style={[styles.radioDot, { backgroundColor: level.color }]} />}
                </View>
              </View>
              <Text style={styles.desc}>{level.desc}</Text>
              <Text style={styles.example}>{level.example}</Text>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: Spacing.xxl }} />
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Continue"
          onPress={() => navigation.navigate('RecommendationMode')}
          fullWidth size="lg"
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
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    borderWidth: 1.5, borderColor: Colors.border,
    padding: Spacing.base, marginBottom: Spacing.md,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  cardLeft:   { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  icon:       { fontSize: 24 },
  label:      { fontSize: Typography.md, fontWeight: Typography.bold, color: Colors.textPrimary },
  radio:      { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  radioDot:   { width: 12, height: 12, borderRadius: 6 },
  desc:       { fontSize: Typography.sm, color: Colors.textSecondary, lineHeight: 20, marginBottom: Spacing.xs },
  example:    { fontSize: Typography.xs, color: Colors.textMuted, fontStyle: 'italic' },
  footer:     { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxl, paddingTop: Spacing.base },
});
