import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { colors } from '../../constants/theme';
import { Text } from '../ui/Text';
import { clamp } from '../../utils/math';

interface Props {
  progress: number; // 0..1 (1 = lleno, 0 = vacío)
  size?: number;
  stroke?: number;
  label: string;
  sublabel?: string;
}

export const TimerRing = ({ progress, size = 180, stroke = 10, label, sublabel }: Props) => {
  const p = clamp(progress, 0, 1);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - p);
  const color = p > 0.45 ? colors.accent : p > 0.2 ? colors.warning : colors.error;

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference}, ${circumference}`}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.center}>
        <Text variant="display" style={{ color }}>
          {label}
        </Text>
        {sublabel ? (
          <Text variant="caption" tone="muted">
            {sublabel}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
