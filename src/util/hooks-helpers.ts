import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnyFunction } from 'tsdef';

import { Logger } from './logger';

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

export const useInstanceVariable = <T>(value: T) => {
    const ref = useRef(value);
    useEffect(() => {
        ref.current = value;
    }, [ref, value]);
    return ref;
};

interface UseClickListenerParams {
    onClick?: (event: MouseEvent) => void;
    onInsideClick?: (event: MouseEvent) => void;
    onOutsideClick?: (event: MouseEvent, targetIsAButton: boolean) => void;
}

export const useClickListener = <T extends HTMLElement = HTMLDivElement>(
    params: UseClickListenerParams
) => {
    const { onClick, onInsideClick, onOutsideClick } = params;
    const triggerComponentRef = useRef<T>(null);

    const clickListener = useCallback(
        (event: MouseEvent) => {
            const anyTarget: any = event.target;
            if (
                !triggerComponentRef.current ||
                triggerComponentRef.current.contains(anyTarget)
            ) {
                // Click originated from inside.
                if (onInsideClick) onInsideClick(event);
            } else {
                // Click originated from outside inside.
                const targetIsAButton =
                    anyTarget &&
                    typeof anyTarget.tagName === 'string' &&
                    anyTarget.tagName.toLowerCase() === 'button';

                if (onOutsideClick) onOutsideClick(event, targetIsAButton);
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

export const useRefCallbackWithErrorHandling = <FuncType extends AnyFunction>(
    callbackFunc: FuncType,
    displayName: string
) => {
    const callbackFuncRef = useInstanceVariable(callbackFunc);
    return useCallback(
        (...args: Parameters<FuncType>) => {
            try {
                callbackFuncRef.current(...args);
            } catch (error) {
                Logger.error(`An error occurred inside ${displayName}:`, error);
            }
        },
        [callbackFuncRef, displayName]
    );
};
