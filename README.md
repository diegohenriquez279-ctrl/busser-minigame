# Busser — minijuego (piloto standalone)

Simulación interactiva para practicar el proceso de un **busser**: limpiar y montar una mesa después de que un cliente se retira. Es el primer minijuego de la categoría **Servicio**.

> **Piloto independiente.** Este proyecto no depende de GameHut ni importa nada de la plataforma. No usa marca, estilos ni assets de GameHut ni de Pizza Hut: todo el arte son placeholders (emojis, CSS y SVG). La identidad visual se definirá cuando el piloto se apruebe y se integre.

> **No está pensado para deploy todavía.** Solo desarrollo y pruebas en local.

## Cómo se juega

El jugador ejecuta **8 pasos en orden** con el patrón *tap para seleccionar → tap para actuar* (sin arrastrar):

1. Retira los condimentos de la mesa.
2. Deposita la basura restante en la jaba superior.
3. Limpia los condimentos con la toalla blanca y verifica que estén reabastecidos.
4. Aplica químico Virex (azul) a la superficie de la mesa (y seca con la toalla blanca).
5. Toma los condimentos y colócalos al final de la mesa.
6. Coloca los cubiertos envueltos en servilleta a mano izquierda de cada silla, sobre la mesa.
7. Limpia las butacas/sillas con la toalla verde.
8. Ubica las sillas en su posición (el color de la silla no importa).

**Código de color validado:** toalla blanca → mesa y condimentos · toalla verde → sillas · Virex azul → solo la mesa. Usar la herramienta equivocada muestra un aviso y no avanza el paso.

**Cubiertos:** van a mano izquierda de quien se sienta mirando la mesa. Cada lugar ofrece dos huecos (izquierda y derecha); elegir el derecho es un error de ubicación y no avanza.

**Puntaje (100 pts, aprueba con 75%):**

| Bloque | Pts | Cálculo |
|---|---|---|
| Pasos completados | 50 | proporcional a los 8 pasos |
| Herramienta y color | 30 | −6 por error de color, −6 por error de ubicación, −3 por error de orden |
| Tiempo | 20 | proporcional al tiempo restante, solo si se completa la mesa |

Timer semáforo: verde (>50% del tiempo), amarillo (25–50%), rojo (<25%). Si se acaba, se muestra el resultado con lo logrado.

Duración, umbral, pesos y penalizaciones se ajustan en `src/game/constants.ts`.

## Requisitos

- Node.js 20 o superior

## Instalar y correr en local

```bash
npm install
npm run dev
```

Abre la URL que muestra Vite (por defecto `http://localhost:5173`). El servidor escucha también en la red local, así que puedes abrirlo desde un celular conectado a la misma Wi-Fi usando la IP que aparece en "Network".

## Build

```bash
npm run build     # valida tipos y genera dist/
npm run preview   # sirve dist/ localmente
```

El build usa rutas relativas (`base: './'`), así que `dist/` funciona servido desde cualquier carpeta.

## Estructura

```
src/
├── game/                 # lógica pura, sin React (fácil de acoplar después)
│   ├── types.ts
│   ├── constants.ts      # timer, umbral, pesos, etiquetas
│   ├── rules.ts          # código de color y lado de los cubiertos
│   ├── steps.ts          # los 8 pasos: texto, acciones válidas, condición de completado
│   ├── engine.ts         # reducer: selección, validación, errores, avance
│   ├── scoring.ts        # cálculo de puntaje y aprobado
│   └── format.ts
├── hooks/useCountdown.ts
├── components/           # StartScreen, GameScreen, GameScene, Toolbar,
│                         # StepPrompt, SemaphoreTimer, ResultScreen, ToolIcon
└── styles/               # CSS plano por componente
```

La carpeta es autocontenida: se puede mover a su propio repositorio sin cambios.
