import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { COUNTDOWN_MS, DIFFICULTY } from '../constants/difficulty';
import { computeAllowedMs } from '../services/dynamicDifficulty';
import { generateOperation } from '../services/operationGenerator';
import { scoreAnswer } from '../services/scoring';
import { useSettingsStore } from '../store/settingsStore';
import { useStatsStore } from '../store/statsStore';
import type {
  Answer,
  Difficulty,
  GameMode,
  GameSession,
  Operation,
} from '../types/game';
import { uid } from '../utils/id';
import { useHaptics } from './useHaptics';
import { useSounds } from './useSounds';

export type FeedbackKind = 'correct' | 'wrong' | 'timeout' | null;
export type EngineStatus = 'idle' | 'playing' | 'feedback' | 'finished';

export interface EngineSnapshot {
  status: EngineStatus;
  mode: GameMode;
  difficulty: Difficulty;
  iterations: number;
  index: number;
  current: Operation | null;
  allowedMs: number;
  remainingMs: number;
  globalRemainingMs: number;
  score: number;
  streak: number;
  maxStreak: number;
  correct: number;
  incorrect: number;
  timeouts: number;
  answersGiven: number;
  feedback: FeedbackKind;
  lastSession: GameSession | null;
}

export interface EngineActions {
  submitAnswer: (given: number | null) => void;
  skip: () => void;
  abort: () => void;
}

const isCountdownMode = (mode: GameMode) => mode === 'contra_reloj';
const FEEDBACK_DELAY = 650;

interface InternalState {
  answers: Answer[];
  score: number;
  streak: number;
  maxStreak: number;
  current: Operation | null;
  allowedMs: number;
  finished: boolean;
}

