import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';

export default function LocationGateScreen() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);

  const requestLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        navigation.navigate('ExchangeSelection');
      } else {
        Alert.alert(
          'Location Required',
          'FinSmart uses your location to show relevant exchange timings and localised market data.',
          [
            { text: 'Open Settings', onPress: () => Location.requestForegroundPermissionsAsync() },
            { text: 'Skip for Now', onPress: () => navigation.navigate('ExchangeSelection') },
          ],
        );
      }
    } catch {
      navigation.navigate('ExchangeSelection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.container}>
        <Text style={s.icon}>📍</Text>
        <Text style={s.title}>Allow Location Access</Text>
        <Text style={s.subtitle}>
          FinSmart uses your location to show you relevant exchange market hours,
          localised financial news, and geo-specific market signals.
        </Text>

        <View style={s.bullets}>
          {[
            '🕐  Accurate market open / close timings for your timezone',
            '📰  Regional financial news and regulatory updates',
            '🗺️  Geo-political event alerts relevant to your region',
          ].map(b => (
            <Text key={b} style={s.bullet}>{b}</Text>
          ))}
        </View>

        <TouchableOpacity style={s.btn} onPress={requestLocation} activeOpacity={0.85}>
          {loading
            ? <ActivityIndicator color={Colors.textInverse} />
            : <Text style={s.btnText}>Allow Location</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ExchangeSelection')} style={s.skip}>
          <Text style={s.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xl },
  icon:      { fontSize: 64, marginBottom: Spacing.xl },
  title:     { fontSize: Typography.xxl, fontWeight: Typography.bold as any, color: Colors.textPrimary, textAlign: 'center', marginBottom: Spacing.md },
  subtitle:  { fontSize: Typography.base, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24, marginBottom: Spacing.xl },
  bullets:   { alignSelf: 'stretch', gap: Spacing.md, marginBottom: Spacing.xxl },
  bullet:    { fontSize: Typography.base, color: Colors.textSecondary, lineHeight: 22 },
  btn:       { backgroundColor: Colors.primary, borderRadius: Radius.lg, paddingVertical: 16, paddingHorizontal: Spacing.xxl, width: '100%', alignItems: 'center', marginBottom: Spacing.md },
  btnText:   { fontSize: Typography.md, fontWeight: Typography.bold as any, color: Colors.textInverse },
  skip:      { paddingVertical: Spacing.sm },
  skipText:  { fontSize: Typography.base, color: Colors.textSecondary },
});
