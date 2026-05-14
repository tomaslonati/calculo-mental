import { StyleSheet, View } from 'react-native';

import { colors, radii, spacing, typography } from '../../constants/theme';
import type { Operation } from '../../types/game';
import { Text } from '../ui/Text';

interface Props {
  operation: Operation;
  proposed?: number | null; // sólo para modo verdadero/falso
}

const SYMBOL: Record<string, string> = {
  '+': '+',
  '-': '−',
  '*': '×',
  '/': '÷',
};

export const OperationDisplay = ({ operation, proposed }: Props) => {
  const { a, b, operator, combined } = operation;
  const body = combined
    ? `${a} ${SYMBOL[operator]} ${b} ${SYMBOL[combined.op2]} ${combined.c}`
    : `${a} ${SYMBOL[operator]} ${b}`;

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={[typography.mono, styles.expr]}>{body}</Text>
        <Text style={[typography.mono, styles.equals]}>=</Text>
        {proposed !== undefined && proposed !== null ? (
          <Text style={[typography.mono, styles.proposed]}>{proposed}</Text>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
  },
  expr: {
    color: colors.text,
    fontSize: 44,
    lineHeight: 50,
  },
  equals: {
    color: colors.textMuted,
    fontSize: 44,
    lineHeight: 50,
  },
  proposed: {
    color: colors.secondary,
    fontSize: 44,
    lineHeight: 50,
  },
  placeholder: {
    width: 60,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: radii.pill,
  },
});
