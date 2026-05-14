import { StyleSheet, View } from 'react-native';
import Svg, { Rect, Line } from 'react-native-svg';

import { colors, radii, spacing } from '../../constants/theme';
import { Text } from '../ui/Text';

interface Bar {
  value: number; // 0..1 (porcentaje) o valor absoluto si maxValue lo cubre
  label: string;
  color?: string;
}

interface Props {
  data: Bar[];
  height?: number;
  maxValue?: number; // si no, normalizamos al máximo
  yLabel?: string;
}

export const BarChart = ({ data, height = 140, maxValue, yLabel }: Props) => {
  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1);

  if (data.length === 0) {
    return (
      <View style={[styles.empty, { height }]}>
        <Text variant="caption" tone="dim">
          Sin datos para mostrar
        </Text>
      </View>
    );
  }

  const chartWidth = 100; // viewBox
  const gap = 2;
  const barWidth = (chartWidth - gap * (data.length + 1)) / data.length;

  return (
    <View style={styles.wrap}>
      {yLabel ? (
        <Text variant="caption" tone="dim">
          {yLabel}
        </Text>
      ) : null}
      <View style={[styles.chartBox, { height }]}>
        <Svg
          width="100%"
          height={height}
          viewBox={`0 0 ${chartWidth} 100`}
          preserveAspectRatio="none"
        >
          <Line
            x1={0}
            y1={50}
            x2={chartWidth}
            y2={50}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={0.5}
          />
          {data.map((bar, idx) => {
            const h = Math.max(2, (bar.value / max) * 90);
            const x = gap + idx * (barWidth + gap);
            const y = 100 - h;
            return (
              <Rect
                key={`${bar.label}_${idx}`}
                x={x}
                y={y}
                width={barWidth}
                height={h}
                rx={1}
                fill={bar.color || colors.secondary}
                opacity={0.85}
              />
            );
          })}
        </Svg>
      </View>
      <View style={styles.labelRow}>
        {data.map((bar, idx) => (
          <Text
            key={`${bar.label}_lab_${idx}`}
            variant="caption"
            tone="dim"
            style={styles.labelCell}
            numberOfLines={1}
          >
            {bar.label}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  chartBox: {
    backgroundColor: colors.cardAlt,
    borderRadius: radii.md,
    padding: spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
  },
  labelCell: {
    flex: 1,
    textAlign: 'center',
  },
  empty: {
    backgroundColor: colors.cardAlt,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
