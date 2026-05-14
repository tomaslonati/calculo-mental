// Reglas de puntaje:
//   - correcta rápida (<75% del tiempo asignado): +100
//   - correcta normal: +70
//   - incorrecta: -30
//   - timeout: -50

export const FAST_THRESHOLD = 0.75;

export const SCORE = {
  correctFast: 100,
  correctNormal: 70,
  incorrect: -30,
  timeout: -50,
} as const;

export interface ScoreInput {
  correct: boolean;
  timedOut: boolean;
  timeMs: number;
  allowedMs: number;
}

export const scoreAnswer = ({ correct, timedOut, timeMs, allowedMs }: ScoreInput): number => {
  if (timedOut) return SCORE.timeout;
  if (!correct) return SCORE.incorrect;
  if (timeMs < allowedMs * FAST_THRESHOLD) return SCORE.correctFast;
  return SCORE.correctNormal;
};
