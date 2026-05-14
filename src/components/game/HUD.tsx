import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '../../constants/theme';
import { formatScore } from '../../utils/format';
import { ProgressBar } from '../ui/ProgressBar';
import { Text } from '../ui/Text';
import { StreakBadge } from './StreakBadge';

interface Props {
  score: number;
  index: number;
  total: number; // 0 si modo contra reloj
  streak: number;
  countdownLabel?: string | null; // sólo en contra reloj
  countdownProgress?: number | null; // 0..1
}

export const HUD = ({ score, index, total, streak, countdownLabel, countdownProgress }: Props) => {
  const isCountdown = countdownLabel != null;
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <View style={styles.scoreBlock}>
          <Text variant="caption" tone="muted" style={styles.label}>
            PUNTAJE
          </Text>
          <Text variant="title" style={{ color: colors.text }}>
            {formatScore(score)}
          </Text>
        </View>
        <View style={styles.progressBlock}>
          <View style={styles.headerRow}>
            <Text variant="caption" tone="muted" style={styles.label}>
              {isCountdown ? 'TIEMPO RESTANTE' : 'PROGRESO'}
            </Text>
            <Text variant="bodyStrong" tone="muted">
              {isCountdown ? countdownLabel : `${index}/${total}`}
            </Text>
          </View>
          <ProgressBar
            value={
              isCountdown
                ? (countdownProgress ?? 0)
                : total > 0
                  ? index / total
                  : 0
            }
            color={colors.secondary}
          />
        </View>
        <StreakBadge streak={streak} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  scoreBlock: {
    gap: 2,
  },
  progressBlock: {
    flex: 1,
    gap: spacing.xs + 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    letterSpacing: 1.4,
  },
});
