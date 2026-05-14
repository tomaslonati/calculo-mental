export const randInt = (min: number, max: number): number => {
  const lo = Math.ceil(min);
  const hi = Math.floor(max);
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
};

export const pickOne = <T>(arr: readonly T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const shuffle = <T>(arr: readonly T[]): T[] => {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};
