import React, { useState } from 'react';
import {
  View, TextInput, Text, TouchableOpacity,
  StyleSheet, TextInputProps, ViewStyle,
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  secure?: boolean;
}

export function Input({
  label, error, hint, rightIcon, containerStyle,
  secure, style, ...rest
}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputRow, focused && styles.focused, error ? styles.errored : null]}>
        <TextInput
          {...rest}
          secureTextEntry={secure && !showPassword}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholderTextColor={Colors.textMuted}
          style={[styles.input, style]}
        />
        {secure ? (
          <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.iconBtn}>
            <Text style={styles.iconText}>{showPassword ? '🙈' : '👁'}</Text>
          </TouchableOpacity>
        ) : rightIcon ? (
          <View style={styles.iconBtn}>{rightIcon}</View>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {hint && !error ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: Spacing.base },
  label: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.base,
  },
  focused:  { borderColor: Colors.primary },
  errored:  { borderColor: Colors.bear },
  input: {
    flex: 1,
    height: 52,
    fontSize: Typography.base,
    color: Colors.textPrimary,
  },
  iconBtn:  { paddingLeft: Spacing.sm },
  iconText: { fontSize: 16 },
  error: {
    fontSize: Typography.sm,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  hint: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
});
