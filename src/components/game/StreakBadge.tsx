import { StyleSheet, View } from 'react-native';

import { colors, radii, spacing } from '../../constants/theme';
import { IconGlyph } from '../ui/IconGlyph';
import { Text } from '../ui/Text';

interface Props {
  streak: number;
}

export const StreakBadge = ({ streak }: Props) => {
  if (streak < 2) {
    return (
      <View style={[styles.base, styles.idle]}>
        <Text variant="caption" tone="dim">
          Racha
        </Text>
        <Text variant="bodyStrong" tone="muted">
          —
        </Text>
      </View>
    );
  }
  return (
    <View style={[styles.base, styles.active]}>
      <IconGlyph name="flash" size={16} color={colors.accent} />
      <Text variant="bodyStrong" style={{ color: colors.accent }}>
        ×{streak}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  idle: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
    gap: spacing.sm,
  },
  active: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
});
