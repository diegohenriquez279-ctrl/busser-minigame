import type { CleaningTool, Source, Target, ToolId } from './types';

/** Superficies que se limpian y el código de color que les corresponde. */
export type Surface = 'table' | 'condiments' | 'chair';

export const ALLOWED_TOOLS: Record<Surface, readonly ToolId[]> = {
  table: ['virex', 'whiteTowel'],
  condiments: ['whiteTowel'],
  chair: ['greenTowel'],
};

export function isCleaningTool(source: Source): source is CleaningTool {
  return source === 'whiteTowel' || source === 'greenTowel' || source === 'virex';
}

export function surfaceOf(target: Target): Surface | null {
  switch (target.kind) {
    case 'table':
    case 'tableEnd':
    case 'cutlerySlot':
      return 'table';
    case 'caddy':
      return 'condiments';
    case 'chair':
      return 'chair';
    default:
      return null;
  }
}

export const CUTLERY_SIDE_MESSAGE =
  'Ese es el lado derecho. Los cubiertos van a mano izquierda de quien se sienta.';

export function colorErrorMessage(tool: CleaningTool, surface: Surface): string {
  switch (surface) {
    case 'table':
      return 'Para la mesa se usa la toalla blanca, no la verde.';
    case 'condiments':
      return tool === 'virex'
        ? 'El Virex va solo en la mesa. Condimentos: toalla blanca.'
        : 'Para los condimentos se usa la toalla blanca.';
    case 'chair':
      return tool === 'virex'
        ? 'El Virex va solo en la mesa. Sillas: toalla verde.'
        : 'Para las sillas se usa la toalla verde.';
  }
}
