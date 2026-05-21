import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Input } from '../../components/common';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';

type Props = NativeStackScreenProps<any, 'SignUp'>;

const COUNTRIES = [
  { code: 'IN', label: 'India',   taxLabel: 'PAN Number', flag: '🇮🇳', placeholder: 'ABCDE1234F' },
  { code: 'DE', label: 'Germany', taxLabel: 'Steuer-ID',  flag: '🇩🇪', placeholder: '12 345 678 901' },
  { code: 'US', label: 'USA',     taxLabel: 'SSN / ITIN', flag: '🇺🇸', placeholder: 'XXX-XX-XXXX' },
];

export default function SignUpScreen({ navigation }: Props) {
  const [form, setForm]     = useState({ email:'', password:'', confirmPassword:'', phone:'', taxId:'', country:'IN' });
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [loading, setLoading] = useState(false);

  const selectedCountry = COUNTRIES.find(c => c.code === form.country)!;
  const set = (key: string) => (val: string) => setForm(prev => ({ ...prev, [key]: val }));

  const validate = () => {
    const e: Record<string,string> = {};
    if (!form.email.includes('@'))              e.email           = 'Enter a valid email';
    if (form.password.length < 8)              e.password        = 'Minimum 8 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (form.phone.length < 8)                 e.phone           = 'Enter a valid phone number';
    if (!form.taxId.trim())                    e.taxId           = `${selectedCountry.taxLabel} is required`;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      // TODO: call POST /auth/register
      navigation.navigate('LocationGate');
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={styles.kav} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Set up your FinSmart profile</Text>

        <Text style={styles.fieldLabel}>Country</Text>
        <View style={styles.countryRow}>
          {COUNTRIES.map(c => (
            <TouchableOpacity
              key={c.code}
              style={[styles.countryPill, form.country === c.code && styles.countryActive]}
              onPress={() => set('country')(c.code)}
            >
              <Text style={styles.countryFlag}>{c.flag}</Text>
              <Text style={[styles.countryLabel, form.country === c.code && styles.countryLabelActive]}>
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input label="Email" value={form.email} onChangeText={set('email')}
          keyboardType="email-address" autoCapitalize="none"
          placeholder="you@example.com" error={errors.email} />
        <Input label="Password" value={form.password} onChangeText={set('password')}
          secure placeholder="Minimum 8 characters" error={errors.password}
          hint="Use letters, numbers and symbols" />
        <Input label="Confirm Password" value={form.confirmPassword} onChangeText={set('confirmPassword')}
          secure placeholder="Re-enter your password" error={errors.confirmPassword} />
        <Input label="Phone Number" value={form.phone} onChangeText={set('phone')}
          keyboardType="phone-pad" placeholder="+91 98765 43210" error={errors.phone} />
        <Input label={selectedCountry.taxLabel} value={form.taxId} onChangeText={set('taxId')}
          autoCapitalize="characters" placeholder={selectedCountry.placeholder} error={errors.taxId}
          hint="AES-256 encrypted. Used for identity and future tax features." />

        <Button label="Create Account" onPress={handleSubmit} loading={loading} fullWidth size="lg"
          style={{ marginTop: Spacing.md }} />

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  kav:     { flex: 1, backgroundColor: Colors.bg },
  scroll:  { flex: 1 },
  content: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xxxl, paddingBottom: Spacing.xxxl },
  back:     { marginBottom: Spacing.xl },
  backText: { color: Colors.primary, fontSize: Typography.base, fontWeight: Typography.medium },
  title:    { fontSize: Typography.xxl, fontWeight: Typography.black, color: Colors.textPrimary, marginBottom: Spacing.xs },
  subtitle: { fontSize: Typography.base, color: Colors.textSecondary, marginBottom: Spacing.xl },
  fieldLabel: {
    fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.textSecondary,
    marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.6,
  },
  countryRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.base },
  countryPill: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: Spacing.sm, borderRadius: Radius.md,
    backgroundColor: Colors.surfaceAlt, borderWidth: 1, borderColor: Colors.border, gap: Spacing.xs,
  },
  countryActive:      { borderColor: Colors.primary, backgroundColor: Colors.primaryDim },
  countryFlag:        { fontSize: 18 },
  countryLabel:       { fontSize: Typography.sm, color: Colors.textSecondary, fontWeight: Typography.medium },
  countryLabelActive: { color: Colors.primary },
  loginRow:  { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.lg },
  loginText: { color: Colors.textSecondary, fontSize: Typography.base },
  loginLink: { color: Colors.primary, fontSize: Typography.base, fontWeight: Typography.semibold },
});
