/**
 * FinSmart Design System — Dark Theme
 * All colours, typography, spacing and shadow tokens live here.
 * Import from this file everywhere — never hardcode values in components.
 */

export const Colors = {
  // ── Backgrounds ────────────────────────────────────────────────
  bg:          '#0D1117',   // app background
  surface:     '#161B22',   // cards, sheets
  surfaceAlt:  '#21262D',   // secondary cards, tab bars
  border:      '#30363D',   // dividers, input borders

  // ── Brand ──────────────────────────────────────────────────────
  primary:     '#00C853',   // FinSmart green — buy, positive, CTA
  primaryDim:  '#00C85320', // transparent green for backgrounds
  accent:      '#00B4D8',   // secondary accent (info, links)

  // ── Signal colours ─────────────────────────────────────────────
  bull:        '#00C853',   // BUY / positive
  bullBg:      '#00C85318',
  bear:        '#FF4444',   // SELL / negative
  bearBg:      '#FF444418',
  neutral:     '#A0AEC0',   // HOLD / neutral
  neutralBg:   '#A0AEC018',

  // ── Text ───────────────────────────────────────────────────────
  textPrimary:   '#FFFFFF',
  textSecondary: '#8B949E',
  textMuted:     '#4A5568',
  textInverse:   '#0D1117',

  // ── Functional ─────────────────────────────────────────────────
  error:    '#FC8181',
  warning:  '#F6AD55',
  info:     '#63B3ED',
  success:  '#68D391',

  // ── Overlay ────────────────────────────────────────────────────
  overlay:     'rgba(0,0,0,0.6)',
  overlayLight:'rgba(0,0,0,0.3)',
} as const;

export const Typography = {
  // sizes
  xs:   10,
  sm:   12,
  base: 14,
  md:   16,
  lg:   18,
  xl:   22,
  xxl:  28,
  hero: 36,

  // weights
  regular: '400' as const,
  medium:  '500' as const,
  semibold:'600' as const,
  bold:    '700' as const,
  black:   '900' as const,

  // line heights
  tight:   1.2,
  normal:  1.5,
  relaxed: 1.75,
} as const;

export const Spacing = {
  xxs: 2,
  xs:  4,
  sm:  8,
  md:  12,
  base:16,
  lg:  20,
  xl:  24,
  xxl: 32,
  xxxl:48,
} as const;

export const Radius = {
  sm:   6,
  md:   10,
  lg:   14,
  xl:   20,
  full: 999,
} as const;

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  glow: {
    shadowColor: '#00C853',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;
