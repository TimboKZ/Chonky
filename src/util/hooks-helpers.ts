import React, { useCallback, useEffect, useRef, useState } from 'react';

export const useDebounce = <T>(
    value: T,
    delay: number
): [T, React.Dispatch<React.SetStateAction<T>>] => {
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

interface UseClickListenerParams {
    onClick?: (event: MouseEvent) => void;
    onInsideClick?: (event: MouseEvent) => void;
    onOutsideClick?: (event: MouseEvent) => void;
}

export const useClickListener = <T extends HTMLElement = HTMLDivElement>(
    params: UseClickListenerParams
) => {
    const { onClick, onInsideClick, onOutsideClick } = params;
    const triggerComponentRef = useRef<T>(null);

    const clickListener = useCallback(
        (event: MouseEvent) => {
            if (
                !triggerComponentRef.current ||
                triggerComponentRef.current.contains(event.target as any)
            ) {
                // Click originated from inside.
                if (onInsideClick) onInsideClick(event);
            } else {
                // Click originated from outside inside.
                if (onOutsideClick) onOutsideClick(event);
            }

            if (onClick) onClick(event);
        },
        [onClick, onInsideClick, onOutsideClick, triggerComponentRef]
    );

    useEffect(() => {
        document.addEventListener('mousedown', clickListener, false);
        return () => {
            document.removeEventListener('mousedown', clickListener, false);
        };
    }, [clickListener]);

    return triggerComponentRef;
};
