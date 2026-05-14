import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radii, spacing, typography } from '../../constants/theme';
import { useHaptics } from '../../hooks/useHaptics';
import { Text } from '../ui/Text';

interface Props {
  choices: number[];
  onPick: (value: number) => void;
  disabled?: boolean;
}

export const MultipleChoiceGrid = ({ choices, onPick, disabled = false }: Props) => {
  const { trigger } = useHaptics();
  return (
    <View style={styles.grid}>
      {choices.map((value, idx) => (
        <Pressable
          key={`${value}_${idx}`}
          disabled={disabled}
          onPress={() => {
            trigger('tap');
            onPick(value);
          }}
          style={({ pressed }) => [
            styles.tile,
            pressed && !disabled ? styles.pressed : null,
            disabled ? styles.disabled : null,
          ]}
        >
          <Text style={[typography.title, styles.label]}>{value}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  tile: {
    width: '48%',
    minHeight: 84,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  label: {
    color: colors.text,
    fontSize: 26,
  },
  pressed: {
    backgroundColor: colors.cardAlt,
    borderColor: colors.secondary,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.6,
  },
});
