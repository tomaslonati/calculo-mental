import { Audio } from 'expo-av';
import { useCallback, useEffect, useRef } from 'react';

import { useSettingsStore } from '../store/settingsStore';

export type SoundKind = 'correct' | 'wrong' | 'timeout' | 'finish';

// Para activar sonidos: dejá archivos .mp3 en assets/sounds/ con estos nombres
// y reemplazá los `null` por `require('../../assets/sounds/correct.mp3')` etc.
// La app igual funciona sin sonidos (el hook hace no-op de manera segura).
const SOURCES: Record<SoundKind, number | null> = {
  correct: null,
  wrong: null,
  timeout: null,
  finish: null,
};

type CacheEntry = { sound: Audio.Sound | null; loading: boolean };

export const useSounds = () => {
  const enabled = useSettingsStore((s) => s.sound);
  const cacheRef = useRef<Partial<Record<SoundKind, CacheEntry>>>({});

  useEffect(() => {
    void Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    }).catch(() => undefined);

    return () => {
      const cache = cacheRef.current;
      Object.values(cache).forEach((entry) => {
        entry?.sound?.unloadAsync().catch(() => undefined);
      });
      cacheRef.current = {};
    };
  }, []);

  const play = useCallback(
    async (kind: SoundKind) => {
      if (!enabled) return;
      const source = SOURCES[kind];
      if (source == null) return;

      const cache = cacheRef.current;
      let entry = cache[kind];
      if (!entry) {
        entry = { sound: null, loading: true };
        cache[kind] = entry;
        try {
          const { sound } = await Audio.Sound.createAsync(source, {
            shouldPlay: false,
            volume: 0.6,
          });
          entry.sound = sound;
        } catch {
          // archivo no disponible — el hook continúa siendo no-op
        } finally {
          entry.loading = false;
        }
      }
      try {
        await entry.sound?.setPositionAsync(0);
        await entry.sound?.playAsync();
      } catch {
        // ignoramos errores de reproducción
      }
    },
    [enabled],
  );

  return { play };
};
