import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '../../constants/theme';
import type { FeedbackKind } from '../../hooks/useGameEngine';

interface Props {
  kind: FeedbackKind;
}

const COLOR_MAP: Record<NonNullable<FeedbackKind>, string> = {
  correct: 'rgba(34, 197, 94, 0.18)',
  wrong: 'rgba(239, 68, 68, 0.18)',
  timeout: 'rgba(245, 158, 11, 0.18)',
};

export const FeedbackOverlay = ({ kind }: Props) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!kind) {
      cancelAnimation(opacity);
      opacity.value = 0;
      return;
    }
    opacity.value = withSequence(
      withTiming(1, { duration: 120 }),
      withTiming(0, { duration: 420 }),
    );
  }, [kind, opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  if (!kind) return null;
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFillObject,
        { backgroundColor: COLOR_MAP[kind] || colors.bg },
        style,
      ]}
    />
  );
};
