import type { GameMode, GameSession } from './game';

export interface AccumulatedStats {
  played: number;
  correct: number;
  incorrect: number;
  timeouts: number;
  avgAccuracy: number;
  avgTimeMs: number;
  totalScore: number;
}

export interface StatsSnapshot {
  sessions: GameSession[];
  bestByMode: Record<GameMode, number>;
  totals: AccumulatedStats;
}
