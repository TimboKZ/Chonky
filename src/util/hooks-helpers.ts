import React, { useCallback, useEffect, useRef, useState } from 'react';

export const useDebounce = <T>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

export const useOutsideClickListener = <T extends HTMLElement = HTMLDivElement>(
    onOutsideClick: (event: MouseEvent) => void
) => {
    const triggerComponentRef = useRef<T>();

    const clickListener = useCallback(
        (event: MouseEvent) => {
            if (
                !triggerComponentRef.current ||
                triggerComponentRef.current.contains(event.target as any)
            ) {
                // Click originated from inside.
                return;
            }

            onOutsideClick(event);
        },
        [onOutsideClick, triggerComponentRef]
    );

    useEffect(() => {
        document.addEventListener('mousedown', clickListener, false);
        return () => {
            document.removeEventListener('mousedown', clickListener, false);
        };
    }, [clickListener]);

    return triggerComponentRef as React.RefObject<T>;
};
