import { StyleSheet, View } from 'react-native';

import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { IconBadge } from '../components/ui/IconBadge';
import { IconGlyph } from '../components/ui/IconGlyph';
import { Screen } from '../components/ui/Screen';
import { Text } from '../components/ui/Text';
import { colors, spacing } from '../constants/theme';
import { MODES } from '../constants/modes';
import { useSettingsStore } from '../store/settingsStore';
import { useStatsStore } from '../store/statsStore';
import { formatScore } from '../utils/format';
import type { ScreenProps } from '../navigation/types';
import type { GameMode } from '../types/game';

const ICONS: Record<GameMode, 'sparkles' | 'check' | 'target' | 'clock'> = {
  clasico: 'sparkles',
  verdadero_falso: 'check',
  multiple_choice: 'target',
  contra_reloj: 'clock',
};

const TONES: Record<GameMode, 'accent' | 'secondary' | 'neutral' | 'error'> = {
  clasico: 'accent',
  verdadero_falso: 'secondary',
  multiple_choice: 'accent',
  contra_reloj: 'secondary',
};

export const ModeSelectScreen = ({ navigation }: ScreenProps<'ModeSelect'>) => {
  const mode = useSettingsStore((s) => s.mode);
  const setMode = useSettingsStore((s) => s.setMode);
  const bestByMode = useStatsStore((s) => s.bestByMode);

  return (
    <Screen scroll>
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
          Elegí un modo
        </Text>
        <Text variant="body" tone="muted">
          Cada modo evalúa la misma operación de una forma distinta.
        </Text>
      </View>

      <View style={styles.list}>
        {MODES.map((m) => {
          const isActive = m.id === mode;
          return (
            <Card key={m.id} onPress={() => setMode(m.id)} style={isActive ? styles.activeCard : undefined}>
              <View style={styles.row}>
                <IconBadge tone={TONES[m.id]}>
                  <IconGlyph
                    name={ICONS[m.id]}
                    color={TONES[m.id] === 'secondary' ? colors.secondary : colors.accent}
                  />
                </IconBadge>
                <View style={{ flex: 1 }}>
                  <View style={styles.titleRow}>
                    <Text variant="title">{m.label}</Text>
                    {isActive ? (
                      <View style={styles.activePill}>
                        <Text variant="caption" style={{ color: colors.accent }}>
                          SELECCIONADO
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  <Text variant="body" tone="muted">
                    {m.description}
                  </Text>
                  <View style={styles.footerRow}>
                    <Text variant="caption" tone="dim">
                      {m.hint}
                    </Text>
                    <Text variant="caption" tone="muted">
                      Récord: {formatScore(bestByMode[m.id])}
                    </Text>
                  </View>
                </View>
              </View>
            </Card>
          );
        })}
      </View>

      <View style={styles.cta}>
        <Button
          label="Comenzar"
          onPress={() => navigation.navigate('Game')}
          leadingIcon={<IconGlyph name="play" size={18} color="#0B1224" />}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingBottom: spacing.xxl,
    gap: spacing.xs,
  },
  back: {
    alignSelf: 'flex-start',
    marginLeft: -spacing.md,
    marginBottom: spacing.sm,
  },
  list: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  activePill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  activeCard: {
    borderColor: colors.accent,
  },
  cta: {
    marginTop: spacing.xxl,
  },
});
