import { ReactNode } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';

import { colors, radii, shadows, spacing } from '../../constants/theme';

interface Props {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: keyof typeof spacing;
  tone?: 'default' | 'soft';
}

export const Card = ({ children, onPress, style, padding = 'xl', tone = 'default' }: Props) => {
  const padStyle = { padding: spacing[padding] };
  const bg = tone === 'soft' ? colors.cardAlt : colors.card;
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.base,
          { backgroundColor: bg },
          padStyle,
          pressed && styles.pressed,
          style,
        ]}
        android_ripple={{ color: 'rgba(255,255,255,0.06)' }}
      >
        {children}
      </Pressable>
    );
  }
  return (
    <View style={[styles.base, { backgroundColor: bg }, padStyle, style]}>{children}</View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.96,
  },
});
