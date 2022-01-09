import React, { useEffect, useRef, useState } from 'react';

export const useDebounce = <T>(value: T, delay: number): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return [debouncedValue, setDebouncedValue];
};

const UNINITIALIZED_SENTINEL = {};
export const useStaticValue = <T>(factory: () => T): T => {
  const valueRef = useRef<T>(UNINITIALIZED_SENTINEL as T);
  if (valueRef.current === UNINITIALIZED_SENTINEL) valueRef.current = factory();
  return valueRef.current;
};

export const useInstanceVariable = <T>(value: T) => {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [ref, value]);
  return ref;
};
