import { useCallback, useEffect, EffectCallback, DependencyList } from 'react';

export const useDebouncedEffect = (
  effect: EffectCallback,
  delay: number,
  deps: DependencyList
) => {
  const callback = useCallback(effect, deps);

  useEffect(() => {
    const handler = setTimeout(() => {
      callback();
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [callback, delay]);
};
