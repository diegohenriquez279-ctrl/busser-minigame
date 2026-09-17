import { TIMER_THRESHOLDS } from '../game/constants';
import { formatTime } from '../game/format';
import '../styles/SemaphoreTimer.css';

type Light = 'green' | 'yellow' | 'red';

export function lightFor(fraction: number): Light {
  if (fraction <= TIMER_THRESHOLDS.red) return 'red';
  if (fraction <= TIMER_THRESHOLDS.yellow) return 'yellow';
  return 'green';
}

export function SemaphoreTimer({ remainingMs, totalMs }: { remainingMs: number; totalMs: number }) {
  const fraction = totalMs > 0 ? remainingMs / totalMs : 0;
  const light = lightFor(fraction);

  return (
    <div className={`timer timer--${light}`} role="timer" aria-label={`Tiempo restante ${formatTime(remainingMs)}`}>
      <div className="timer__lights" aria-hidden="true">
        {(['green', 'yellow', 'red'] as const).map((l) => (
          <span key={l} className={`timer__light timer__light--${l} ${l === light ? 'is-on' : ''}`} />
        ))}
      </div>
      <div className="timer__readout">
        <span className="timer__time">{formatTime(remainingMs)}</span>
        <span className="timer__bar" aria-hidden="true">
          <span className="timer__fill" style={{ width: `${fraction * 100}%` }} />
        </span>
      </div>
    </div>
  );
}
