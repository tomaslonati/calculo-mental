import type { Difficulty, Operator } from '../types/game';

export interface DifficultyConfig {
  label: string;
  shortLabel: string;
  description: string;
  operators: Operator[];
  rangeA: [number, number];
  rangeB: [number, number];
  allowedMs: number;
  defaultIterations: number;
  combinedChance: number; // 0..1 — solo aplica si tiene > 0
}

export const DIFFICULTY: Record<Difficulty, DifficultyConfig> = {
  facil: {
    label: 'Fácil',
    shortLabel: 'Fácil',
    description: 'Sumas y restas con números chicos.',
    operators: ['+', '-'],
    rangeA: [1, 20],
    rangeB: [1, 20],
    allowedMs: 10000,
    defaultIterations: 10,
    combinedChance: 0,
  },
  medio: {
    label: 'Medio',
    shortLabel: 'Medio',
    description: 'Suma, resta, multiplicación y división simple.',
    operators: ['+', '-', '*', '/'],
    rangeA: [2, 30],
    rangeB: [2, 12],
    allowedMs: 7000,
    defaultIterations: 15,
    combinedChance: 0,
  },
  dificil: {
    label: 'Difícil',
    shortLabel: 'Difícil',
    description: 'Operaciones combinadas y números más altos.',
    operators: ['+', '-', '*', '/'],
    rangeA: [5, 99],
    rangeB: [2, 15],
    allowedMs: 5000,
    defaultIterations: 20,
    combinedChance: 0.3,
  },
};

export const DIFFICULTIES: Difficulty[] = ['facil', 'medio', 'dificil'];

export const ITERATION_OPTIONS = [5, 10, 15, 20] as const;

export const COUNTDOWN_MS = 60000; // duración total de "contra reloj"
