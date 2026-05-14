import { useEffect, useRef, useState } from 'react';

interface Options {
  durationMs: number;
  running: boolean;
  onTimeout?: () => void;
  resetKey?: string | number;
  intervalMs?: number;
}

interface Result {
  remainingMs: number;
  progress: number; // 0..1 (1 = empezando)
  elapsedMs: number;
}

export const useCountdown = ({
  durationMs,
  running,
  onTimeout,
  resetKey,
  intervalMs = 50,
}: Options): Result => {
  const [remaining, setRemaining] = useState(durationMs);
  const startRef = useRef<number | null>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    setRemaining(durationMs);
    startRef.current = running ? Date.now() : null;
    firedRef.current = false;
  }, [resetKey, durationMs]);

  useEffect(() => {
    if (!running) return;
    if (startRef.current == null) {
      startRef.current = Date.now() - (durationMs - remaining);
    }
    const id = setInterval(() => {
      if (startRef.current == null) return;
      const elapsed = Date.now() - startRef.current;
      const left = Math.max(0, durationMs - elapsed);
      setRemaining(left);
      if (left <= 0 && !firedRef.current) {
        firedRef.current = true;
        onTimeout?.();
      }
    }, intervalMs);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, durationMs, intervalMs]);

  useEffect(() => {
    if (!running) {
      startRef.current = null;
    }
  }, [running]);

  return {
    remainingMs: remaining,
    elapsedMs: durationMs - remaining,
    progress: durationMs > 0 ? remaining / durationMs : 0,
  };
};
