import type { ToolId } from '../game/types';

/** Placeholders SVG. El color es parte de la mecánica: blanca, verde y Virex azul. */
export function ToolIcon({ id }: { id: ToolId }) {
  switch (id) {
    case 'busTub':
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M7 17h34l-4 23a3 3 0 0 1-3 2.5H14A3 3 0 0 1 11 40z" fill="#868e96" />
          <rect x="4" y="12" width="40" height="7" rx="2.5" fill="#5c636a" />
          <path d="M16 24v12M24 24v12M32 24v12" stroke="#6c737a" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'whiteTowel':
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <rect x="7" y="9" width="34" height="30" rx="4" fill="#ffffff" stroke="#8a949e" strokeWidth="2.5" />
          <path d="M7 17h34M7 31h34" stroke="#ced4da" strokeWidth="2.5" />
        </svg>
      );
    case 'greenTowel':
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <rect x="7" y="9" width="34" height="30" rx="4" fill="#2f9e44" stroke="#1b6b2c" strokeWidth="2.5" />
          <path d="M7 17h34M7 31h34" stroke="#69db7c" strokeWidth="2.5" />
        </svg>
      );
    case 'cutlery':
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <g transform="rotate(-35 24 24)">
            <path d="M20.5 3v9M24 3v9M27.5 3v9" stroke="#868e96" strokeWidth="2" strokeLinecap="round" />
            <rect x="17" y="10" width="14" height="34" rx="7" fill="#ffffff" stroke="#8a949e" strokeWidth="2.5" />
            <rect x="17.5" y="23" width="13" height="6" fill="#ced4da" />
          </g>
        </svg>
      );
    case 'virex':
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M14 5h17v7H14z" fill="#0b3d91" />
          <path d="M31 6h9v3h-9z" fill="#0b3d91" />
          <path d="M18 12h10v6H18z" fill="#1864ab" />
          <rect x="13" y="18" width="20" height="26" rx="4" fill="#1c7ed6" />
          <rect x="16" y="25" width="14" height="10" rx="2" fill="#d0ebff" />
          <path d="M19 30h8" stroke="#1864ab" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}
