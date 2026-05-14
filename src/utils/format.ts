export const formatMs = (ms: number): string => {
  if (!Number.isFinite(ms) || ms < 0) return '—';
  if (ms < 1000) return `${Math.round(ms)} ms`;
  const seconds = ms / 1000;
  return `${seconds.toFixed(seconds < 10 ? 2 : 1)} s`;
};

export const formatSeconds = (ms: number): string => {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const formatPercent = (value: number, fraction = 0): string => {
  if (!Number.isFinite(value)) return '0%';
  const pct = value * 100;
  return `${pct.toFixed(fraction)}%`;
};

const MONTHS_ES = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];

export const formatDate = (ts: number): string => {
  const d = new Date(ts);
  const dd = d.getDate().toString().padStart(2, '0');
  const mm = MONTHS_ES[d.getMonth()];
  const hh = d.getHours().toString().padStart(2, '0');
  const mi = d.getMinutes().toString().padStart(2, '0');
  return `${dd} ${mm} · ${hh}:${mi}`;
};

export const formatScore = (n: number): string => {
  return n.toLocaleString('es-AR');
};
