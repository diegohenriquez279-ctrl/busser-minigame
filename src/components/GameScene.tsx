import type { ReactNode } from 'react';
import { TRASH_ITEMS } from '../game/constants';
import { targetKey } from '../game/engine';
import { STEPS } from '../game/steps';
import type { CaddyLocation, GameState, Side, Target } from '../game/types';
import '../styles/GameScene.css';

/** Coordenadas en % del lienzo cuadrado (vista desde arriba). */
type Pos = { x: number; y: number };
type Size = { w: number; h: number };

const TABLE: Pos & Size = { x: 50, y: 50, w: 44, h: 40 };
const SEATS: Pos[] = [
  { x: 50, y: 21 },
  { x: 81, y: 50 },
  { x: 50, y: 79 },
  { x: 19, y: 50 },
];
/** Rotación para que el respaldo quede hacia afuera de la mesa. */
const SEAT_ROTATION = [0, 90, 180, 270];
/** Dónde queda cada silla cuando está corrida (según su lugar original). */
const DISPLACED: Pos[] = [
  { x: 79, y: 12 },
  { x: 89, y: 81 },
  { x: 31, y: 90 },
  { x: 11, y: 73 },
];
const DISPLACED_TILT = [28, -22, 18, -30];
const CHAIR_SIZE: Size = { w: 15, h: 15 };
const CHAIR_COLORS = ['#6d4c41', '#495057', '#6d4c41', '#495057'];

const HOLDING: Pos & Size = { x: 17, y: 12, w: 30, h: 21 };
const CADDY_POS: Record<CaddyLocation, Pos> = {
  table: { x: 39, y: 43 },
  holding: { x: 17, y: 10 },
  tableEnd: { x: 50, y: 50 },
};
const CADDY_SIZE: Size = { w: 19, h: 12 };
// Al centro: los bordes de la mesa quedan libres para los cubiertos de cada lugar.
const TABLE_END: Pos = { x: 50, y: 50 };

/**
 * Lados de cada lugar vistos por quien se sienta mirando la mesa.
 * Arriba mira al sur (su izquierda es el este); derecha mira al oeste (izquierda al sur);
 * abajo mira al norte (izquierda al oeste); izquierda mira al este (izquierda al norte).
 */
const CUTLERY_SLOTS: Record<Side, Pos>[] = [
  { left: { x: 57, y: 35 }, right: { x: 43, y: 35 } },
  { left: { x: 67, y: 56 }, right: { x: 67, y: 44 } },
  { left: { x: 43, y: 65 }, right: { x: 57, y: 65 } },
  { left: { x: 33, y: 44 }, right: { x: 33, y: 56 } },
];
const CUTLERY_SIZE: Size[] = [
  { w: 11, h: 9 },
  { w: 9, h: 10 },
  { w: 11, h: 9 },
  { w: 9, h: 10 },
];
const SIDES: Side[] = ['left', 'right'];
const RESTOCK: Pos & Size = { x: 18, y: 31, w: 34, h: 10 };
const TRASH_POS: Pos[] = [
  { x: 58, y: 39 },
  { x: 62, y: 59 },
  { x: 44, y: 60 },
];
const TRASH_SIZE: Size = { w: 13, h: 13 };

interface Props {
  state: GameState;
  disabled: boolean;
  onTap: (target: Target) => void;
}

