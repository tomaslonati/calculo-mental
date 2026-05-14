import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

import { colors, spacing } from '../../constants/theme';
import { Text } from '../ui/Text';

interface Segment {
  value: number;
  color: string;
  label: string;
}

interface Props {
  segments: Segment[];
  size?: number;
  stroke?: number;
  centerLabel?: string;
  centerSublabel?: string;
}

const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

export const DonutChart = ({
  segments,
  size = 180,
  stroke = 18,
  centerLabel,
  centerSublabel,
}: Props) => {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulated = 0;

  return (
    <View style={styles.wrap}>
      <View style={[styles.chartWrap, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={stroke}
            fill="none"
          />
          {total > 0 ? (
            <G>
              {segments.map((seg, idx) => {
                if (seg.value <= 0) return null;
                const fraction = seg.value / total;
                const dash = fraction * circumference;
                const gap = circumference - dash;
                const rotation = (accumulated / total) * 360 - 90;
                accumulated += seg.value;
                return (
                  <Circle
                    key={idx}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={seg.color}
                    strokeWidth={stroke}
                    fill="none"
                    strokeDasharray={`${dash}, ${gap}`}
                    strokeLinecap="butt"
                    transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
                  />
                );
              })}
            </G>
          ) : null}
        </Svg>
        <View style={styles.center} pointerEvents="none">
          <Text variant="title" style={{ color: colors.text }}>
            {centerLabel ?? `${total}`}
          </Text>
          {centerSublabel ? (
            <Text variant="caption" tone="muted">
              {centerSublabel}
            </Text>
          ) : null}
        </View>
      </View>
      <View style={styles.legend}>
        {segments.map((seg) => (
          <View key={seg.label} style={styles.legendRow}>
            <View style={[styles.dot, { backgroundColor: seg.color }]} />
            <Text variant="body" tone="muted" style={styles.legendLabel}>
              {seg.label}
            </Text>
            <Text variant="bodyStrong">{seg.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// Helper para gráfico de resultados.
export const buildResultsSegments = (correct: number, incorrect: number, timeouts: number) => [
  { label: 'Correctas', value: correct, color: colors.accent },
  { label: 'Incorrectas', value: incorrect, color: colors.error },
  { label: 'Sin responder', value: timeouts, color: colors.warning },
];

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxl,
  },
  chartWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  legend: {
    flex: 1,
    gap: spacing.sm,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  legendLabel: {
    flex: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
