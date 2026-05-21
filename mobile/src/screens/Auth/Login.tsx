import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, ScrollView, Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Input } from '../../components/common';
import { Colors, Typography, Spacing } from '../../constants/theme';

type Props = NativeStackScreenProps<any, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setError('');
    setLoading(true);
    try {
      // TODO: call POST /auth/login → store access_token + refresh_token in MMKV
      navigation.replace('LocationGate');
    } catch {
      setError('Invalid email or password');
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={styles.kav} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your FinSmart account</Text>

        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>⚠ {error}</Text>
          </View>
        ) : null}

        <Input label="Email" value={email} onChangeText={setEmail}
          keyboardType="email-address" autoCapitalize="none" placeholder="you@example.com" />
        <Input label="Password" value={password} onChangeText={setPassword}
          secure placeholder="Your password" />

        <TouchableOpacity style={styles.forgot}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        <Button label="Sign In" onPress={handleLogin} loading={loading} fullWidth size="lg"
          style={{ marginTop: Spacing.md }} />

        {/* Biometric shortcut */}
        <TouchableOpacity style={styles.biometric}>
          <Text style={styles.biometricText}>🔐  Use Face ID / Fingerprint</Text>
        </TouchableOpacity>

        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signupLink}>Create one</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  kav:     { flex: 1, backgroundColor: Colors.bg },
  content: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xxxl, paddingBottom: Spacing.xxxl, flexGrow: 1 },
  back:     { marginBottom: Spacing.xl },
  backText: { color: Colors.primary, fontSize: Typography.base, fontWeight: Typography.medium },
  title:    { fontSize: Typography.xxl, fontWeight: Typography.black, color: Colors.textPrimary, marginBottom: Spacing.xs },
  subtitle: { fontSize: Typography.base, color: Colors.textSecondary, marginBottom: Spacing.xl },
  errorBanner: {
    backgroundColor: Colors.bearBg, borderRadius: 8, padding: Spacing.md,
    marginBottom: Spacing.base, borderWidth: 1, borderColor: Colors.bear,
  },
  errorText: { color: Colors.bear, fontSize: Typography.sm },
  forgot: { alignSelf: 'flex-end', marginTop: -Spacing.sm, marginBottom: Spacing.base },
  forgotText: { color: Colors.primary, fontSize: Typography.sm },
  biometric: {
    marginTop: Spacing.base, padding: Spacing.md,
    alignItems: 'center', borderRadius: 10,
    backgroundColor: Colors.surfaceAlt, borderWidth: 1, borderColor: Colors.border,
  },
  biometricText: { color: Colors.textSecondary, fontSize: Typography.base },
  signupRow:  { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.xl },
  signupText: { color: Colors.textSecondary, fontSize: Typography.base },
  signupLink: { color: Colors.primary, fontSize: Typography.base, fontWeight: Typography.semibold },
});
