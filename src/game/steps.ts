import type { SceneState, Selection, Source, Target } from './types';

export interface ActionContext {
  scene: SceneState;
  target: Target;
  selection: Selection | null;
}

/** Una acción válida: "con <source> toca <target>", si se cumple `when`. */
export interface ActionDef {
  source: Source;
  target: Target['kind'];
  when: (ctx: ActionContext) => boolean;
  apply: (ctx: ActionContext) => SceneState;
  success: string;
}

export interface StepDef {
  number: number;
  title: string;
  hint: string;
  progress: (scene: SceneState) => string;
  actions: ActionDef[];
  isComplete: (scene: SceneState) => boolean;
}

const mark = (ok: boolean) => (ok ? '✓' : '—');
const countTrue = (values: boolean[]) => values.filter(Boolean).length;

export const STEPS: StepDef[] = [
  {
    number: 1,
    title: 'Retira los condimentos de la mesa.',
    hint: 'Toca el porta-condimentos para llevarlo al área de espera.',
    progress: (s) => `Condimentos fuera de la mesa ${mark(s.caddy !== 'table')}`,
    actions: [
      {
        source: 'hand',
        target: 'caddy',
        when: ({ scene }) => scene.caddy === 'table',
        apply: ({ scene }) => ({ ...scene, caddy: 'holding' }),
        success: 'Condimentos en el área de espera.',
      },
    ],
    isComplete: (s) => s.caddy !== 'table',
  },
  {
    number: 2,
    title: 'Deposita la basura restante en la jaba superior.',
    hint: 'Toca cada resto de basura y luego toca la jaba superior.',
    progress: (s) => `Basura en la jaba: ${s.trash.length - countTrue(s.trash)}/${s.trash.length}`,
    actions: [
      {
        source: 'trash',
        target: 'tool',
        when: ({ scene, target, selection }) =>
          target.kind === 'tool' &&
          target.id === 'busTub' &&
          selection?.kind === 'trash' &&
          scene.trash[selection.id] === true,
        apply: ({ scene, selection }) => {
          if (selection?.kind !== 'trash') return scene;
          const trash = [...scene.trash];
          trash[selection.id] = false;
          return { ...scene, trash };
        },
        success: 'Basura depositada en la jaba.',
      },
    ],
    isComplete: (s) => s.trash.every((onTable) => !onTable),
  },
  {
    number: 3,
    title: 'Limpia los condimentos con la toalla blanca y verifica que estén reabastecidos.',
    hint: 'Selecciona la toalla blanca, toca los condimentos y luego confirma «Reabastecido».',
    progress: (s) =>
      `Limpios ${mark(s.condimentsCleaned)} · Reabastecidos ${mark(s.condimentsRestocked)}`,
    actions: [
      {
        source: 'whiteTowel',
        target: 'caddy',
        when: ({ scene }) => !scene.condimentsCleaned,
        apply: ({ scene }) => ({ ...scene, condimentsCleaned: true }),
        success: 'Condimentos limpios. Ahora confirma «Reabastecido».',
      },
      {
        source: 'hand',
        target: 'restock',
        when: ({ scene }) => scene.condimentsCleaned && !scene.condimentsRestocked,
        apply: ({ scene }) => ({ ...scene, condimentsRestocked: true }),
        success: 'Condimentos reabastecidos.',
      },
    ],
    isComplete: (s) => s.condimentsCleaned && s.condimentsRestocked,
  },
  {
    number: 4,
    title: 'Aplica químico Virex (azul) a la superficie de la mesa.',
    hint: 'Selecciona el Virex y toca la mesa. Después sécala con la toalla blanca.',
    progress: (s) => `Virex ${mark(s.tableVirex)} · Secada ${mark(s.tableDried)}`,
    actions: [
      {
        source: 'virex',
        target: 'table',
        when: ({ scene }) => !scene.tableVirex,
        apply: ({ scene }) => ({ ...scene, tableVirex: true }),
        success: 'Virex aplicado. Ahora seca con la toalla blanca.',
      },
      {
        source: 'whiteTowel',
        target: 'table',
        when: ({ scene }) => scene.tableVirex && !scene.tableDried,
        apply: ({ scene }) => ({ ...scene, tableDried: true }),
        success: 'Mesa desinfectada y seca.',
      },
    ],
    isComplete: (s) => s.tableVirex && s.tableDried,
  },
  {
    number: 5,
    title: 'Toma los condimentos y colócalos al final de la mesa.',
    hint: 'Toca los condimentos del área de espera y luego el lugar marcado en la mesa.',
    progress: (s) => `Condimentos al final de la mesa ${mark(s.caddy === 'tableEnd')}`,
    actions: [
      {
        source: 'caddy',
        target: 'tableEnd',
        when: ({ scene }) => scene.caddy === 'holding',
        apply: ({ scene }) => ({ ...scene, caddy: 'tableEnd' }),
        success: 'Condimentos en su lugar.',
      },
    ],
    isComplete: (s) => s.caddy === 'tableEnd',
  },
  {
    number: 6,
    title: 'Coloca los cubiertos envueltos en servilleta a mano izquierda de cada silla, sobre la mesa.',
    hint: 'Selecciona los cubiertos y toca el lado izquierdo de cada lugar, como si estuvieras sentado.',
    progress: (s) => `Cubiertos colocados: ${countTrue(s.cutlery)}/${s.cutlery.length}`,
    actions: [
      {
        source: 'cutlery',
        target: 'cutlerySlot',
        when: ({ scene, target }) =>
          target.kind === 'cutlerySlot' && target.side === 'left' && scene.cutlery[target.id] === false,
        apply: ({ scene, target }) => {
          if (target.kind !== 'cutlerySlot') return scene;
          const cutlery = [...scene.cutlery];
          cutlery[target.id] = true;
          return { ...scene, cutlery };
        },
        success: 'Cubiertos en su lugar.',
      },
    ],
    isComplete: (s) => s.cutlery.every(Boolean),
  },
  {
    number: 7,
    title: 'Limpia las butacas/sillas con la toalla verde.',
    hint: 'Selecciona la toalla verde y toca cada silla.',
    progress: (s) =>
      `Sillas limpias: ${s.chairs.filter((c) => c.cleaned).length}/${s.chairs.length}`,
    actions: [
      {
        source: 'greenTowel',
        target: 'chair',
        when: ({ scene, target }) =>
          target.kind === 'chair' && scene.chairs[target.id]?.cleaned === false,
        apply: ({ scene, target }) => ({
          ...scene,
          chairs: scene.chairs.map((c) =>
            target.kind === 'chair' && c.id === target.id ? { ...c, cleaned: true } : c,
          ),
        }),
        success: 'Silla limpia.',
      },
    ],
    isComplete: (s) => s.chairs.every((c) => c.cleaned),
  },
  {
    number: 8,
    title: 'Ubica las sillas en su posición.',
    hint: 'Toca una silla y luego un lugar libre junto a la mesa. El color no importa.',
    progress: (s) =>
      `Sillas en su lugar: ${s.chairs.filter((c) => c.seat !== null).length}/${s.chairs.length}`,
    actions: [
      {
        source: 'chair',
        target: 'seat',
        when: ({ scene, target, selection }) =>
          target.kind === 'seat' &&
          selection?.kind === 'chair' &&
          !scene.chairs.some((c) => c.seat === target.id),
        apply: ({ scene, target, selection }) => ({
          ...scene,
          chairs: scene.chairs.map((c) =>
            selection?.kind === 'chair' && target.kind === 'seat' && c.id === selection.id
              ? { ...c, seat: target.id }
              : c,
          ),
        }),
        success: 'Silla en su lugar.',
      },
    ],
    isComplete: (s) => s.chairs.every((c) => c.seat !== null),
  },
];

export function findAction(step: StepDef, source: Source, ctx: ActionContext): ActionDef | undefined {
  return step.actions.find(
    (a) => a.source === source && a.target === ctx.target.kind && a.when(ctx),
  );
}
