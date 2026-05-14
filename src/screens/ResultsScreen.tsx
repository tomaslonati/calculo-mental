import { StyleSheet, View } from 'react-native';

import { buildResultsSegments, DonutChart } from '../components/charts/DonutChart';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { IconGlyph } from '../components/ui/IconGlyph';
import { Screen } from '../components/ui/Screen';
import { StatTile } from '../components/ui/StatTile';
import { Text } from '../components/ui/Text';
import { colors, spacing } from '../constants/theme';
import { DIFFICULTY } from '../constants/difficulty';
import { MODES_BY_ID } from '../constants/modes';
import { useStatsStore } from '../store/statsStore';
import { formatMs, formatPercent, formatScore } from '../utils/format';
import type { ScreenProps } from '../navigation/types';

export const ResultsScreen = ({ navigation, route }: ScreenProps<'Results'>) => {
  const session = route.params.session;
  const bestForMode = useStatsStore((s) => s.bestByMode[session.mode]);
  const newRecord = session.score >= bestForMode && session.score > 0;

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Text variant="caption" tone="muted" style={styles.eyebrow}>
          PARTIDA TERMINADA
        </Text>
        <Text variant="display" style={{ color: colors.text }}>
          {formatScore(session.score)}
        </Text>
        <Text variant="caption" tone="muted">
          {MODES_BY_ID[session.mode].label} · {DIFFICULTY[session.difficulty].label}
        </Text>
        {newRecord ? (
          <View style={styles.recordPill}>
            <IconGlyph name="trophy" size={14} color={colors.accent} />
            <Text variant="caption" style={{ color: colors.accent }}>
              ¡Nuevo récord en este modo!
            </Text>
          </View>
        ) : null}
      </View>

      <Card style={styles.donutCard}>
        <DonutChart
          segments={buildResultsSegments(session.correct, session.incorrect, session.timeouts)}
          centerLabel={`${session.answers.length}`}
          centerSublabel="operaciones"
        />
      </Card>

      <View style={styles.tilesRow}>
        <StatTile
          label="Precisión"
          value={formatPercent(session.accuracy, 0)}
          tone="accent"
        />
        <StatTile
          label="Tiempo promedio"
          value={formatMs(session.avgTimeMs)}
          tone="secondary"
        />
      </View>
      <View style={styles.tilesRow}>
        <StatTile label="Racha máxima" value={`×${session.maxStreak}`} />
        <StatTile label="Sin responder" value={`${session.timeouts}`} tone={session.timeouts > 0 ? 'error' : 'default'} />
      </View>

      <Card style={styles.summaryCard}>
        <Text variant="caption" tone="muted" style={styles.eyebrow}>
          DETALLE
        </Text>
        <SummaryRow label="Correctas" value={`${session.correct}`} accent />
        <SummaryRow label="Incorrectas" value={`${session.incorrect}`} />
        <SummaryRow label="Sin responder" value={`${session.timeouts}`} />
        <SummaryRow
          label="Iteraciones"
          value={`${session.iterations || session.answers.length}`}
          last
        />
      </Card>

      <View style={styles.actions}>
        <Button
          label="Jugar de nuevo"
          leadingIcon={<IconGlyph name="play" size={18} color="#0B1224" />}
          onPress={() => navigation.replace('Game')}
        />
        <Button
          label="Volver al inicio"
          variant="secondary"
          onPress={() => navigation.popToTop()}
        />
      </View>
    </Screen>
  );
};

interface RowProps {
  label: string;
  value: string;
  accent?: boolean;
  last?: boolean;
}

const SummaryRow = ({ label, value, accent, last }: RowProps) => (
  <View style={[styles.row, !last && styles.rowDivider]}>
    <Text variant="body" tone="muted">
      {label}
    </Text>
    <Text variant="bodyStrong" style={{ color: accent ? colors.accent : colors.text }}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.xs,
  },
  eyebrow: {
    letterSpacing: 1.4,
  },
  recordPill: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    backgroundColor: colors.accentSoft,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.accent,
    alignSelf: 'flex-start',
  },
  donutCard: {
    marginBottom: spacing.lg,
  },
  tilesRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  summaryCard: {
    marginTop: spacing.sm,
    marginBottom: spacing.xxl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actions: {
    gap: spacing.md,
  },
});
