import { TextStyle } from 'react-native';

export const colors = {
  bg: '#0F172A',
  bgElevated: '#0B1224',
  card: '#111827',
  cardAlt: '#1F2937',
  accent: '#22C55E',
  accentSoft: 'rgba(34, 197, 94, 0.16)',
  secondary: '#38BDF8',
  secondarySoft: 'rgba(56, 189, 248, 0.16)',
  text: '#F8FAFC',
  textMuted: '#94A3B8',
  textDim: '#64748B',
  error: '#EF4444',
  errorSoft: 'rgba(239, 68, 68, 0.16)',
  warning: '#F59E0B',
  border: 'rgba(255, 255, 255, 0.06)',
  borderStrong: 'rgba(255, 255, 255, 0.12)',
  overlay: 'rgba(15, 23, 42, 0.85)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
} as const;

export const radii = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
} as const;

type Variant = 'display' | 'title' | 'subtitle' | 'body' | 'bodyStrong' | 'caption' | 'mono';

export const typography: Record<Variant, TextStyle> = {
  display: {
    fontFamily: 'Inter_700Bold',
    fontSize: 36,
    lineHeight: 42,
    letterSpacing: -0.5,
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 17,
    lineHeight: 22,
  },
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    lineHeight: 22,
  },
  bodyStrong: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    lineHeight: 22,
  },
  caption: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  mono: {
    fontFamily: 'Inter_700Bold',
    fontSize: 48,
    lineHeight: 56,
    letterSpacing: -1,
  },
};

export const theme = { colors, spacing, radii, shadows, typography };
export type Theme = typeof theme;
