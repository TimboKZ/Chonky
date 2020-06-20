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

interface UseClickListenerParams {
    onClick?: (event: MouseEvent) => void;
    onInsideClick?: (event: MouseEvent) => void;
    onOutsideClick?: (event: MouseEvent) => void;
}

export const useClickListener = <T extends HTMLElement = HTMLDivElement>(
    params: UseClickListenerParams
) => {
    const triggerComponentRef = useRef<T>();

    const clickListener = useCallback(
        (event: MouseEvent) => {
            if (
                !triggerComponentRef.current ||
                triggerComponentRef.current.contains(event.target as any)
            ) {
                // Click originated from inside.
                if (params.onInsideClick) params.onInsideClick(event);
            } else {
                // Click originated from outside inside.
                if (params.onOutsideClick) params.onOutsideClick(event);
            }

            if (params.onClick) params.onClick(event);
        },
        [
            params.onClick,
            params.onInsideClick,
            params.onOutsideClick,
            triggerComponentRef,
        ]
    );

    useEffect(() => {
        document.addEventListener('mousedown', clickListener, false);
        return () => {
            document.removeEventListener('mousedown', clickListener, false);
        };
    }, [clickListener]);

    return triggerComponentRef as React.RefObject<T>;
};