export function GameScene({ state, disabled, onTap }: Props) {
  const { scene, selection, feedback, stepIndex } = state;
  const selectedKey = selection ? targetKey(selection) : null;
  const occupiedSeats = new Set(scene.chairs.map((c) => c.seat));

  const tappable = (
    target: Target,
    pos: Pos,
    size: Size,
    label: string,
    visualClass: string,
    children?: ReactNode,
    compact = false,
  ) => {
    const key = targetKey(target);
    const shake = feedback?.kind === 'error' && feedback.targetKey === key ? feedback.nonce : 0;
    const selected = selectedKey === key;
    return (
      <button
        key={key}
        type="button"
        className={`obj ${compact ? 'obj--compact' : ''} ${selected ? 'obj--selected' : ''}`}
        style={{ left: `${pos.x}%`, top: `${pos.y}%`, width: `${size.w}%`, height: `${size.h}%` }}
        aria-label={label}
        aria-pressed={selected}
        disabled={disabled}
        onClick={() => onTap(target)}
      >
        <span key={shake} className={`obj__inner ${visualClass} ${shake ? 'shake' : ''}`}>
          {children}
        </span>
      </button>
    );
  };

  const cutleryStepActive = STEPS[stepIndex].actions.some((a) => a.target === 'cutlerySlot');

  const tableState =scene.tableDried ? 'table--clean' : scene.tableVirex ? 'table--virex' : 'table--dirty';

  return (
    <div className="scene" role="group" aria-label="Mesa a limpiar">
      {tappable({ kind: 'holding' }, HOLDING, HOLDING, 'Área de espera', 'zone', (
        <span className="zone__label">Área de espera</span>
      ))}

      {tappable({ kind: 'table' }, TABLE, TABLE, 'Mesa', `table ${tableState}`, (
        scene.tableVirex && !scene.tableDried ? <span className="table__drops">💧 💧</span> : null
      ))}

      {SEATS.map((pos, id) =>
        occupiedSeats.has(id)
          ? null
          : tappable({ kind: 'seat', id }, pos, CHAIR_SIZE, `Lugar libre ${id + 1}`, 'seat'),
      )}

      {scene.caddy === 'holding' &&
        tappable({ kind: 'tableEnd' }, TABLE_END, CADDY_SIZE, 'Lugar de los condimentos en la mesa', 'slot', (
          <span className="slot__label">Condimentos</span>
        ))}

      {scene.cutlery.map((placed, id) =>
        placed ? (
          <span
            key={`cutlery-${id}`}
            className="cutlery"
            style={{
              left: `${CUTLERY_SLOTS[id].left.x}%`,
              top: `${CUTLERY_SLOTS[id].left.y}%`,
              width: `${CUTLERY_SIZE[id].w}%`,
              height: `${CUTLERY_SIZE[id].h}%`,
            }}
            aria-label={`Cubiertos del lugar ${id + 1}`}
            role="img"
          >
            🍴
          </span>
        ) : (
          cutleryStepActive &&
          SIDES.map((side) =>
            tappable(
              { kind: 'cutlerySlot', id, side },
              CUTLERY_SLOTS[id][side],
              CUTLERY_SIZE[id],
              `Lugar ${id + 1}, lado ${side === 'left' ? 'A' : 'B'}`,
              'slot cutlery-slot',
              undefined,
              true,
            ),
          )
        ),
      )}

      {scene.trash.map((onTable, id) =>
        onTable
          ? tappable({ kind: 'trash', id }, TRASH_POS[id], TRASH_SIZE, TRASH_ITEMS[id].label, 'trash', (
              <span aria-hidden="true">{TRASH_ITEMS[id].emoji}</span>
            ))
          : null,
      )}

      {tappable(
        { kind: 'caddy' },
        CADDY_POS[scene.caddy],
        CADDY_SIZE,
        'Porta-condimentos',
        `caddy ${scene.condimentsCleaned ? '' : 'caddy--dirty'}`,
        <>
          <span aria-hidden="true">🧂🌶️</span>
          {scene.condimentsCleaned && <span className="badge" aria-hidden="true">✨</span>}
          {scene.condimentsRestocked && <span className="badge badge--left" aria-hidden="true">✓</span>}
        </>,
      )}

      {stepIndex === 2 &&
        tappable({ kind: 'restock' }, RESTOCK, RESTOCK, 'Confirmar reabastecido', `restock ${scene.condimentsCleaned ? 'restock--ready' : ''}`, (
          <>Reabastecido {scene.condimentsRestocked ? '✓' : '?'}</>
        ))}

      {scene.chairs.map((chair) => {
        const pos = chair.seat === null ? DISPLACED[chair.id] : SEATS[chair.seat];
        const rotation =
          chair.seat === null
            ? SEAT_ROTATION[chair.id] + DISPLACED_TILT[chair.id]
            : SEAT_ROTATION[chair.seat];
        return tappable(
          { kind: 'chair', id: chair.id },
          pos,
          CHAIR_SIZE,
          `Silla ${chair.id + 1}${chair.cleaned ? ', limpia' : ', sucia'}${chair.seat === null ? ', fuera de lugar' : ''}`,
          'chair-wrap',
          <>
            <span
              className={`chair ${chair.cleaned ? '' : 'chair--dirty'}`}
              style={{ transform: `rotate(${rotation}deg)`, background: CHAIR_COLORS[chair.id] }}
            />
            {chair.cleaned && <span className="badge" aria-hidden="true">✨</span>}
          </>,
        );
      })}
    </div>
  );
}
