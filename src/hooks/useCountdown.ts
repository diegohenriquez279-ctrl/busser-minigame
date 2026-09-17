import { useEffect, useRef, useState } from 'react';

/** Cuenta regresiva basada en reloj real; se congela cuando `running` es false. */
export function useCountdown(totalMs: number, running: boolean, onExpire: () => void): number {
  const [remaining, setRemaining] = useState(totalMs);
  const remainingRef = useRef(totalMs);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (!running || remainingRef.current <= 0) return;
    const endAt = performance.now() + remainingRef.current;
    const id = window.setInterval(() => {
      const left = Math.max(0, endAt - performance.now());
      remainingRef.current = left;
      setRemaining(left);
      if (left <= 0) {
        window.clearInterval(id);
        onExpireRef.current();
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [running]);

  return remaining;
}
