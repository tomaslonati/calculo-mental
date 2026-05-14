import { View, ViewStyle } from 'react-native';

import { colors, spacing } from '../../constants/theme';

interface Props {
  style?: ViewStyle;
  vertical?: boolean;
}

export const Divider = ({ style, vertical = false }: Props) => {
  if (vertical) {
    return (
      <View
        style={[
          { width: 1, backgroundColor: colors.border, alignSelf: 'stretch' },
          style,
        ]}
      />
    );
  }
  return (
    <View
      style={[
        {
          height: 1,
          backgroundColor: colors.border,
          marginVertical: spacing.lg,
        },
        style,
      ]}
    />
  );
};
