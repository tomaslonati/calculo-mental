import { randInt } from '../utils/math';

// Genera opciones incorrectas creíbles, cercanas al resultado correcto.
export const generateDistractors = (correct: number, count: number): number[] => {
  const set = new Set<number>([correct]);
  const seeds: number[] = [];
  const magnitude = Math.max(2, Math.floor(Math.abs(correct) * 0.2) + 1);

  while (seeds.length < count) {
    const sign = Math.random() < 0.5 ? -1 : 1;
    const delta = sign * randInt(1, magnitude);
    const candidate = correct + delta;
    if (candidate === correct) continue;
    if (set.has(candidate)) continue;
    set.add(candidate);
    seeds.push(candidate);
  }
  return seeds;
};
