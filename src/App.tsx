import { useState } from 'react';
import { GameScreen } from './components/GameScreen';
import { ResultScreen } from './components/ResultScreen';
import { StartScreen } from './components/StartScreen';
import type { RoundResult } from './game/scoring';

type Screen = { name: 'start' } | { name: 'play' } | { name: 'result'; result: RoundResult };

export function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'start' });
  // Cambiar la key remonta GameScreen y reinicia la ronda desde cero.
  const [round, setRound] = useState(0);

  const play = () => {
    setRound((r) => r + 1);
    setScreen({ name: 'play' });
  };

  switch (screen.name) {
    case 'start':
      return <StartScreen onStart={play} />;
    case 'play':
      return <GameScreen key={round} onFinish={(result) => setScreen({ name: 'result', result })} />;
    case 'result':
      return (
        <ResultScreen
          result={screen.result}
          onRetry={play}
          onHome={() => setScreen({ name: 'start' })}
        />
      );
  }
}
