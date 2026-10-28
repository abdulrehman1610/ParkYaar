import { Platform } from 'react-native';

export const ParkColors = {
  primary: '#0B2545',          // Deep Navy
  primaryLight: '#314769',
  secondary: '#1F6FEB',        // Parking Blue CTA & Highlights
  secondaryContainer: '#1F6FEB',
  secondaryLight: '#E8F1FD',
  amber: '#F5A623',            // Public Lot & Rating Amber
  amberLight: '#FFF6E8',
  amberDim: '#FFDDB4',
  background: '#F4F6F8',       // Light Slate Canvas
  backgroundLight: '#F8F9FF',
  surface: '#FFFFFF',          // Card & Container White
  surfaceLow: '#EFF4FF',
  surfaceContainer: '#E5EEFF',
  surfaceHigh: '#DCE9FF',
  surfaceHighest: '#D3E4FE',
  text: '#0B1C30',             // Deep Charcoal Heading
  textMuted: '#64748B',        // Cool Grey Subtext
  textVariant: '#44474E',
  border: '#E2E8F0',           // Subtle Divider
  borderLight: '#F1F5F9',
  success: '#16A34A',          // Green verified & booked
  successLight: '#DCFCE7',
  error: '#DC2626',            // Red alert & expired
  errorLight: '#FEE2E2',
  overlay: 'rgba(11, 37, 69, 0.45)',
  shadowColor: '#0B2545',
} as const;

export const ParkRadii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,     // Standard Card
  xl: 20,
  sheet: 24,  // Bottom Sheet Top Radius
  full: 9999, // 52px Pill Buttons
} as const;

export const ParkSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

export const ParkShadows = {
  sm: {
    shadowColor: ParkColors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: ParkColors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  lg: {
    shadowColor: ParkColors.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  sheet: {
    shadowColor: ParkColors.shadowColor,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
  },
};

// Compatible with Expo starter defaults
export const Colors = {
  light: {
    text: ParkColors.text,
    background: ParkColors.background,
    backgroundElement: ParkColors.surfaceLow,
    backgroundSelected: ParkColors.surfaceHigh,
    textSecondary: ParkColors.textMuted,
  },
  dark: {
    text: '#FFFFFF',
    background: '#071322',
    backgroundElement: '#0E2139',
    backgroundSelected: '#183459',
    textSecondary: '#94A3B8',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 430; // Mobile width frame
