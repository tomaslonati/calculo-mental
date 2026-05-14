import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';

import { colors, typography } from '../../constants/theme';

export type TextVariant =
  | 'display'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'bodyStrong'
  | 'caption'
  | 'mono';

type Tone = 'default' | 'muted' | 'dim' | 'accent' | 'secondary' | 'error';

interface Props extends RNTextProps {
  variant?: TextVariant;
  tone?: Tone;
  align?: 'left' | 'center' | 'right';
}

const toneColor: Record<Tone, string> = {
  default: colors.text,
  muted: colors.textMuted,
  dim: colors.textDim,
  accent: colors.accent,
  secondary: colors.secondary,
  error: colors.error,
};

export const Text = ({
  variant = 'body',
  tone = 'default',
  align,
  style,
  ...rest
}: Props) => {
  return (
    <RNText
      {...rest}
      style={[
        typography[variant],
        { color: toneColor[tone] },
        align ? { textAlign: align } : null,
        style,
      ]}
    />
  );
};

export const textStyles = StyleSheet.create({
  base: { color: colors.text },
});
