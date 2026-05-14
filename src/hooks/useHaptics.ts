import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';

import { useSettingsStore } from '../store/settingsStore';

type HapticKind = 'tap' | 'success' | 'warning' | 'error';

export const useHaptics = () => {
  const enabled = useSettingsStore((s) => s.haptics);

  const trigger = useCallback(
    (kind: HapticKind) => {
      if (!enabled) return;
      try {
        switch (kind) {
          case 'tap':
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            return;
          case 'success':
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            return;
          case 'warning':
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            return;
          case 'error':
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
        }
      } catch {
        // ignoramos errores del dispositivo (web, simuladores sin soporte)
      }
    },
    [enabled],
  );

  return { trigger };
};
