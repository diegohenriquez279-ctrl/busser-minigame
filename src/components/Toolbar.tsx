import { TOOL_LABELS, TOOL_ORDER, TRASH_ITEMS } from '../game/constants';
import { targetKey } from '../game/engine';
import type { Feedback, Selection, Target } from '../game/types';
import { ToolIcon } from './ToolIcon';
import '../styles/Toolbar.css';

interface Props {
  selection: Selection | null;
  feedback: Feedback | null;
  disabled: boolean;
  onTap: (target: Target) => void;
}

function describe(sel: Selection): string {
  switch (sel.kind) {
    case 'tool':
      return TOOL_LABELS[sel.id];
    case 'trash':
      return TRASH_ITEMS[sel.id].label;
    case 'caddy':
      return 'Condimentos';
    case 'chair':
      return `Silla ${sel.id + 1}`;
  }
}

export function Toolbar({ selection, feedback, disabled, onTap }: Props) {
  return (
    <nav className="toolbar" aria-label="Herramientas">
      <p className="toolbar__status" aria-live="polite">
        {selection ? (
          <>
            En la mano: <b>{describe(selection)}</b> — toca dónde usarlo
          </>
        ) : (
          'Toca una herramienta u objeto'
        )}
      </p>
      <div className="toolbar__grid">
        {TOOL_ORDER.map((id) => {
          const target: Target = { kind: 'tool', id };
          const selected = selection?.kind === 'tool' && selection.id === id;
          const shake =
            feedback?.kind === 'error' && feedback.targetKey === targetKey(target) ? feedback.nonce : 0;
          return (
            <button
              key={id}
              type="button"
              className={`tool ${selected ? 'tool--selected' : ''}`}
              aria-pressed={selected}
              disabled={disabled}
              onClick={() => onTap(target)}
            >
              <span key={shake} className={`tool__icon ${shake ? 'shake' : ''}`}>
                <ToolIcon id={id} />
              </span>
              <span className="tool__label">{TOOL_LABELS[id]}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
