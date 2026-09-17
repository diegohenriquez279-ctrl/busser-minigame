import { useCallback, useEffect, useReducer, useState } from 'react';
import { FEEDBACK_MS, FINISH_DELAY_MS, ROUND_SECONDS } from '../game/constants';
import { createInitialState, gameReducer } from '../game/engine';
import { computeResult, type RoundResult } from '../game/scoring';
import { STEPS } from '../game/steps';
import type { Target } from '../game/types';
import { useCountdown } from '../hooks/useCountdown';
import { GameScene } from './GameScene';
import { SemaphoreTimer } from './SemaphoreTimer';
import { StepPrompt } from './StepPrompt';
import { Toolbar } from './Toolbar';
import '../styles/GameScreen.css';

const TOTAL_MS = ROUND_SECONDS * 1000;

export function GameScreen({ onFinish }: { onFinish: (result: RoundResult) => void }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  const [timedOut, setTimedOut] = useState(false);
  const running = !state.finished && !timedOut;
  const remainingMs = useCountdown(TOTAL_MS, running, useCallback(() => setTimedOut(true), []));

  const onTap = useCallback((target: Target) => dispatch({ type: 'tap', target }), []);

  useEffect(() => {
    if (!state.feedback) return;
    const nonce = state.feedback.nonce;
    const id = window.setTimeout(() => dispatch({ type: 'clearFeedback', nonce }), FEEDBACK_MS);
    return () => window.clearTimeout(id);
  }, [state.feedback]);

  useEffect(() => {
    if (running) return;
    const result = computeResult({
      stepsCompleted: state.finished ? STEPS.length : state.stepIndex,
      totalSteps: STEPS.length,
      colorErrors: state.colorErrors,
      orderErrors: state.orderErrors,
      placementErrors: state.placementErrors,
      remainingMs: state.finished ? remainingMs : 0,
      totalMs: TOTAL_MS,
      completed: state.finished,
    });
    const id = window.setTimeout(() => onFinish(result), FINISH_DELAY_MS);
    return () => window.clearTimeout(id);
    // Solo al terminar la ronda; en ese momento el resto de valores ya está congelado.
  }, [running]);

  const feedback = state.feedback;

  return (
    <div className="game">
      <StepPrompt
        stepIndex={state.stepIndex}
        finished={state.finished}
        scene={state.scene}
        timer={<SemaphoreTimer remainingMs={remainingMs} totalMs={TOTAL_MS} />}
      />

      <div
        className={`feedback ${feedback ? `feedback--${feedback.kind}` : 'feedback--idle'}`}
        role="status"
        aria-live="polite"
      >
        {feedback ? feedback.message : 'Sigue la instrucción del paso.'}
      </div>

      <div className="scene-wrap">
        <GameScene state={state} disabled={!running} onTap={onTap} />
        {!running && (
          <div className="scene-overlay">
            <span>{state.finished ? '¡Mesa lista! 🎉' : '⏰ ¡Se acabó el tiempo!'}</span>
          </div>
        )}
      </div>

      <Toolbar selection={state.selection} feedback={feedback} disabled={!running} onTap={onTap} />
    </div>
  );
}
