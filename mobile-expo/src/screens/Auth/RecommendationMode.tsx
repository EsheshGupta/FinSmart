import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../../components/common';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';

type Props = NativeStackScreenProps<any, 'RecommendationMode'>;

interface SliderRowProps {
  label: string; hint: string;
  value: number; min: number; max: number; step: number;
  onInc: () => void; onDec: () => void;
  format?: (v: number) => string;
}

function SliderRow({ label, hint, value, min, max, step, onInc, onDec, format }: SliderRowProps) {
  return (
    <View style={sliderStyles.row}>
      <View style={sliderStyles.info}>
        <Text style={sliderStyles.label}>{label}</Text>
        <Text style={sliderStyles.hint}>{hint}</Text>
      </View>
      <View style={sliderStyles.controls}>
        <TouchableOpacity
          style={[sliderStyles.btn, value <= min && sliderStyles.btnDisabled]}
          onPress={onDec} disabled={value <= min}
        >
          <Text style={sliderStyles.btnText}>−</Text>
        </TouchableOpacity>
        <Text style={sliderStyles.value}>{format ? format(value) : value}</Text>
        <TouchableOpacity
          style={[sliderStyles.btn, value >= max && sliderStyles.btnDisabled]}
          onPress={onInc} disabled={value >= max}
        >
          <Text style={sliderStyles.btnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const sliderStyles = StyleSheet.create({
  row:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  info:      { flex: 1, marginRight: Spacing.base },
  label:     { fontSize: Typography.base, color: Colors.textPrimary, fontWeight: Typography.medium },
  hint:      { fontSize: Typography.xs, color: Colors.textMuted, marginTop: 2 },
  controls:  { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  btn:       { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  btnDisabled: { opacity: 0.3 },
  btnText:   { color: Colors.primary, fontSize: Typography.lg, fontWeight: Typography.bold, lineHeight: 22 },
  value:     { fontSize: Typography.md, fontWeight: Typography.bold, color: Colors.primary, minWidth: 40, textAlign: 'center' },
});

export default function RecommendationModeScreen({ navigation }: Props) {
  const [mode, setMode] = useState<'AI' | 'HYBRID'>('AI');
  const [variance,    setVariance]    = useState(5);
  const [stdDev,      setStdDev]      = useState(2);
  const [confidence,  setConfidence]  = useState(65);

  const handleContinue = () => {
    // TODO: save mode + hybrid params to user-service
    navigation.replace('MainTabs');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signal Mode</Text>
      <Text style={styles.subtitle}>
        How should FinSmart generate signals for you?
        Change anytime in Settings.
      </Text>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Mode cards */}
        {(['AI', 'HYBRID'] as const).map(m => (
          <TouchableOpacity
            key={m}
            style={[styles.modeCard, mode === m && styles.modeCardActive]}
            onPress={() => setMode(m)}
            activeOpacity={0.8}
          >
            <View style={styles.modeHeader}>
              <Text style={styles.modeIcon}>{m === 'AI' ? '🤖' : '🔬'}</Text>
              <View style={styles.modeTitleWrap}>
                <Text style={[styles.modeTitle, mode === m && styles.modeTitleActive]}>
                  {m === 'AI' ? 'Pure AI' : 'Hybrid'}
                </Text>
                {m === 'AI' && (
                  <View style={styles.recommendedBadge}>
                    <Text style={styles.recommendedText}>Recommended</Text>
                  </View>
                )}
              </View>
              <View style={[styles.radio, mode === m && styles.radioActive]}>
                {mode === m && <View style={styles.radioDot} />}
              </View>
            </View>
            <Text style={styles.modeDesc}>
              {m === 'AI'
                ? 'The model handles all weighting. Best for most users — just set your risk appetite and let the AI do the work.'
                : 'You control the variance allowance, standard deviation threshold and confidence floor. For users who want to fine-tune signal sensitivity.'}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Hybrid config — only shown when HYBRID is selected */}
        {mode === 'HYBRID' && (
          <View style={styles.hybridConfig}>
            <Text style={styles.hybridTitle}>Hybrid Configuration</Text>
            <SliderRow
              label="Variance Allowance"
              hint="Signals outside this % band from mean are filtered"
              value={variance} min={1} max={20} step={1}
              onInc={() => setVariance(v => Math.min(v + 1, 20))}
              onDec={() => setVariance(v => Math.max(v - 1, 1))}
              format={v => `${v}%`}
            />
            <SliderRow
              label="Std Deviation Threshold"
              hint="Minimum z-score required for a signal to fire"
              value={stdDev} min={1} max={5} step={0.5}
              onInc={() => setStdDev(v => Math.min(+(v + 0.5).toFixed(1), 5))}
              onDec={() => setStdDev(v => Math.max(+(v - 0.5).toFixed(1), 1))}
              format={v => `${v}σ`}
            />
            <SliderRow
              label="Confidence Score Floor"
              hint="Signals below this confidence are suppressed"
              value={confidence} min={40} max={95} step={5}
              onInc={() => setConfidence(v => Math.min(v + 5, 95))}
              onDec={() => setConfidence(v => Math.max(v - 5, 40))}
              format={v => `${v}%`}
            />
          </View>
        )}

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Go to Dashboard" onPress={handleContinue} fullWidth size="lg" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  title:     { fontSize: Typography.xxl, fontWeight: Typography.black, color: Colors.textPrimary, paddingHorizontal: Spacing.xl, paddingTop: Spacing.xxxl, marginBottom: Spacing.xs },
  subtitle:  { fontSize: Typography.sm, color: Colors.textSecondary, paddingHorizontal: Spacing.xl, marginBottom: Spacing.xl, lineHeight: 20 },
  scroll:    { flex: 1, paddingHorizontal: Spacing.xl },
  modeCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    borderWidth: 1.5, borderColor: Colors.border, padding: Spacing.base, marginBottom: Spacing.md,
  },
  modeCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryDim },
  modeHeader:     { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm, gap: Spacing.sm },
  modeIcon:       { fontSize: 26 },
  modeTitleWrap:  { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  modeTitle:      { fontSize: Typography.md, fontWeight: Typography.bold, color: Colors.textPrimary },
  modeTitleActive:{ color: Colors.primary },
  recommendedBadge:{ backgroundColor: Colors.primaryDim, borderRadius: Radius.full, paddingHorizontal: Spacing.sm, paddingVertical: 2 },
  recommendedText: { fontSize: Typography.xs, color: Colors.primary, fontWeight: Typography.bold },
  radio:     { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  radioActive:{ borderColor: Colors.primary },
  radioDot:  { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.primary },
  modeDesc:  { fontSize: Typography.sm, color: Colors.textSecondary, lineHeight: 20 },
  hybridConfig: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border, padding: Spacing.base, marginBottom: Spacing.md,
  },
  hybridTitle: { fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textPrimary, marginBottom: Spacing.sm },
  footer:    { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxl, paddingTop: Spacing.base },
});
