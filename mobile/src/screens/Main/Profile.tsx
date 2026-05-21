import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';

// ─── Types ───────────────────────────────────────────────────────────────────
type RiskLevel = 'Conservative' | 'Moderate' | 'Aggressive';
type PlanTier  = 'Free' | 'Pro' | 'Elite';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  plan: PlanTier;
  planExpiry: string;
  riskLevel: RiskLevel;
  exchanges: string[];
  mode: 'AI' | 'Manual' | 'Both';
  joinedAt: string;
  signalsUsed: number;
  signalsLimit: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_USER: UserProfile = {
  name: 'Eshesh Gupta',
  email: 'eshesh@fynd.team',
  phone: '+91 98765 43210',
  avatar: null,
  plan: 'Pro',
  planExpiry: '2026-06-30',
  riskLevel: 'Moderate',
  exchanges: ['NSE', 'BSE', 'NASDAQ', 'DAX'],
  mode: 'Both',
  joinedAt: '2025-01-15',
  signalsUsed: 47,
  signalsLimit: 100,
};

const PLAN_COLOURS: Record<PlanTier, string> = {
  Free:  '#8B949E',
  Pro:   Colors.primary,
  Elite: '#F6AD55',
};

const RISK_COLOURS: Record<RiskLevel, string> = {
  Conservative: Colors.info,
  Moderate:     Colors.warning,
  Aggressive:   Colors.bear,
};

// ─── Sub-Components ───────────────────────────────────────────────────────────
function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

function SettingRow({
  icon,
  label,
  value,
  onPress,
  rightEl,
  danger,
}: {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  rightEl?: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.settingLeft}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <Text style={[styles.settingLabel, danger && { color: Colors.bear }]}>{label}</Text>
      </View>
      <View style={styles.settingRight}>
        {value ? <Text style={styles.settingValue}>{value}</Text> : null}
        {rightEl ?? null}
        {onPress && !rightEl ? (
          <Text style={styles.chevron}>›</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

function PlanBadge({ plan }: { plan: PlanTier }) {
  return (
    <View style={[styles.planBadge, { backgroundColor: PLAN_COLOURS[plan] + '22', borderColor: PLAN_COLOURS[plan] + '66' }]}>
      <Text style={[styles.planBadgeText, { color: PLAN_COLOURS[plan] }]}>
        {plan === 'Elite' ? '⭐ ' : plan === 'Pro' ? '✦ ' : ''}
        {plan.toUpperCase()}
      </Text>
    </View>
  );
}

function AvatarCircle({ name, size = 72 }: { name: string; size?: number }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.36 }]}>{initials}</Text>
    </View>
  );
}

