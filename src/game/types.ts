export type ToolId = 'busTub' | 'whiteTowel' | 'greenTowel' | 'virex' | 'cutlery';
export type CleaningTool = Exclude<ToolId, 'busTub' | 'cutlery'>;

/** Lado de la silla visto por quien se sienta mirando hacia la mesa. */
export type Side = 'left' | 'right';

export type CaddyLocation = 'table' | 'holding' | 'tableEnd';

export interface ChairState {
  id: number;
  /** Lugar alrededor de la mesa donde está la silla; null = corrida fuera de lugar. */
  seat: number | null;
  cleaned: boolean;
}

export interface SceneState {
  caddy: CaddyLocation;
  condimentsCleaned: boolean;
  condimentsRestocked: boolean;
  /** true = ese resto de basura sigue sobre la mesa. */
  trash: boolean[];
  tableVirex: boolean;
  tableDried: boolean;
  /** true = ya hay cubiertos a mano izquierda de ese lugar (índice = lugar). */
  cutlery: boolean[];
  chairs: ChairState[];
}

/** Lo que el jugador tiene "en la mano" tras el primer tap. */
export type Selection =
  | { kind: 'tool'; id: ToolId }
  | { kind: 'trash'; id: number }
  | { kind: 'caddy' }
  | { kind: 'chair'; id: number };

/** Todo lo que se puede tocar en pantalla. */
export type Target =
  | Selection
  | { kind: 'table' }
  | { kind: 'holding' }
  | { kind: 'tableEnd' }
  | { kind: 'seat'; id: number }
  | { kind: 'cutlerySlot'; id: number; side: Side }
  | { kind: 'restock' };

/** Quién ejecuta la acción: una herramienta, un objeto seleccionado o la mano (tap directo). */
export type Source = ToolId | 'trash' | 'caddy' | 'chair' | 'hand';

export type FeedbackKind = 'success' | 'error' | 'info';

export interface Feedback {
  kind: FeedbackKind;
  message: string;
  nonce: number;
  targetKey?: string;
}

export interface GameState {
  scene: SceneState;
  stepIndex: number;
  selection: Selection | null;
  colorErrors: number;
  orderErrors: number;
  placementErrors: number;
  feedback: Feedback | null;
  finished: boolean;
  nonce: number;
}
