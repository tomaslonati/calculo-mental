import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { colors, radii } from '../../constants/theme';

interface Props {
  children: ReactNode;
  size?: number;
  tone?: 'accent' | 'secondary' | 'neutral' | 'error';
  style?: ViewStyle;
}

const TONES: Record<NonNullable<Props['tone']>, string> = {
  accent: colors.accentSoft,
  secondary: colors.secondarySoft,
  neutral: 'rgba(255,255,255,0.06)',
  error: colors.errorSoft,
};

export const IconBadge = ({ children, size = 44, tone = 'accent', style }: Props) => {
  return (
    <View
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: radii.md,
          backgroundColor: TONES[tone],
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
