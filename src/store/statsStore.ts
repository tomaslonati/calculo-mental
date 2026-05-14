import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '../storage/keys';
import type { GameMode, GameSession } from '../types/game';
import type { AccumulatedStats } from '../types/stats';

const MAX_SESSIONS = 50;

const EMPTY_TOTALS: AccumulatedStats = {
  played: 0,
  correct: 0,
  incorrect: 0,
  timeouts: 0,
  avgAccuracy: 0,
  avgTimeMs: 0,
  totalScore: 0,
};

const EMPTY_BEST: Record<GameMode, number> = {
  clasico: 0,
  verdadero_falso: 0,
  multiple_choice: 0,
  contra_reloj: 0,
};

const recomputeTotals = (sessions: GameSession[]): AccumulatedStats => {
  if (sessions.length === 0) return EMPTY_TOTALS;
  let correct = 0;
  let incorrect = 0;
  let timeouts = 0;
  let totalScore = 0;
  let accuracySum = 0;
  let timeSum = 0;
  let timeSamples = 0;

  for (const s of sessions) {
    correct += s.correct;
    incorrect += s.incorrect;
    timeouts += s.timeouts;
    totalScore += s.score;
    accuracySum += s.accuracy;
    if (Number.isFinite(s.avgTimeMs) && s.avgTimeMs > 0) {
      timeSum += s.avgTimeMs;
      timeSamples += 1;
    }
  }

  return {
    played: sessions.length,
    correct,
    incorrect,
    timeouts,
    avgAccuracy: accuracySum / sessions.length,
    avgTimeMs: timeSamples > 0 ? timeSum / timeSamples : 0,
    totalScore,
  };
};

const recomputeBests = (sessions: GameSession[]): Record<GameMode, number> => {
  const out: Record<GameMode, number> = { ...EMPTY_BEST };
  for (const s of sessions) {
    if (s.score > out[s.mode]) out[s.mode] = s.score;
  }
  return out;
};

interface StatsState {
  sessions: GameSession[];
  bestByMode: Record<GameMode, number>;
  totals: AccumulatedStats;
  hasHydrated: boolean;
  addSession: (session: GameSession) => void;
  clear: () => void;
  setHydrated: (value: boolean) => void;
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      sessions: [],
      bestByMode: { ...EMPTY_BEST },
      totals: { ...EMPTY_TOTALS },
      hasHydrated: false,
      addSession: (session) => {
        const next = [session, ...get().sessions].slice(0, MAX_SESSIONS);
        set({
          sessions: next,
          bestByMode: recomputeBests(next),
          totals: recomputeTotals(next),
        });
      },
      clear: () =>
        set({
          sessions: [],
          bestByMode: { ...EMPTY_BEST },
          totals: { ...EMPTY_TOTALS },
        }),
      setHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: STORAGE_KEYS.stats,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ sessions, bestByMode, totals }) => ({
        sessions,
        bestByMode,
        totals,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.totals = recomputeTotals(state.sessions);
          state.bestByMode = recomputeBests(state.sessions);
          state.setHydrated(true);
        }
      },
    },
  ),
);

export const selectGlobalBest = (state: StatsState): number => {
  return Object.values(state.bestByMode).reduce((m, v) => (v > m ? v : m), 0);
};
