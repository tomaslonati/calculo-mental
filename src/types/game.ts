export type Difficulty = 'facil' | 'medio' | 'dificil';

export type Operator = '+' | '-' | '*' | '/';

export type GameMode =
  | 'clasico'
  | 'verdadero_falso'
  | 'multiple_choice'
  | 'contra_reloj';

export interface Operation {
  id: string;
  a: number;
  b: number;
  operator: Operator;
  result: number;
  // Operación combinada (sólo difícil): a op1 b op2 c
  combined?: {
    c: number;
    op2: Operator;
  };
  // Para verdadero_falso: el valor que se le muestra al usuario
  proposed?: number;
  proposedIsCorrect?: boolean;
  // Para multiple_choice: opciones barajadas
  choices?: number[];
}

export interface Answer {
  operationId: string;
  given: number | null;
  correct: boolean;
  timedOut: boolean;
  timeMs: number;
  allowedMs: number;
  score: number;
}

export interface GameSession {
  id: string;
  mode: GameMode;
  difficulty: Difficulty;
  iterations: number;
  startedAt: number;
  finishedAt: number;
  answers: Answer[];
  score: number;
  accuracy: number; // 0..1
  avgTimeMs: number;
  correct: number;
  incorrect: number;
  timeouts: number;
  maxStreak: number;
}
