import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DIFFICULTY } from '../constants/difficulty';
import { STORAGE_KEYS } from '../storage/keys';
import type { Difficulty, GameMode } from '../types/game';

export interface Settings {
  difficulty: Difficulty;
  iterations: number;
  mode: GameMode;
  sound: boolean;
  haptics: boolean;
  dynamic: boolean;
}

interface SettingsState extends Settings {
  hasHydrated: boolean;
  setDifficulty: (difficulty: Difficulty) => void;
  setIterations: (iterations: number) => void;
  setMode: (mode: GameMode) => void;
  setSound: (sound: boolean) => void;
  setHaptics: (haptics: boolean) => void;
  setDynamic: (dynamic: boolean) => void;
  setHydrated: (value: boolean) => void;
}

const DEFAULTS: Settings = {
  difficulty: 'medio',
  iterations: DIFFICULTY.medio.defaultIterations,
  mode: 'clasico',
  sound: true,
  haptics: true,
  dynamic: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      hasHydrated: false,
      setDifficulty: (difficulty) =>
        set((state) => ({
          difficulty,
          iterations:
            state.iterations === DIFFICULTY[state.difficulty].defaultIterations
              ? DIFFICULTY[difficulty].defaultIterations
              : state.iterations,
        })),
      setIterations: (iterations) => set({ iterations }),
      setMode: (mode) => set({ mode }),
      setSound: (sound) => set({ sound }),
      setHaptics: (haptics) => set({ haptics }),
      setDynamic: (dynamic) => set({ dynamic }),
      setHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: STORAGE_KEYS.settings,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({
        difficulty,
        iterations,
        mode,
        sound,
        haptics,
        dynamic,
      }): Settings => ({
        difficulty,
        iterations,
        mode,
        sound,
        haptics,
        dynamic,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
