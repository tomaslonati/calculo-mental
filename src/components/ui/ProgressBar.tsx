import { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { colors, radii } from '../../constants/theme';
import { clamp } from '../../utils/math';

interface Props {
  value: number; // 0..1
  color?: string;
  trackColor?: string;
  height?: number;
  style?: ViewStyle;
  animated?: boolean;
}

export const ProgressBar = ({
  value,
  color = colors.accent,
  trackColor = 'rgba(255,255,255,0.08)',
  height = 8,
  style,
  animated = true,
}: Props) => {
  const progress = useSharedValue(clamp(value, 0, 1));

  useEffect(() => {
    const v = clamp(value, 0, 1);
    if (animated) {
      progress.value = withTiming(v, { duration: 240 });
    } else {
      progress.value = v;
    }
  }, [value, animated, progress]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View
      style={[
        styles.track,
        { backgroundColor: trackColor, height, borderRadius: height / 2 },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          { backgroundColor: color, borderRadius: height / 2 },
          fillStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: radii.pill,
  },
  fill: {
    height: '100%',
  },
});