export const useGameEngine = (): EngineSnapshot & EngineActions => {
  const mode = useSettingsStore((s) => s.mode);
  const difficulty = useSettingsStore((s) => s.difficulty);
  const iterations = useSettingsStore((s) => s.iterations);
  const dynamic = useSettingsStore((s) => s.dynamic);
  const addSession = useStatsStore((s) => s.addSession);
  const { trigger: haptic } = useHaptics();
  const { play } = useSounds();

  const baseMs = DIFFICULTY[difficulty].allowedMs;

  // Render state (lo que la UI lee)
  const [status, setStatus] = useState<EngineStatus>('idle');
  const [current, setCurrent] = useState<Operation | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackKind>(null);
  const [lastSession, setLastSession] = useState<GameSession | null>(null);
  const [globalRemaining, setGlobalRemaining] = useState(COUNTDOWN_MS);
  const [allowedMs, setAllowedMsState] = useState(baseMs);
  const [remainingMs, setRemainingMs] = useState(baseMs);

  // Estado autoritativo (para timers / closures)
  const stateRef = useRef<InternalState>({
    answers: [],
    score: 0,
    streak: 0,
    maxStreak: 0,
    current: null,
    allowedMs: baseMs,
    finished: false,
  });

  const startedAtRef = useRef<number>(Date.now());
  const operationStartRef = useRef<number>(Date.now());
  const operationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const globalTickerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopOperationTimers = useCallback(() => {
    if (operationTimerRef.current) {
      clearTimeout(operationTimerRef.current);
      operationTimerRef.current = null;
    }
    if (tickerRef.current) {
      clearInterval(tickerRef.current);
      tickerRef.current = null;
    }
  }, []);

  const stopGlobalTimer = useCallback(() => {
    if (globalTickerRef.current) {
      clearInterval(globalTickerRef.current);
      globalTickerRef.current = null;
    }
  }, []);

  const stopFeedbackTimer = useCallback(() => {
    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }
  }, []);

  const stopAllTimers = useCallback(() => {
    stopOperationTimers();
    stopGlobalTimer();
    stopFeedbackTimer();
  }, [stopOperationTimers, stopGlobalTimer, stopFeedbackTimer]);

  // Las acciones críticas viven en refs para que setTimeout/setInterval siempre
  // ejecuten la versión actual, sin closures stale.
  const advanceRef = useRef<(nextIndex: number) => void>(() => undefined);
  const handleOutcomeRef = useRef<(given: number | null, timedOut: boolean) => void>(
    () => undefined,
  );
  const finalizeRef = useRef<() => void>(() => undefined);

  // --- finalize
  finalizeRef.current = () => {
    const s = stateRef.current;
    if (s.finished) return;
    s.finished = true;
    stopAllTimers();

    const finalAnswers = s.answers;
    const finalScore = s.score;
    const finalMaxStreak = s.maxStreak;

    const correctCount = finalAnswers.filter((a) => a.correct).length;
    const incorrectCount = finalAnswers.filter((a) => !a.correct && !a.timedOut).length;
    const timeoutCount = finalAnswers.filter((a) => a.timedOut).length;
    const answeredTimes = finalAnswers.filter((a) => !a.timedOut).map((a) => a.timeMs);
    const avgTimeMs =
      answeredTimes.length > 0
        ? answeredTimes.reduce((sum, v) => sum + v, 0) / answeredTimes.length
        : 0;
    const accuracy = finalAnswers.length > 0 ? correctCount / finalAnswers.length : 0;

    const session: GameSession = {
      id: uid('ses'),
      mode,
      difficulty,
      iterations: isCountdownMode(mode) ? finalAnswers.length : iterations,
      startedAt: startedAtRef.current,
      finishedAt: Date.now(),
      answers: finalAnswers,
      score: Math.max(0, finalScore),
      accuracy,
      avgTimeMs,
      correct: correctCount,
      incorrect: incorrectCount,
      timeouts: timeoutCount,
      maxStreak: finalMaxStreak,
    };
    addSession(session);
    setLastSession(session);
    setStatus('finished');
    void play('finish');
  };

  // --- advance
  advanceRef.current = (nextIndex: number) => {
    if (stateRef.current.finished) return;
    setStatus('playing');
    setFeedback(null);
    const ms = computeAllowedMs(baseMs, nextIndex, dynamic);
    stateRef.current.allowedMs = ms;
    setAllowedMsState(ms);
    setRemainingMs(ms);

    const op = generateOperation(difficulty, mode);
    stateRef.current.current = op;
    setCurrent(op);
    operationStartRef.current = Date.now();

    stopOperationTimers();
    const start = Date.now();
    tickerRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const left = Math.max(0, ms - elapsed);
      setRemainingMs(left);
      if (left <= 0 && tickerRef.current) {
        clearInterval(tickerRef.current);
        tickerRef.current = null;
      }
    }, 50);

    operationTimerRef.current = setTimeout(() => {
      handleOutcomeRef.current(null, true);
    }, ms);
  };

  // --- handleOutcome
  handleOutcomeRef.current = (given: number | null, timedOut: boolean) => {
    stopOperationTimers();
    const s = stateRef.current;
    if (s.finished || !s.current) return;
    const op = s.current;
    const allowed = s.allowedMs;
    const timeMs = Date.now() - operationStartRef.current;

    let correct = false;
    if (!timedOut && given !== null) {
      if (mode === 'verdadero_falso') {
        const userSaysTrue = given === 1;
        correct = userSaysTrue === !!op.proposedIsCorrect;
      } else {
        correct = given === op.result;
      }
    }
    const delta = scoreAnswer({ correct, timedOut, timeMs, allowedMs: allowed });
    const answer: Answer = {
      operationId: op.id,
      given,
      correct,
      timedOut,
      timeMs: timedOut ? allowed : timeMs,
      allowedMs: allowed,
      score: delta,
    };

    s.answers = [...s.answers, answer];
    s.score = s.score + delta;
    s.streak = correct ? s.streak + 1 : 0;
    s.maxStreak = Math.max(s.maxStreak, s.streak);

    setAnswers(s.answers);
    setScore(s.score);
    setStreak(s.streak);
    setMaxStreak(s.maxStreak);
    setStatus('feedback');
    setFeedback(timedOut ? 'timeout' : correct ? 'correct' : 'wrong');

    if (timedOut) {
      haptic('warning');
      void play('timeout');
    } else if (correct) {
      haptic('success');
      void play('correct');
    } else {
      haptic('error');
      void play('wrong');
    }

    stopFeedbackTimer();
    feedbackTimerRef.current = setTimeout(() => {
      const cur = stateRef.current;
      if (cur.finished) return;
      if (isCountdownMode(mode)) {
        advanceRef.current(cur.answers.length);
        return;
      }
      if (cur.answers.length >= iterations) {
        finalizeRef.current();
      } else {
        advanceRef.current(cur.answers.length);
      }
    }, FEEDBACK_DELAY);
  };

  // Bootstrap (corre una vez al montar)
  useEffect(() => {
    stateRef.current = {
      answers: [],
      score: 0,
      streak: 0,
      maxStreak: 0,
      current: null,
      allowedMs: baseMs,
      finished: false,
    };
    startedAtRef.current = Date.now();

    setStatus('playing');
    setAnswers([]);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setFeedback(null);
    setLastSession(null);
    setGlobalRemaining(COUNTDOWN_MS);

    advanceRef.current(0);

    if (isCountdownMode(mode)) {
      const start = Date.now();
      globalTickerRef.current = setInterval(() => {
        const left = Math.max(0, COUNTDOWN_MS - (Date.now() - start));
        setGlobalRemaining(left);
        if (left <= 0) {
          finalizeRef.current();
        }
      }, 100);
    }

    return () => {
      stateRef.current.finished = true;
      stopAllTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitAnswer = useCallback((given: number | null) => {
    if (stateRef.current.finished) return;
    handleOutcomeRef.current(given, false);
  }, []);

  const skip = useCallback(() => {
    if (stateRef.current.finished) return;
    handleOutcomeRef.current(null, true);
  }, []);

  const abort = useCallback(() => {
    stateRef.current.finished = true;
    stopAllTimers();
    setStatus('idle');
  }, [stopAllTimers]);

  const correctCount = useMemo(() => answers.filter((a) => a.correct).length, [answers]);
  const incorrectCount = useMemo(
    () => answers.filter((a) => !a.correct && !a.timedOut).length,
    [answers],
  );
  const timeoutCount = useMemo(() => answers.filter((a) => a.timedOut).length, [answers]);

  return {
    status,
    mode,
    difficulty,
    iterations: isCountdownMode(mode) ? 0 : iterations,
    index: answers.length,
    current,
    allowedMs,
    remainingMs,
    globalRemainingMs: globalRemaining,
    score: Math.max(0, score),
    streak,
    maxStreak,
    correct: correctCount,
    incorrect: incorrectCount,
    timeouts: timeoutCount,
    answersGiven: answers.length,
    feedback,
    lastSession,
    submitAnswer,
    skip,
    abort,
  };
};
