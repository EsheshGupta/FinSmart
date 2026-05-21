import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../../components/common';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';

type Props = NativeStackScreenProps<any, 'Welcome'>;

const FEATURES = [
  { icon: '📈', text: 'AI signals across 3 global markets' },
  { icon: '🎯', text: 'Target price + stop-loss on every call' },
  { icon: '📂', text: 'Analyse your existing portfolio instantly' },
];

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroIcon}>📊</Text>
        <Text style={styles.headline}>
          Invest with{'\n'}
          <Text style={styles.highlight}>Intelligence.</Text>
        </Text>
        <Text style={styles.sub}>
          Real-time AI signals for stocks, mutual funds,{'\n'}
          derivatives and commodities — India, Germany, USA.
        </Text>
      </View>

      {/* Feature pills */}
      <View style={styles.features}>
        {FEATURES.map((f, i) => (
          <View key={i} style={styles.featurePill}>
            <Text style={styles.featureIcon}>{f.icon}</Text>
            <Text style={styles.featureText}>{f.text}</Text>
          </View>
        ))}
      </View>

      {/* CTAs */}
      <View style={styles.actions}>
        <Button
          label="Create Account"
          onPress={() => navigation.navigate('SignUp')}
          fullWidth
          size="lg"
        />
        <Button
          label="Sign In"
          onPress={() => navigation.navigate('Login')}
          variant="ghost"
          fullWidth
          size="lg"
          style={{ marginTop: Spacing.md }}
        />
      </View>

      <Text style={styles.disclaimer}>
        For informational purposes only. Not investment advice.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxxl + 16,
    paddingBottom: Spacing.xxl,
  },
  hero: { flex: 1, justifyContent: 'center' },
  heroIcon: { fontSize: 56, marginBottom: Spacing.base },
  headline: {
    fontSize: Typography.xxl + 4,
    fontWeight: Typography.black,
    color: Colors.textPrimary,
    lineHeight: 42,
    marginBottom: Spacing.base,
  },
  highlight: { color: Colors.primary },
  sub: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    lineHeight: 22,
  },

  features: { marginBottom: Spacing.xxl },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureIcon: { fontSize: 18, marginRight: Spacing.sm },
  featureText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },

  actions: {},
  disclaimer: {
    textAlign: 'center',
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginTop: Spacing.base,
  },
});
