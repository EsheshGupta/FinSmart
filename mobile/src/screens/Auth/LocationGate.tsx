import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Geolocation from 'react-native-geolocation-service';
import { Button } from '../../components/common';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';

type Props = NativeStackScreenProps<any, 'LocationGate'>;

export default function LocationGateScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(false);
  const [denied, setDenied]   = useState(false);

  const requestLocation = () => {
    setLoading(true);
    setDenied(false);

    Geolocation.requestAuthorization('whenInUse');
    Geolocation.getCurrentPosition(
      (pos) => {
        // Store lat/lng in MMKV — sent as header on every API call
        console.log('Location granted:', pos.coords.latitude, pos.coords.longitude);
        setLoading(false);
        navigation.navigate('ExchangeSelection');
      },
      (err) => {
        console.warn('Location denied:', err);
        setLoading(false);
        setDenied(true);
      },
      { enableHighAccuracy: false, timeout: 15000 },
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>📍</Text>
      </View>

      <Text style={styles.title}>Location Required</Text>
      <Text style={styles.body}>
        FinSmart uses your location to confirm your timezone and ensure you see
        signals relevant to your market hours.
        {'\n\n'}
        Your location is never stored beyond your session and is only used to
        set your market timezone.
      </Text>

      {denied ? (
        <View style={styles.deniedBox}>
          <Text style={styles.deniedTitle}>Location Access Denied</Text>
          <Text style={styles.deniedBody}>
            FinSmart cannot function without location permission. Please enable
            location access in your device Settings, then try again.
          </Text>
        </View>
      ) : null}

      <Button
        label={denied ? 'Try Again' : 'Allow Location Access'}
        onPress={requestLocation}
        loading={loading}
        fullWidth
        size="lg"
        style={{ marginTop: Spacing.xxl }}
      />

      {denied ? (
        <Button
          label="Open Settings"
          onPress={() => {
            // TODO: Linking.openSettings()
          }}
          variant="ghost"
          fullWidth
          size="lg"
          style={{ marginTop: Spacing.md }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: Colors.bg,
    paddingHorizontal: Spacing.xl, justifyContent: 'center',
  },
  iconWrap: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: Colors.primaryDim, alignItems: 'center',
    justifyContent: 'center', alignSelf: 'center', marginBottom: Spacing.xxl,
  },
  icon:  { fontSize: 44 },
  title: {
    fontSize: Typography.xxl, fontWeight: Typography.black,
    color: Colors.textPrimary, textAlign: 'center', marginBottom: Spacing.base,
  },
  body: {
    fontSize: Typography.base, color: Colors.textSecondary,
    textAlign: 'center', lineHeight: 22,
  },
  deniedBox: {
    marginTop: Spacing.xl, backgroundColor: Colors.bearBg,
    borderRadius: Radius.md, padding: Spacing.base,
    borderWidth: 1, borderColor: Colors.bear,
  },
  deniedTitle: { color: Colors.bear, fontWeight: Typography.bold, marginBottom: Spacing.xs },
  deniedBody:  { color: Colors.textSecondary, fontSize: Typography.sm, lineHeight: 20 },
});