function SignalUsageBar({ used, limit }: { used: number; limit: number }) {
  const pct = Math.min(used / limit, 1);
  const color = pct > 0.8 ? Colors.bear : pct > 0.6 ? Colors.warning : Colors.primary;
  return (
    <View style={styles.usageContainer}>
      <View style={styles.usageHeader}>
        <Text style={styles.usageLabel}>AI Signals Used</Text>
        <Text style={[styles.usageCount, { color }]}>{used} / {limit}</Text>
      </View>
      <View style={styles.usageTrack}>
        <View style={[styles.usageFill, { width: `${pct * 100}%` as any, backgroundColor: color }]} />
      </View>
      <Text style={styles.usageReset}>Resets on 1st of every month</Text>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const [user] = useState<UserProfile>(MOCK_USER);
  const [notifSignals, setNotifSignals]   = useState(true);
  const [notifMarket, setNotifMarket]     = useState(true);
  const [notifNews, setNotifNews]         = useState(false);
  const [notifPortfolio, setNotifPortfolio] = useState(true);
  const [darkMode, setDarkMode]           = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of FinSmart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: () => console.log('logout') },
      ],
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => console.log('delete account') },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Profile</Text>
        </View>

        {/* ── Avatar & Identity ── */}
        <View style={styles.identityCard}>
          <View style={styles.identityTop}>
            <AvatarCircle name={user.name} />
            <View style={styles.identityInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <View style={styles.identityBadges}>
                <PlanBadge plan={user.plan} />
                <View style={[styles.riskBadge, { backgroundColor: RISK_COLOURS[user.riskLevel] + '22' }]}>
                  <Text style={[styles.riskBadgeText, { color: RISK_COLOURS[user.riskLevel] }]}>
                    {user.riskLevel}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Plan expiry */}
          <View style={styles.planExpiry}>
            <Text style={styles.planExpiryLabel}>
              {user.plan} plan active until{' '}
              <Text style={{ color: Colors.primary }}>
                {new Date(user.planExpiry).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </Text>
            </Text>
            <TouchableOpacity style={styles.upgradeBtn} activeOpacity={0.8}>
              <Text style={styles.upgradeBtnText}>Upgrade →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Signal Usage ── */}
        <View style={styles.card}>
          <SignalUsageBar used={user.signalsUsed} limit={user.signalsLimit} />
        </View>

        {/* ── Stats Row ── */}
        <View style={styles.statsRow}>
          {[
            { label: 'Member Since', value: new Date(user.joinedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) },
            { label: 'Exchanges', value: user.exchanges.length.toString() },
            { label: 'Mode', value: user.mode },
          ].map(s => (
            <View key={s.label} style={styles.statCell}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Investment Settings ── */}
        <SectionHeader title="Investment Settings" />
        <View style={styles.card}>
          <SettingRow
            icon="📊"
            label="Risk Appetite"
            value={user.riskLevel}
            onPress={() => Alert.alert('Coming Soon', 'Risk settings editor coming in v1.1')}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="🏦"
            label="Active Exchanges"
            value={user.exchanges.join(', ')}
            onPress={() => Alert.alert('Coming Soon', 'Exchange selector coming in v1.1')}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="🤖"
            label="Recommendation Mode"
            value={user.mode === 'Both' ? 'AI + Manual' : user.mode}
            onPress={() => Alert.alert('Coming Soon', 'Mode selector coming in v1.1')}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="📁"
            label="Import Portfolio"
            onPress={() => Alert.alert('Import', 'Supports Zerodha Kite, Angel One, Groww XLSX exports')}
          />
        </View>

        {/* ── Notifications ── */}
        <SectionHeader title="Notifications" />
        <View style={styles.card}>
          <SettingRow
            icon="📡"
            label="Signal Alerts"
            rightEl={
              <Switch
                value={notifSignals}
                onValueChange={setNotifSignals}
                trackColor={{ false: Colors.border, true: Colors.primary + '66' }}
                thumbColor={notifSignals ? Colors.primary : Colors.textMuted}
              />
            }
          />
          <View style={styles.divider} />
          <SettingRow
            icon="📈"
            label="Market Open / Close"
            rightEl={
              <Switch
                value={notifMarket}
                onValueChange={setNotifMarket}
                trackColor={{ false: Colors.border, true: Colors.primary + '66' }}
                thumbColor={notifMarket ? Colors.primary : Colors.textMuted}
              />
            }
          />
          <View style={styles.divider} />
          <SettingRow
            icon="📰"
            label="Breaking News"
            rightEl={
              <Switch
                value={notifNews}
                onValueChange={setNotifNews}
                trackColor={{ false: Colors.border, true: Colors.primary + '66' }}
                thumbColor={notifNews ? Colors.primary : Colors.textMuted}
              />
            }
          />
          <View style={styles.divider} />
          <SettingRow
            icon="💼"
            label="Portfolio Alerts"
            rightEl={
              <Switch
                value={notifPortfolio}
                onValueChange={setNotifPortfolio}
                trackColor={{ false: Colors.border, true: Colors.primary + '66' }}
                thumbColor={notifPortfolio ? Colors.primary : Colors.textMuted}
              />
            }
          />
        </View>

        {/* ── App Settings ── */}
        <SectionHeader title="App Settings" />
        <View style={styles.card}>
          <SettingRow
            icon="🌙"
            label="Dark Mode"
            rightEl={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: Colors.border, true: Colors.primary + '66' }}
                thumbColor={darkMode ? Colors.primary : Colors.textMuted}
              />
            }
          />
          <View style={styles.divider} />
          <SettingRow
            icon="🔒"
            label="Biometric Lock"
            onPress={() => Alert.alert('Coming Soon', 'Face ID / fingerprint lock coming in v1.1')}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="🌐"
            label="Currency Display"
            value="₹ INR"
            onPress={() => Alert.alert('Coming Soon', 'Multi-currency display coming in v1.1')}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="📦"
            label="App Version"
            value="1.0.0-beta"
          />
        </View>

        {/* ── Support ── */}
        <SectionHeader title="Support" />
        <View style={styles.card}>
          <SettingRow
            icon="❓"
            label="Help & FAQ"
            onPress={() => Alert.alert('Help', 'FAQ portal coming soon')}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="💬"
            label="Contact Support"
            onPress={() => Alert.alert('Support', 'Email us at support@finsmart.app')}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="⭐"
            label="Rate FinSmart"
            onPress={() => Alert.alert('Rate Us', 'Opening App Store / Play Store…')}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="📄"
            label="Privacy Policy"
            onPress={() => Alert.alert('Privacy', 'Opening privacy policy…')}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="📜"
            label="Terms of Service"
            onPress={() => Alert.alert('Terms', 'Opening terms of service…')}
          />
        </View>

        {/* ── Account Actions ── */}
        <SectionHeader title="Account" />
        <View style={styles.card}>
          <SettingRow
            icon="🚪"
            label="Log Out"
            onPress={handleLogout}
            danger
          />
          <View style={styles.divider} />
          <SettingRow
            icon="🗑️"
            label="Delete Account"
            onPress={handleDeleteAccount}
            danger
          />
        </View>

        {/* ── Disclaimer ── */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ⚠️ FinSmart signals are for informational purposes only and do not constitute investment advice.
            Past performance is not indicative of future results. Always consult a SEBI-registered advisor
            before making investment decisions.
          </Text>
        </View>

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: Spacing.base },

  header: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.base,
  },
  screenTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold as any,
    color: Colors.textPrimary,
  },

  // Identity card
  identityCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  identityTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatar: {
    backgroundColor: Colors.primary + '33',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary + '66',
    marginRight: Spacing.md,
  },
  avatarText: {
    color: Colors.primary,
    fontWeight: Typography.bold as any,
  },
  identityInfo: { flex: 1 },
  userName: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold as any,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  identityBadges: { flexDirection: 'row', gap: Spacing.xs },
  planBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  planBadgeText: { fontSize: 10, fontWeight: Typography.bold as any, letterSpacing: 0.5 },
  riskBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: 6,
  },
  riskBadgeText: { fontSize: 10, fontWeight: Typography.semibold as any },

  planExpiry: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  planExpiryLabel: { fontSize: Typography.xs, color: Colors.textSecondary, flex: 1 },
  upgradeBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: 8,
  },
  upgradeBtnText: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold as any,
    color: Colors.textInverse,
  },

  // Card
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },

  // Signal usage
  usageContainer: { padding: Spacing.base },
  usageHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  usageLabel: { fontSize: Typography.sm, color: Colors.textSecondary },
  usageCount: { fontSize: Typography.sm, fontWeight: Typography.bold as any },
  usageTrack: {
    height: 6,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 3,
    marginBottom: Spacing.xs,
    overflow: 'hidden',
  },
  usageFill: { height: '100%', borderRadius: 3 },
  usageReset: { fontSize: Typography.xs, color: Colors.textMuted },

  // Stats
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  statValue: {
    fontSize: Typography.base,
    fontWeight: Typography.bold as any,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  statLabel: { fontSize: Typography.xs, color: Colors.textSecondary },

  // Section header
  sectionHeader: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold as any,
    color: Colors.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
    marginTop: Spacing.xs,
    paddingHorizontal: 2,
  },

  // Setting row
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: 14,
    minHeight: 52,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  settingIcon: { fontSize: 18, marginRight: Spacing.md, width: 24 },
  settingLabel: { fontSize: Typography.base, color: Colors.textPrimary },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  settingValue: { fontSize: Typography.sm, color: Colors.textSecondary, maxWidth: 160, textAlign: 'right' },
  chevron: { fontSize: 22, color: Colors.textMuted, marginLeft: 2 },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: Spacing.base + 24 + Spacing.md },

  // Disclaimer
  disclaimer: {
    backgroundColor: Colors.warning + '12',
    borderWidth: 1,
    borderColor: Colors.warning + '33',
    borderRadius: 10,
    padding: Spacing.md,
    marginTop: Spacing.sm,
  },
  disclaimerText: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    lineHeight: 18,
  },

  // surfaceAlt used in usage bar
  surfaceAlt: { backgroundColor: Colors.surfaceAlt },
});
