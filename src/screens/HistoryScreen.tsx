import { useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';

import { BarChart } from '../components/charts/BarChart';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Chip } from '../components/ui/Chip';
import { IconGlyph } from '../components/ui/IconGlyph';
import { Screen } from '../components/ui/Screen';
import { StatTile } from '../components/ui/StatTile';
import { Text } from '../components/ui/Text';
import { colors, spacing } from '../constants/theme';
import { MODES, MODES_BY_ID } from '../constants/modes';
import { DIFFICULTY } from '../constants/difficulty';
import { useStatsStore } from '../store/statsStore';
import { formatDate, formatMs, formatPercent, formatScore } from '../utils/format';
import type { ScreenProps } from '../navigation/types';
import type { GameSession } from '../types/game';

type Tab = 'resumen' | 'mejores' | 'partidas';

export const HistoryScreen = ({ navigation }: ScreenProps<'History'>) => {
  const sessions = useStatsStore((s) => s.sessions);
  const totals = useStatsStore((s) => s.totals);
  const bestByMode = useStatsStore((s) => s.bestByMode);
  const clear = useStatsStore((s) => s.clear);
  const [tab, setTab] = useState<Tab>('resumen');

  const accuracyBars = useMemo(() => {
    return sessions
      .slice(0, 10)
      .reverse()
      .map((s, idx) => ({
        value: s.accuracy * 100,
        label: `${idx + 1}`,
        color: s.accuracy >= 0.7 ? colors.accent : s.accuracy >= 0.4 ? colors.secondary : colors.error,
      }));
  }, [sessions]);

  const confirmClear = () => {
    Alert.alert(
      'Borrar historial',
      'Vas a perder partidas, récords y estadísticas. ¿Seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Borrar', style: 'destructive', onPress: clear },
      ],
    );
  };

  return (
    <Screen padded={false}>
      <View style={styles.header}>
        <Button
          label="Volver"
          variant="ghost"
          size="md"
          fullWidth={false}
          onPress={() => navigation.goBack()}
          leadingIcon={<IconGlyph name="arrow-back" size={18} color={colors.textMuted} />}
          style={styles.back}
        />
        <Text variant="display" style={{ color: colors.text }}>
          Historial
        </Text>
        <Text variant="body" tone="muted">
          Tus últimas {sessions.length} partidas y estadísticas acumuladas.
        </Text>
        <View style={styles.tabs}>
          <Chip label="Resumen" active={tab === 'resumen'} onPress={() => setTab('resumen')} />
          <Chip label="Mejores" active={tab === 'mejores'} onPress={() => setTab('mejores')} />
          <Chip label="Partidas" active={tab === 'partidas'} onPress={() => setTab('partidas')} />
        </View>
      </View>

      {tab === 'resumen' ? (
        <FlatList
          data={[0]}
          keyExtractor={() => 'summary'}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.body}
          renderItem={() => (
            <View style={{ gap: spacing.lg }}>
              {sessions.length === 0 ? (
                <EmptyCard message="Todavía no tenés partidas registradas. Jugá una ronda para llenar este resumen." />
              ) : (
                <>
                  <View style={styles.tilesRow}>
                    <StatTile label="Partidas" value={`${totals.played}`} />
                    <StatTile
                      label="Precisión prom."
                      value={formatPercent(totals.avgAccuracy, 0)}
                      tone="accent"
                    />
                  </View>
                  <View style={styles.tilesRow}>
                    <StatTile
                      label="Tiempo prom."
                      value={formatMs(totals.avgTimeMs)}
                      tone="secondary"
                    />
                    <StatTile label="Puntaje total" value={formatScore(totals.totalScore)} />
                  </View>
                  <Card>
                    <Text variant="caption" tone="muted" style={styles.eyebrow}>
                      PRECISIÓN — ÚLTIMAS {accuracyBars.length} PARTIDAS
                    </Text>
                    <BarChart data={accuracyBars} maxValue={100} yLabel="Porcentaje de aciertos" />
                  </Card>
                  <Button
                    label="Borrar historial"
                    variant="danger"
                    onPress={confirmClear}
                    leadingIcon={<IconGlyph name="trash" size={18} color={colors.error} />}
                  />
                </>
              )}
            </View>
          )}
        />
      ) : null}

      {tab === 'mejores' ? (
        <FlatList
          data={MODES}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
          renderItem={({ item }) => (
            <Card>
              <View style={styles.rowBetween}>
                <View style={{ flex: 1 }}>
                  <Text variant="caption" tone="muted" style={styles.eyebrow}>
                    {item.label.toUpperCase()}
                  </Text>
                  <Text variant="title">
                    {bestByMode[item.id] > 0 ? formatScore(bestByMode[item.id]) : 'Sin récord'}
                  </Text>
                  <Text variant="caption" tone="dim">
                    {item.description}
                  </Text>
                </View>
                <IconGlyph
                  name="trophy"
                  size={26}
                  color={bestByMode[item.id] > 0 ? colors.accent : colors.textDim}
                />
              </View>
            </Card>
          )}
        />
      ) : null}

      {tab === 'partidas' ? (
        <FlatList
          data={sessions}
          keyExtractor={(s) => s.id}
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
          ListEmptyComponent={
            <EmptyCard message="No registramos partidas aún." />
          }
          renderItem={({ item }) => <SessionRow session={item} />}
        />
      ) : null}
    </Screen>
  );
};

const EmptyCard = ({ message }: { message: string }) => (
  <Card style={{ alignItems: 'center', paddingVertical: spacing.xxxl }}>
    <View style={styles.emptyIcon}>
      <IconGlyph name="sparkles" size={28} color={colors.textMuted} />
    </View>
    <Text variant="body" tone="muted" align="center">
      {message}
    </Text>
  </Card>
);

const SessionRow = ({ session }: { session: GameSession }) => {
  return (
    <Card>
      <View style={styles.rowBetween}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="caption" tone="dim">
            {formatDate(session.finishedAt)}
          </Text>
          <Text variant="title">{formatScore(session.score)}</Text>
          <Text variant="caption" tone="muted">
            {MODES_BY_ID[session.mode].label} · {DIFFICULTY[session.difficulty].label}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 2 }}>
          <Text variant="bodyStrong" style={{ color: colors.accent }}>
            {formatPercent(session.accuracy, 0)}
          </Text>
          <Text variant="caption" tone="dim">
            {session.correct} ok · {session.incorrect} err · {session.timeouts} —
          </Text>
          <Text variant="caption" tone="muted">
            {formatMs(session.avgTimeMs)} prom.
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  back: {
    alignSelf: 'flex-start',
    marginLeft: -spacing.md,
    marginBottom: spacing.sm,
  },
  body: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.huge,
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  tilesRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  eyebrow: {
    letterSpacing: 1.4,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
});
