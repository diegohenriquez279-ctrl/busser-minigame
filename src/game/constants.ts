import type { ToolId } from './types';

/** Duración de la ronda. Ajustable. */
export const ROUND_SECONDS = 120;

/** Porcentaje mínimo para aprobar. */
export const PASS_THRESHOLD = 75;

/** Reparto de los 100 puntos. */
export const SCORE_WEIGHTS = { steps: 50, accuracy: 30, time: 20 } as const;

/** Puntos que resta cada error del bloque "herramienta y color". */
export const PENALTIES = { color: 6, placement: 6, order: 3 } as const;

/** Semáforo: fracción de tiempo restante por debajo de la cual cambia el color. */
export const TIMER_THRESHOLDS = { yellow: 0.5, red: 0.25 } as const;

export const FEEDBACK_MS = 2600;
export const FINISH_DELAY_MS = 1200;

export const TOOL_ORDER: ToolId[] = ['busTub', 'whiteTowel', 'greenTowel', 'virex', 'cutlery'];

export const TOOL_LABELS: Record<ToolId, string> = {
  busTub: 'Jaba superior',
  whiteTowel: 'Toalla blanca',
  greenTowel: 'Toalla verde',
  virex: 'Virex (azul)',
  cutlery: 'Cubiertos',
};

export const TRASH_ITEMS = [
  { emoji: '🥤', label: 'Vaso usado' },
  { emoji: '🧻', label: 'Servilleta usada' },
  { emoji: '🍕', label: 'Restos de comida' },
] as const;

export const CHAIR_COUNT = 4;
