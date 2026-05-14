import { DIFFICULTY } from '../constants/difficulty';
import type { Difficulty, GameMode, Operation, Operator } from '../types/game';
import { pickOne, randInt, shuffle } from '../utils/math';
import { uid } from '../utils/id';
import { generateDistractors } from './distractors';

const evalSimple = (a: number, b: number, op: Operator): number => {
  switch (op) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      return a / b;
  }
};

const PRECEDENCE: Record<Operator, number> = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
};

const evalCombined = (
  a: number,
  op1: Operator,
  b: number,
  op2: Operator,
  c: number,
): number => {
  if (PRECEDENCE[op2] > PRECEDENCE[op1]) {
    return evalSimple(a, evalSimple(b, c, op2), op1);
  }
  return evalSimple(evalSimple(a, b, op1), c, op2);
};

const generateDivision = (config: { rangeA: [number, number]; rangeB: [number, number] }) => {
  // a = b * result, ambos enteros, result en rango cómodo
  const b = randInt(Math.max(2, config.rangeB[0]), config.rangeB[1]);
  const maxResult = Math.max(2, Math.floor(config.rangeA[1] / b));
  const minResult = Math.max(2, Math.floor(config.rangeA[0] / b));
  const result = randInt(Math.min(minResult, maxResult), Math.max(minResult, maxResult));
  return { a: b * result, b, result };
};

const generateSubtraction = (config: { rangeA: [number, number]; rangeB: [number, number] }) => {
  // Garantizamos resultado no negativo en fácil/medio para no enredar al usuario.
  let a = randInt(config.rangeA[0], config.rangeA[1]);
  let b = randInt(config.rangeB[0], config.rangeB[1]);
  if (b > a) [a, b] = [b, a];
  return { a, b, result: a - b };
};

const generateSimple = (
  difficulty: Difficulty,
  operator: Operator,
): { a: number; b: number; result: number } => {
  const config = DIFFICULTY[difficulty];
  switch (operator) {
    case '+': {
      const a = randInt(config.rangeA[0], config.rangeA[1]);
      const b = randInt(config.rangeB[0], config.rangeB[1]);
      return { a, b, result: a + b };
    }
    case '-':
      return generateSubtraction(config);
    case '*': {
      const a = randInt(config.rangeA[0], Math.min(config.rangeA[1], 25));
      const b = randInt(config.rangeB[0], config.rangeB[1]);
      return { a, b, result: a * b };
    }
    case '/':
      return generateDivision(config);
  }
};

const generateCombined = (difficulty: Difficulty): Operation => {
  const config = DIFFICULTY[difficulty];
  // Para combinadas usamos sólo + - * y siempre sumas/restas pequeñas en la segunda parte.
  const ops: Operator[] = config.operators.filter((o) => o !== '/');
  const op1 = pickOne(ops);
  const op2 = pickOne(['+', '-'] as const);
  const base = generateSimple(difficulty, op1);
  const c = randInt(2, 12);
  const result = evalCombined(base.a, op1, base.b, op2, c);
  return {
    id: uid('op'),
    a: base.a,
    b: base.b,
    operator: op1,
    result,
    combined: { c, op2 },
  };
};

export const generateOperation = (difficulty: Difficulty, mode: GameMode): Operation => {
  const config = DIFFICULTY[difficulty];

  if (config.combinedChance > 0 && Math.random() < config.combinedChance) {
    const base = generateCombined(difficulty);
    return decorateForMode(base, mode);
  }

  const operator = pickOne(config.operators);
  const base = generateSimple(difficulty, operator);
  const op: Operation = {
    id: uid('op'),
    a: base.a,
    b: base.b,
    operator,
    result: base.result,
  };
  return decorateForMode(op, mode);
};

const decorateForMode = (op: Operation, mode: GameMode): Operation => {
  if (mode === 'verdadero_falso') {
    const showCorrect = Math.random() < 0.5;
    if (showCorrect) {
      return { ...op, proposed: op.result, proposedIsCorrect: true };
    }
    const sign = Math.random() < 0.5 ? -1 : 1;
    const offset = sign * randInt(1, Math.max(3, Math.floor(Math.abs(op.result) * 0.15) + 1));
    const proposed = op.result + offset;
    return { ...op, proposed, proposedIsCorrect: false };
  }

  if (mode === 'multiple_choice') {
    const distractors = generateDistractors(op.result, 3);
    const choices = shuffle([op.result, ...distractors]);
    return { ...op, choices };
  }

  return op;
};

export const generateRound = (
  difficulty: Difficulty,
  mode: GameMode,
  count: number,
): Operation[] => {
  const out: Operation[] = [];
  for (let i = 0; i < count; i++) {
    out.push(generateOperation(difficulty, mode));
  }
  return out;
};
