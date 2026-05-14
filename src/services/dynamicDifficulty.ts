import { clamp } from '../utils/math';

// Reduce el tiempo disponible un 3% por iteración, con piso del 50%.
export const computeAllowedMs = (
  baseMs: number,
  index: number,
  dynamic: boolean,
): number => {
  if (!dynamic) return baseMs;
  const factor = clamp(1 - 0.03 * index, 0.5, 1);
  return Math.round(baseMs * factor);
};
