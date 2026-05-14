import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radii, spacing, typography } from '../../constants/theme';
import { useHaptics } from '../../hooks/useHaptics';
import { IconGlyph } from '../ui/IconGlyph';
import { Text } from '../ui/Text';

interface Props {
  value: string;
  onChange: (next: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

const KEYS: (string | 'del' | 'sign' | 'enter')[] = [
  '1', '2', '3',
  '4', '5', '6',
  '7', '8', '9',
  'sign', '0', 'del',
];

export const NumericKeypad = ({ value, onChange, onSubmit, disabled = false }: Props) => {
  const { trigger } = useHaptics();

  const handlePress = (key: string | 'del' | 'sign' | 'enter') => {
    if (disabled) return;
    trigger('tap');
    if (key === 'del') {
      onChange(value.slice(0, -1));
      return;
    }
    if (key === 'sign') {
      if (value.startsWith('-')) onChange(value.slice(1));
      else if (value === '' || value === '0') onChange('-');
      else onChange(`-${value}`);
      return;
    }
    if (value.replace('-', '').length >= 6) return;
    onChange(`${value}${key}`);
  };

  const submitEnabled = !disabled && value.length > 0 && value !== '-' && !isNaN(Number(value));

  return (
    <View style={styles.wrap}>
      <View style={styles.grid}>
        {KEYS.map((key) => (
          <Pressable
            key={key}
            onPress={() => handlePress(key)}
            disabled={disabled}
            style={({ pressed }) => [
              styles.key,
              pressed && !disabled ? styles.keyPressed : null,
              disabled ? styles.keyDisabled : null,
            ]}
          >
            {key === 'del' ? (
              <IconGlyph name="backspace" size={26} color={colors.textMuted} />
            ) : key === 'sign' ? (
              <Text style={[typography.title, { color: colors.textMuted }]}>±</Text>
            ) : (
              <Text style={[typography.title, styles.keyLabel]}>{key}</Text>
            )}
          </Pressable>
        ))}
      </View>
      <Pressable
        onPress={() => {
          if (!submitEnabled) return;
          trigger('tap');
          onSubmit();
        }}
        style={({ pressed }) => [
          styles.enter,
          submitEnabled ? styles.enterActive : styles.enterDisabled,
          pressed && submitEnabled ? styles.enterPressed : null,
        ]}
        disabled={!submitEnabled}
      >
        <Text style={[typography.bodyStrong, { color: submitEnabled ? '#0B1224' : colors.textDim }]}>
          Confirmar
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  key: {
    width: '31%',
    aspectRatio: 1.6,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyPressed: {
    backgroundColor: colors.cardAlt,
    transform: [{ scale: 0.97 }],
  },
  keyDisabled: {
    opacity: 0.5,
  },
  keyLabel: {
    color: colors.text,
    fontSize: 26,
  },
  enter: {
    height: 56,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  enterActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  enterDisabled: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  enterPressed: {
    transform: [{ scale: 0.98 }],
  },
});
