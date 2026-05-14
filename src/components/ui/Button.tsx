import { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, ViewStyle } from 'react-native';

import { colors, radii, spacing, typography } from '../../constants/theme';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'md' | 'lg';

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  style?: ViewStyle;
}

export const Button = ({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  disabled = false,
  loading = false,
  fullWidth = true,
  leadingIcon,
  style,
}: Props) => {
  const isDisabled = disabled || loading;
  const palette = palettes[variant];
  const sizing = size === 'lg' ? styles.lg : styles.md;

  return (
    <Pressable
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        sizing,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
          opacity: isDisabled ? 0.5 : 1,
        },
        fullWidth ? styles.fullWidth : null,
        pressed && !isDisabled ? styles.pressed : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.text} />
      ) : (
        <View style={styles.content}>
          {leadingIcon}
          <Text style={[typography.bodyStrong, { color: palette.text }]}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
};

const palettes: Record<Variant, { bg: string; text: string; border: string }> = {
  primary: { bg: colors.accent, text: '#0B1224', border: colors.accent },
  secondary: {
    bg: colors.card,
    text: colors.text,
    border: colors.borderStrong,
  },
  ghost: { bg: 'transparent', text: colors.textMuted, border: 'transparent' },
  danger: { bg: colors.errorSoft, text: colors.error, border: 'rgba(239,68,68,0.4)' },
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  lg: {
    minHeight: 56,
    paddingHorizontal: spacing.xxl,
  },
  md: {
    minHeight: 44,
    paddingHorizontal: spacing.lg,
  },
  fullWidth: { alignSelf: 'stretch' },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
});
