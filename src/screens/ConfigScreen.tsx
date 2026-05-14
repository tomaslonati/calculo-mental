import { StyleSheet, View } from 'react-native';

import { Card } from '../components/ui/Card';
import { Chip } from '../components/ui/Chip';
import { IconGlyph } from '../components/ui/IconGlyph';
import { Screen } from '../components/ui/Screen';
import { Text } from '../components/ui/Text';
import { Toggle } from '../components/ui/Toggle';
import { Button } from '../components/ui/Button';
import { colors, spacing } from '../constants/theme';
import {
  DIFFICULTIES,
  DIFFICULTY,
  ITERATION_OPTIONS,
} from '../constants/difficulty';
import { useSettingsStore } from '../store/settingsStore';
import type { ScreenProps } from '../navigation/types';

export const ConfigScreen = ({ navigation }: ScreenProps<'Config'>) => {
  const difficulty = useSettingsStore((s) => s.difficulty);
  const iterations = useSettingsStore((s) => s.iterations);
  const sound = useSettingsStore((s) => s.sound);
  const haptics = useSettingsStore((s) => s.haptics);
  const dynamic = useSettingsStore((s) => s.dynamic);
  const setDifficulty = useSettingsStore((s) => s.setDifficulty);
  const setIterations = useSettingsStore((s) => s.setIterations);
  const setSound = useSettingsStore((s) => s.setSound);
  const setHaptics = useSettingsStore((s) => s.setHaptics);
  const setDynamic = useSettingsStore((s) => s.setDynamic);

  return (
    <Screen scroll>
      <View style={styles.header}>
        <View style={styles.backRow}>
          <Button
            label="Volver"
            variant="ghost"
            size="md"
            onPress={() => navigation.goBack()}
            leadingIcon={<IconGlyph name="arrow-back" size={18} color={colors.textMuted} />}
            fullWidth={false}
          />
        </View>
        <Text variant="display" style={{ color: colors.text }}>
          Configuración
        </Text>
        <Text variant="body" tone="muted">
          Estos ajustes se guardan en tu dispositivo.
        </Text>
      </View>

      <Card style={styles.section}>
        <Text variant="caption" tone="muted" style={styles.eyebrow}>
          DIFICULTAD
        </Text>
        <View style={styles.chipRow}>
          {DIFFICULTIES.map((d) => (
            <Chip
              key={d}
              label={DIFFICULTY[d].shortLabel}
              active={d === difficulty}
              onPress={() => setDifficulty(d)}
              tone="accent"
            />
          ))}
        </View>
        <Text variant="caption" tone="dim" style={{ marginTop: spacing.sm }}>
          {DIFFICULTY[difficulty].description}
        </Text>
        <View style={styles.detailsRow}>
          <Text variant="caption" tone="muted">
            Tiempo por operación
          </Text>
          <Text variant="bodyStrong">{DIFFICULTY[difficulty].allowedMs / 1000} s</Text>
        </View>
      </Card>

      <Card style={styles.section}>
        <Text variant="caption" tone="muted" style={styles.eyebrow}>
          ITERACIONES POR RONDA
        </Text>
        <View style={styles.chipRow}>
          {ITERATION_OPTIONS.map((n) => (
            <Chip
              key={n}
              label={`${n}`}
              active={n === iterations}
              onPress={() => setIterations(n)}
              tone="secondary"
            />
          ))}
        </View>
        <Text variant="caption" tone="dim" style={{ marginTop: spacing.sm }}>
          No aplica al modo Contra reloj (siempre 60 segundos).
        </Text>
      </Card>

      <Card style={styles.section}>
        <Text variant="caption" tone="muted" style={styles.eyebrow}>
          EXPERIENCIA
        </Text>
        <ToggleRow
          label="Vibración háptica"
          helper="Feedback sutil al responder."
          value={haptics}
          onChange={setHaptics}
        />
        <ToggleRow
          label="Sonidos"
          helper="Efectos breves al acertar o fallar."
          value={sound}
          onChange={setSound}
        />
        <ToggleRow
          label="Dificultad dinámica"
          helper="Reduce el tiempo disponible a medida que avanza la ronda."
          value={dynamic}
          onChange={setDynamic}
          isLast
        />
      </Card>
    </Screen>
  );
};

interface ToggleRowProps {
  label: string;
  helper: string;
  value: boolean;
  onChange: (v: boolean) => void;
  isLast?: boolean;
}

const ToggleRow = ({ label, helper, value, onChange, isLast }: ToggleRowProps) => (
  <View style={[styles.toggleRow, !isLast && styles.toggleDivider]}>
    <View style={{ flex: 1, paddingRight: spacing.md }}>
      <Text variant="bodyStrong">{label}</Text>
      <Text variant="caption" tone="dim">
        {helper}
      </Text>
    </View>
    <Toggle value={value} onChange={onChange} />
  </View>
);

const styles = StyleSheet.create({
  header: {
    paddingBottom: spacing.xxl,
    gap: spacing.xs,
  },
  backRow: {
    marginLeft: -spacing.md,
    marginBottom: spacing.sm,
    alignSelf: 'flex-start',
  },
  section: {
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  eyebrow: {
    letterSpacing: 1.4,
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  toggleDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
});
