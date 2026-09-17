import { CHAIR_COUNT, TRASH_ITEMS } from './constants';
import {
  ALLOWED_TOOLS,
  CUTLERY_SIDE_MESSAGE,
  colorErrorMessage,
  isCleaningTool,
  surfaceOf,
} from './rules';
import { STEPS, findAction } from './steps';
import type { FeedbackKind, GameState, Selection, Source, Target } from './types';

export type GameAction = { type: 'tap'; target: Target } | { type: 'clearFeedback'; nonce: number };

export function createInitialState(): GameState {
  return {
    scene: {
      caddy: 'table',
      condimentsCleaned: false,
      condimentsRestocked: false,
      trash: TRASH_ITEMS.map(() => true),
      tableVirex: false,
      tableDried: false,
      cutlery: Array.from({ length: CHAIR_COUNT }, () => false),
      chairs: Array.from({ length: CHAIR_COUNT }, (_, id) => ({ id, seat: null, cleaned: false })),
    },
    stepIndex: 0,
    selection: null,
    colorErrors: 0,
    orderErrors: 0,
    placementErrors: 0,
    feedback: null,
    finished: false,
    nonce: 0,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'tap':
      return tap(state, action.target);
    case 'clearFeedback':
      return state.feedback?.nonce === action.nonce ? { ...state, feedback: null } : state;
  }
}

export function targetKey(t: Target): string {
  if (t.kind === 'cutlerySlot') return `${t.kind}:${t.id}:${t.side}`;
  return 'id' in t ? `${t.kind}:${t.id}` : t.kind;
}

function toSelection(t: Target): Selection | null {
  switch (t.kind) {
    case 'tool':
    case 'trash':
    case 'caddy':
    case 'chair':
      return t;
    default:
      return null;
  }
}

function sourceOf(sel: Selection | null): Source {
  if (!sel) return 'hand';
  return sel.kind === 'tool' ? sel.id : sel.kind;
}

function withFeedback(
  state: GameState,
  kind: FeedbackKind,
  message: string,
  target?: Target,
): GameState {
  const nonce = state.nonce + 1;
  return {
    ...state,
    nonce,
    feedback: { kind, message, nonce, targetKey: target ? targetKey(target) : undefined },
  };
}

function tap(state: GameState, target: Target): GameState {
  if (state.finished) return state;
  const sel = state.selection;

  // El botón "Reabastecido" es un tap directo, sin importar lo que haya en la mano.
  if (target.kind === 'restock') return perform(state, null, target);

  if (sel && targetKey(sel) === targetKey(target)) return { ...state, selection: null };

  if (!sel) {
    const ctx = { scene: state.scene, target, selection: null };
    if (STEPS.some((step) => findAction(step, 'hand', ctx))) return perform(state, null, target);
    return select(state, target);
  }

  // Basura ↔ jaba funciona en ambos órdenes.
  if (sel.kind === 'tool' && sel.id === 'busTub' && target.kind === 'trash') {
    return perform({ ...state, selection: target }, target, { kind: 'tool', id: 'busTub' });
  }
  if (sel.kind === 'trash' && target.kind === 'tool' && target.id === 'busTub') {
    return perform(state, sel, target);
  }

  if (target.kind === 'tool') return select(state, target);

  // Con un objeto en la mano, tocar otro objeto equivale a empezar de nuevo con ese.
  if (sel.kind !== 'tool' && toSelection(target)) return tap({ ...state, selection: null }, target);

  return perform(state, sel, target);
}

function select(state: GameState, target: Target): GameState {
  const selection = toSelection(target);
  if (!selection) {
    return withFeedback(state, 'info', 'Primero toca una herramienta o un objeto.', target);
  }
  if (selection.kind === 'caddy' && state.scene.caddy === 'tableEnd') {
    return withFeedback({ ...state, selection: null }, 'info', 'Los condimentos ya están en su lugar.', target);
  }
  return { ...state, selection };
}

function perform(state: GameState, sel: Selection | null, target: Target): GameState {
  const source = sourceOf(sel);
  const step = STEPS[state.stepIndex];
  const ctx = { scene: state.scene, target, selection: sel };
  const dropObject = (s: GameState): GameState =>
    sel && sel.kind !== 'tool' ? { ...s, selection: null } : s;

  // 1. Código de color: se valida antes que nada porque es el aprendizaje clave.
  if (isCleaningTool(source)) {
    const surface = surfaceOf(target);
    if (surface && !ALLOWED_TOOLS[surface].includes(source)) {
      return withFeedback(
        { ...state, colorErrors: state.colorErrors + 1 },
        'error',
        colorErrorMessage(source, surface),
        target,
      );
    }
  }
  if (source === 'busTub' && target.kind !== 'trash') {
    return withFeedback(state, 'info', 'La jaba superior es para depositar la basura.', target);
  }
  if (source === 'cutlery' && target.kind !== 'cutlerySlot') {
    return withFeedback(state, 'info', 'Los cubiertos van sobre la mesa, a mano izquierda de cada silla.', target);
  }
  // Lado de los cubiertos: igual que el color, es una regla que se aprende y se penaliza.
  if (source === 'cutlery' && target.kind === 'cutlerySlot' && target.side === 'right') {
    return withFeedback(
      { ...state, placementErrors: state.placementErrors + 1 },
      'error',
      CUTLERY_SIDE_MESSAGE,
      target,
    );
  }
  if (target.kind === 'restock' && !state.scene.condimentsCleaned) {
    return withFeedback(state, 'info', 'Primero limpia los condimentos con la toalla blanca.', target);
  }

  // 2. ¿Es una acción del paso actual?
  const action = findAction(step, source, ctx);
  if (action) {
    const scene = action.apply(ctx);
    let next: GameState = { ...state, scene };
    if (step.isComplete(scene)) {
      const isLast = state.stepIndex === STEPS.length - 1;
      next = {
        ...next,
        selection: null,
        stepIndex: isLast ? state.stepIndex : state.stepIndex + 1,
        finished: isLast,
      };
      return withFeedback(
        next,
        'success',
        isLast
          ? `¡Mesa lista! Completaste los ${STEPS.length} pasos.`
          : `¡Paso ${step.number} completado!`,
      );
    }
    return withFeedback(dropObject(next), 'success', action.success);
  }

  // 3. ¿Es correcta pero le toca a otro paso?
  if (STEPS.some((s, i) => i !== state.stepIndex && findAction(s, source, ctx))) {
    return withFeedback(
      dropObject({ ...state, orderErrors: state.orderErrors + 1 }),
      'error',
      `Todavía no. Primero completa el paso ${step.number}.`,
      target,
    );
  }

  // 4. No corresponde: sin penalización. Si tocó un objeto con una herramienta, lo toma.
  const message = 'Eso no corresponde ahora. Revisa la instrucción del paso.';
  const picked = toSelection(target);
  if (sel?.kind === 'tool' && picked) {
    return withFeedback(select({ ...state, selection: null }, target), 'info', message, target);
  }
  return withFeedback(dropObject(state), 'info', message, target);
}
