import { StyleSheet, View, ViewStyle } from 'react-native';

import { colors, radii, spacing } from '../../constants/theme';
import { Text } from './Text';

interface Props {
  label: string;
  value: string;
  helper?: string;
  tone?: 'default' | 'accent' | 'secondary' | 'error';
  style?: ViewStyle;
}

const toneToColor: Record<NonNullable<Props['tone']>, string> = {
  default: colors.text,
  accent: colors.accent,
  secondary: colors.secondary,
  error: colors.error,
};

export const StatTile = ({ label, value, helper, tone = 'default', style }: Props) => {
  return (
    <View style={[styles.base, style]}>
      <Text variant="caption" tone="muted" style={styles.label}>
        {label.toUpperCase()}
      </Text>
      <Text variant="title" style={{ color: toneToColor[tone] }}>
        {value}
      </Text>
      {helper ? (
        <Text variant="caption" tone="dim">
          {helper}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  label: {
    letterSpacing: 1.2,
  },
});
