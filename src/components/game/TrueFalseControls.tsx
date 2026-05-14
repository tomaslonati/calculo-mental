import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radii, spacing, typography } from '../../constants/theme';
import { useHaptics } from '../../hooks/useHaptics';
import { IconGlyph } from '../ui/IconGlyph';
import { Text } from '../ui/Text';

interface Props {
  onAnswer: (value: boolean) => void;
  disabled?: boolean;
}

export const TrueFalseControls = ({ onAnswer, disabled = false }: Props) => {
  const { trigger } = useHaptics();
  return (
    <View style={styles.row}>
      <Pressable
        disabled={disabled}
        onPress={() => {
          trigger('tap');
          onAnswer(false);
        }}
        style={({ pressed }) => [
          styles.btn,
          { borderColor: colors.error, backgroundColor: colors.errorSoft },
          pressed && !disabled ? styles.pressed : null,
          disabled ? styles.disabled : null,
        ]}
      >
        <IconGlyph name="close" size={28} color={colors.error} />
        <Text style={[typography.bodyStrong, { color: colors.error }]}>Falso</Text>
      </Pressable>
      <Pressable
        disabled={disabled}
        onPress={() => {
          trigger('tap');
          onAnswer(true);
        }}
        style={({ pressed }) => [
          styles.btn,
          { borderColor: colors.accent, backgroundColor: colors.accentSoft },
          pressed && !disabled ? styles.pressed : null,
          disabled ? styles.disabled : null,
        ]}
      >
        <IconGlyph name="check" size={28} color={colors.accent} />
        <Text style={[typography.bodyStrong, { color: colors.accent }]}>Verdadero</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  btn: {
    flex: 1,
    minHeight: 90,
    borderRadius: radii.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.6,
  },
});
