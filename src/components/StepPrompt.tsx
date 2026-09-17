import type { ReactNode } from 'react';
import { STEPS } from '../game/steps';
import type { SceneState } from '../game/types';
import '../styles/StepPrompt.css';

interface Props {
  stepIndex: number;
  finished: boolean;
  scene: SceneState;
  timer: ReactNode;
}

/** Contexto siempre presente: número de paso, instrucción exacta, cómo hacerlo y avance. */
export function StepPrompt({ stepIndex, finished, scene, timer }: Props) {
  const step = STEPS[stepIndex];

  return (
    <header className="prompt">
      <div className="prompt__top">
        <span className="prompt__step">
          Paso {step.number} de {STEPS.length}
        </span>
        {timer}
      </div>
      <div className="prompt__dots" aria-hidden="true">
        {STEPS.map((s, i) => {
          const state = i < stepIndex || finished ? 'done' : i === stepIndex ? 'current' : '';
          return <span key={s.number} className={`prompt__dot ${state}`} />;
        })}
      </div>
      <h2 className="prompt__title" aria-live="polite">
        {step.title}
      </h2>
      <p className="prompt__hint">{step.hint}</p>
      <p className="prompt__progress">{step.progress(scene)}</p>
    </header>
  );
}
