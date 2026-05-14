import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
} from 'react-native-reanimated';

import { Button } from '../components/ui/Button';
import { FeedbackOverlay } from '../components/game/FeedbackOverlay';
import { HUD } from '../components/game/HUD';
import { IconGlyph } from '../components/ui/IconGlyph';
import { MultipleChoiceGrid } from '../components/game/MultipleChoiceGrid';
import { NumericKeypad } from '../components/game/NumericKeypad';
import { OperationDisplay } from '../components/game/OperationDisplay';
import { Screen } from '../components/ui/Screen';
import { Text } from '../components/ui/Text';
import { TimerRing } from '../components/game/TimerRing';
import { TrueFalseControls } from '../components/game/TrueFalseControls';
import { COUNTDOWN_MS } from '../constants/difficulty';
import { colors, spacing } from '../constants/theme';
import { useGameEngine } from '../hooks/useGameEngine';
import { formatSeconds } from '../utils/format';
import type { ScreenProps } from '../navigation/types';

export const GameScreen = ({ navigation }: ScreenProps<'Game'>) => {
  const engine = useGameEngine();
  const [keypadValue, setKeypadValue] = useState('');

  // Cuando llega una nueva operación, limpiamos el input.
  useEffect(() => {
    setKeypadValue('');
  }, [engine.current?.id]);

  // Cuando termina, vamos a Results.
  useEffect(() => {
    if (engine.status === 'finished' && engine.lastSession) {
      const session = engine.lastSession;
      navigation.replace('Results', { session });
    }
  }, [engine.status, engine.lastSession, navigation]);

  const confirmExit = () => {
    Alert.alert(
      'Salir de la partida',
      'Si salís ahora, vas a perder el progreso actual.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: () => {
            engine.abort();
            navigation.popToTop();
          },
        },
      ],
    );
  };

  const isCountdown = engine.mode === 'contra_reloj';
  const countdownLabel = isCountdown ? formatSeconds(engine.globalRemainingMs) : undefined;
  const countdownProgress = isCountdown
    ? engine.globalRemainingMs / COUNTDOWN_MS
    : undefined;

  const op = engine.current;
  const ringSeconds = Math.max(0, Math.ceil(engine.remainingMs / 1000));
  const ringProgress = engine.allowedMs > 0 ? engine.remainingMs / engine.allowedMs : 0;
  const locked = engine.status !== 'playing';

  return (
    <Screen padded={false}>
      <FeedbackOverlay kind={engine.feedback} />
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Button
            label="Salir"
            variant="ghost"
            size="md"
            fullWidth={false}
            onPress={confirmExit}
            leadingIcon={<IconGlyph name="close" size={18} color={colors.textMuted} />}
          />
          <Text variant="caption" tone="muted">
            {labelForMode(engine.mode)}
          </Text>
        </View>

        <HUD
          score={engine.score}
          index={engine.answersGiven}
          total={engine.iterations}
          streak={engine.streak}
          countdownLabel={countdownLabel ?? null}
          countdownProgress={countdownProgress ?? null}
        />

        <View style={styles.timerWrap}>
          <TimerRing
            progress={ringProgress}
            size={156}
            label={`${ringSeconds}`}
            sublabel="segundos"
          />
        </View>

        {op ? (
          <Animated.View
            key={op.id}
            entering={FadeIn.duration(220)}
            exiting={FadeOut.duration(160)}
            layout={Layout.springify()}
            style={styles.operationWrap}
          >
            <OperationDisplay
              operation={op}
              proposed={engine.mode === 'verdadero_falso' ? (op.proposed ?? null) : undefined}
            />
          </Animated.View>
        ) : null}

        <View style={styles.controls}>
          {engine.mode === 'clasico' || engine.mode === 'contra_reloj' ? (
            <NumericKeypad
              value={keypadValue}
              onChange={setKeypadValue}
              onSubmit={() => {
                const n = Number(keypadValue);
                if (Number.isNaN(n)) return;
                engine.submitAnswer(n);
              }}
              disabled={locked}
            />
          ) : null}
          {engine.mode === 'verdadero_falso' && op ? (
            <TrueFalseControls
              onAnswer={(v) => engine.submitAnswer(v ? 1 : 0)}
              disabled={locked}
            />
          ) : null}
          {engine.mode === 'multiple_choice' && op?.choices ? (
            <MultipleChoiceGrid
              choices={op.choices}
              onPick={(v) => engine.submitAnswer(v)}
              disabled={locked}
            />
          ) : null}
        </View>
      </View>
    </Screen>
  );
};

const labelForMode = (mode: string) => {
  switch (mode) {
    case 'clasico':
      return 'MODO CLÁSICO';
    case 'verdadero_falso':
      return 'VERDADERO / FALSO';
    case 'multiple_choice':
      return 'OPCIÓN MÚLTIPLE';
    case 'contra_reloj':
      return 'CONTRA RELOJ';
    default:
      return '';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: -spacing.md,
    marginBottom: spacing.xs,
  },
  timerWrap: {
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  operationWrap: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  controls: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
