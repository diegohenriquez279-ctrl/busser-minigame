import { PASS_THRESHOLD, PENALTIES, SCORE_WEIGHTS } from './constants';

export interface RoundStats {
  stepsCompleted: number;
  totalSteps: number;
  colorErrors: number;
  orderErrors: number;
  placementErrors: number;
  remainingMs: number;
  totalMs: number;
  /** false = se acabó el tiempo antes de terminar. */
  completed: boolean;
}

export interface RoundResult extends RoundStats {
  score: number;
  passed: boolean;
  breakdown: { steps: number; accuracy: number; time: number };
  timeUsedMs: number;
}

export function computeResult(stats: RoundStats): RoundResult {
  const steps = Math.round((SCORE_WEIGHTS.steps * stats.stepsCompleted) / stats.totalSteps);
  const accuracy = Math.max(
    0,
    SCORE_WEIGHTS.accuracy -
      stats.colorErrors * PENALTIES.color -
      stats.placementErrors * PENALTIES.placement -
      stats.orderErrors * PENALTIES.order,
  );
  // El bono de tiempo solo cuenta si se completó la mesa.
  const time = stats.completed
    ? Math.round((SCORE_WEIGHTS.time * stats.remainingMs) / stats.totalMs)
    : 0;
  const score = Math.min(100, steps + accuracy + time);

  return {
    ...stats,
    score,
    passed: score >= PASS_THRESHOLD,
    breakdown: { steps, accuracy, time },
    timeUsedMs: stats.totalMs - stats.remainingMs,
  };
}
