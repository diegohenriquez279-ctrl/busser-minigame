import { PASS_THRESHOLD, SCORE_WEIGHTS } from '../game/constants';
import { formatTime } from '../game/format';
import type { RoundResult } from '../game/scoring';
import '../styles/ResultScreen.css';

interface Props {
  result: RoundResult;
  onRetry: () => void;
  onHome: () => void;
}

function messageFor(r: RoundResult): string {
  if (r.passed) {
    return r.colorErrors === 0 && r.orderErrors === 0 && r.placementErrors === 0
      ? 'Mesa impecable, en orden y con el código de color correcto.'
      : 'Buen trabajo. Repasa los detalles y la próxima será perfecta.';
  }
  if (!r.completed) return 'Se acabó el tiempo. Practica otra vez: cada ronda te sale más rápido.';
  if (r.colorErrors > 0) return 'Estás cerca. Repasa el color: blanca para mesa y condimentos, verde para sillas.';
  if (r.placementErrors > 0) return 'Estás cerca. Recuerda: los cubiertos van a mano izquierda de cada silla.';
  return 'Estás cerca. Repasa el orden de los pasos e inténtalo de nuevo.';
}

export function ResultScreen({ result, onRetry, onHome }: Props) {
  const { score, passed, breakdown } = result;

  return (
    <main className="result">
      <div className="result__card">
        <div
          className={`result__ring ${passed ? 'is-pass' : 'is-fail'}`}
          style={{ ['--pct' as string]: `${score}%` }}
          role="img"
          aria-label={`Puntaje ${score} de 100`}
        >
          <span className="result__score">{score}%</span>
        </div>

        <h1 className="result__title">{passed ? '¡Aprobado!' : 'Aún no aprobado'}</h1>
        <p className="result__msg">{messageFor(result)}</p>

        <dl className="result__stats">
          <div className="wide">
            <dt>Tiempo</dt>
            <dd>{formatTime(result.timeUsedMs)}</dd>
          </div>
          <div className="wide">
            <dt>Pasos</dt>
            <dd>
              {result.stepsCompleted}/{result.totalSteps}
            </dd>
          </div>
          <div>
            <dt>Errores de color</dt>
            <dd>{result.colorErrors}</dd>
          </div>
          <div>
            <dt>Errores de ubicación</dt>
            <dd>{result.placementErrors}</dd>
          </div>
          <div>
            <dt>Errores de orden</dt>
            <dd>{result.orderErrors}</dd>
          </div>
        </dl>

        <p className="result__breakdown">
          Pasos {breakdown.steps}/{SCORE_WEIGHTS.steps} · Herramientas {breakdown.accuracy}/
          {SCORE_WEIGHTS.accuracy} · Tiempo {breakdown.time}/{SCORE_WEIGHTS.time}
          <br />
          Se aprueba con {PASS_THRESHOLD}%.
        </p>

        <div className="result__actions">
          <button type="button" className="btn btn-primary" onClick={onRetry}>
            Reintentar
          </button>
          <button type="button" className="btn btn-secondary" onClick={onHome}>
            Volver al inicio
          </button>
        </div>
      </div>
    </main>
  );
}
