import { useRef } from 'react';
import { nanoid } from 'nanoid/non-secure';

import type { Nilable } from 'chonky-engine/dist/types/helpers.types';

const UNINITIALIZED_SENTINEL = {};
export function useStaticValue<T>(factory: () => T): T {
  const valueRef = useRef<T>(UNINITIALIZED_SENTINEL as T);
  if (valueRef.current === UNINITIALIZED_SENTINEL) valueRef.current = factory();
  return valueRef.current;
}

export function useStaticNanoId(overrideId: Nilable<string>): string {
  const generatedId = useStaticValue(nanoid);
  return overrideId ? overrideId : generatedId;
}
