import { PASS_THRESHOLD, ROUND_SECONDS, TOOL_ORDER } from '../game/constants';
import { STEPS } from '../game/steps';
import { ToolIcon } from './ToolIcon';
import '../styles/StartScreen.css';

export function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <main className="start">
      <div className="start__card">
        <div className="start__icons" aria-hidden="true">
          {TOOL_ORDER.map((id) => (
            <ToolIcon key={id} id={id} />
          ))}
        </div>
        <span className="chip">Servicio</span>
        <h1 className="start__title">Busser</h1>
        <p className="start__goal">
          Un cliente acaba de irse. Limpia y monta la mesa para los siguientes.
        </p>
        <ul className="start__rules">
          <li>
            Sigue los <b>{STEPS.length} pasos</b> en orden.
          </li>
          <li>Toca una herramienta y luego dónde usarla.</li>
          <li>
            <span className="swatch swatch--white" /> Toalla blanca: mesa y condimentos ·{' '}
            <span className="swatch swatch--green" /> verde: sillas ·{' '}
            <span className="swatch swatch--blue" /> Virex: mesa.
          </li>
          <li>
            Tienes {ROUND_SECONDS} s. Apruebas con {PASS_THRESHOLD}%.
          </li>
        </ul>
        <button type="button" className="btn btn-primary start__cta" onClick={onStart}>
          Comenzar
        </button>
      </div>
    </main>
  );
}
