import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { colors, spacing } from '../constants/theme';
import { useSettingsStore } from '../store/settingsStore';
import { useStatsStore } from '../store/statsStore';
import { Text } from '../components/ui/Text';
import type { ScreenProps } from '../navigation/types';

export const SplashScreen = ({ navigation }: ScreenProps<'Splash'>) => {
  const settingsHydrated = useSettingsStore((s) => s.hasHydrated);
  const statsHydrated = useStatsStore((s) => s.hasHydrated);
  const ready = settingsHydrated && statsHydrated;

  const opacity = useSharedValue(0);
  const translate = useSharedValue(12);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
    translate.value = withDelay(80, withTiming(0, { duration: 500 }));
  }, [opacity, translate]);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => {
      navigation.replace('Home');
    }, 700);
    return () => clearTimeout(t);
  }, [ready, navigation]);

  const wrapStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translate.value }],
  }));

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.center, wrapStyle]}>
        <View style={styles.logoBox}>
          <Text style={styles.logoSign}>×</Text>
          <Text style={styles.logoSign}>÷</Text>
          <Text style={styles.logoSign}>+</Text>
          <Text style={styles.logoSign}>−</Text>
        </View>
        <Text variant="title" style={{ color: colors.text, marginTop: spacing.xxl }}>
          Cálculo Mental
        </Text>
        <Text variant="caption" tone="muted" style={{ marginTop: spacing.xs }}>
          Entrenamiento de cálculo rápido
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
  },
  logoBox: {
    width: 92,
    height: 92,
    borderRadius: 24,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 14,
    gap: 4,
  },
  logoSign: {
    color: colors.accent,
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    width: '46%',
    textAlign: 'center',
  },
});
