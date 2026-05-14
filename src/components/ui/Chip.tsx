import { Pressable, StyleSheet, ViewStyle } from 'react-native';

import { colors, radii, spacing } from '../../constants/theme';
import { Text } from './Text';

interface Props {
  label: string;
  active?: boolean;
  onPress: () => void;
  style?: ViewStyle;
  tone?: 'default' | 'accent' | 'secondary';
}

export const Chip = ({ label, active = false, onPress, style, tone = 'default' }: Props) => {
  const activeColor =
    tone === 'secondary' ? colors.secondary : tone === 'accent' ? colors.accent : colors.text;
  const activeBg =
    tone === 'secondary'
      ? colors.secondarySoft
      : tone === 'accent'
        ? colors.accentSoft
        : 'rgba(255,255,255,0.06)';
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        active
          ? { backgroundColor: activeBg, borderColor: activeColor }
          : { backgroundColor: 'transparent', borderColor: colors.border },
        pressed ? { opacity: 0.85 } : null,
        style,
      ]}
    >
      <Text
        variant="caption"
        style={{ color: active ? activeColor : colors.textMuted, letterSpacing: 0.3 }}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
