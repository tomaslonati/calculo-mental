import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '../../constants/theme';

interface Props {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

export const Screen = ({
  children,
  scroll = false,
  padded = true,
  style,
  contentStyle,
}: Props) => {
  const content = (
    <View style={[styles.fill, padded && styles.padded, contentStyle]}>{children}</View>
  );

  return (
    <SafeAreaView style={[styles.root, style]} edges={['top', 'left', 'right']}>
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  fill: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.huge,
  },
});
