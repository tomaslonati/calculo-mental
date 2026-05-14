import { StyleSheet, View } from 'react-native';

import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { IconBadge } from '../components/ui/IconBadge';
import { IconGlyph } from '../components/ui/IconGlyph';
import { Screen } from '../components/ui/Screen';
import { Text } from '../components/ui/Text';
import { colors, spacing } from '../constants/theme';
import { DIFFICULTY } from '../constants/difficulty';
import { MODES_BY_ID } from '../constants/modes';
import { useSettingsStore } from '../store/settingsStore';
import { selectGlobalBest, useStatsStore } from '../store/statsStore';
import { formatScore } from '../utils/format';
import type { ScreenProps } from '../navigation/types';

export const HomeScreen = ({ navigation }: ScreenProps<'Home'>) => {
  const difficulty = useSettingsStore((s) => s.difficulty);
  const mode = useSettingsStore((s) => s.mode);
  const iterations = useSettingsStore((s) => s.iterations);
  const bestScore = useStatsStore(selectGlobalBest);
  const totalPlayed = useStatsStore((s) => s.totals.played);

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Text variant="caption" tone="muted" style={styles.eyebrow}>
          HOLA DE NUEVO
        </Text>
        <Text variant="display" style={{ color: colors.text }}>
          Cálculo Mental
        </Text>
        <Text variant="body" tone="muted" style={{ marginTop: spacing.xs }}>
          Entrená en sesiones cortas. Elegí dificultad y modo.
        </Text>
      </View>

      <Card style={styles.heroCard}>
        <View style={styles.heroRow}>
          <IconBadge tone="accent" size={48}>
            <IconGlyph name="trophy" color={colors.accent} />
          </IconBadge>
          <View style={{ flex: 1 }}>
            <Text variant="caption" tone="muted" style={styles.eyebrow}>
              MEJOR PUNTAJE
            </Text>
            <Text variant="display" style={{ color: colors.text, fontSize: 28, lineHeight: 32 }}>
              {formatScore(bestScore)}
            </Text>
            <Text variant="caption" tone="dim">
              {totalPlayed === 0
                ? 'Todavía no jugaste — buena suerte en la primera.'
                : `${totalPlayed} ${totalPlayed === 1 ? 'partida jugada' : 'partidas jugadas'}`}
            </Text>
          </View>
        </View>
      </Card>

      <Card style={styles.configCard} onPress={() => navigation.navigate('Config')}>
        <View style={styles.rowBetween}>
          <View style={{ flex: 1 }}>
            <Text variant="caption" tone="muted" style={styles.eyebrow}>
              CONFIGURACIÓN ACTUAL
            </Text>
            <Text variant="title">
              {DIFFICULTY[difficulty].label} · {MODES_BY_ID[mode].label}
            </Text>
            <Text variant="caption" tone="muted">
              {iterations} iteraciones · {DIFFICULTY[difficulty].allowedMs / 1000}s por operación
            </Text>
          </View>
          <IconGlyph name="chevron-right" color={colors.textMuted} />
        </View>
      </Card>

      <View style={styles.actions}>
        <Button
          label="Jugar"
          onPress={() => navigation.navigate('ModeSelect')}
          leadingIcon={<IconGlyph name="play" size={18} color="#0B1224" />}
        />
        <View style={styles.secondaryRow}>
          <Button
            label="Historial"
            variant="secondary"
            onPress={() => navigation.navigate('History')}
            leadingIcon={<IconGlyph name="history" size={18} color={colors.text} />}
            style={{ flex: 1 }}
          />
          <Button
            label="Ajustes"
            variant="secondary"
            onPress={() => navigation.navigate('Config')}
            leadingIcon={<IconGlyph name="settings" size={18} color={colors.text} />}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  eyebrow: {
    letterSpacing: 1.4,
  },
  heroCard: {
    marginBottom: spacing.lg,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  configCard: {
    marginBottom: spacing.xxl,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  actions: {
    gap: spacing.md,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
