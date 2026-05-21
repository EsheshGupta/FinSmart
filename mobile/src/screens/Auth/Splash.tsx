import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing } from '../../constants/theme';

type Props = NativeStackScreenProps<any, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  const opacity  = new Animated.Value(0);
  const scale    = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(scale,   { toValue: 1, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      // TODO: check stored JWT — if valid go to Main, else Welcome
      navigation.replace('Welcome');
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoWrap, { opacity, transform: [{ scale }] }]}>
        <Text style={styles.logo}>FinSmart</Text>
        <Text style={styles.tagline}>Invest with Intelligence</Text>
      </Animated.View>
      <Text style={styles.version}>v1.0.0  ·  Phase 1</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrap: { alignItems: 'center' },
  logo: {
    fontSize: Typography.hero,
    fontWeight: Typography.black,
    color: Colors.primary,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  version: {
    position: 'absolute',
    bottom: Spacing.xxxl,
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
});
