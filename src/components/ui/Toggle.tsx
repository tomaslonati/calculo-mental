import { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '../../constants/theme';

interface Props {
  value: boolean;
  onChange: (next: boolean) => void;
}

const TRACK_W = 48;
const TRACK_H = 28;
const THUMB = 22;

export const Toggle = ({ value, onChange }: Props) => {
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { duration: 180 });
  }, [value, progress]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ['rgba(255,255,255,0.08)', colors.accentSoft],
    ),
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [colors.border, colors.accent],
    ),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * (TRACK_W - THUMB - 4) }],
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [colors.textMuted, colors.accent],
    ),
  }));

  return (
    <Pressable onPress={() => onChange(!value)} hitSlop={8}>
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  thumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
  },
});
