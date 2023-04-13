import { useState } from 'react';

export function numberIteratorHook(iterateBy: number) {
  const [numberToIterate, setNumberToIterate] = useState<number>(iterateBy);

  const iterate = () => setNumberToIterate((currentNumber) => currentNumber + iterateBy);

  return [numberToIterate, iterate] as const;
}
