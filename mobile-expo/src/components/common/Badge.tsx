import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';

type Variant = 'bull' | 'bear' | 'neutral' | 'info' | 'default';

interface Props {
  label: string;
  variant?: Variant;
  style?: ViewStyle;
  small?: boolean;
}

const variantMap: Record<Variant, { bg: string; text: string }> = {
  bull:    { bg: Colors.bullBg,    text: Colors.bull },
  bear:    { bg: Colors.bearBg,    text: Colors.bear },
  neutral: { bg: Colors.neutralBg, text: Colors.neutral },
  info:    { bg: '#63B3ED20',      text: Colors.info },
  default: { bg: Colors.surfaceAlt, text: Colors.textSecondary },
};

export function Badge({ label, variant = 'default', style, small }: Props) {
  const { bg, text } = variantMap[variant];
  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Text style={[styles.label, { color: text }, small && styles.small]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs + 1,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  small: { fontSize: Typography.xs },
});
