/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import {AnyFunction, nil, Nilable, Nullable} from 'tsdef';

import ConsoleUtil from './ConsoleUtil';
import {InputEvent, InputEventType, InputListener, kbCodeMap, KbKey, kbKeyCodeMap, kbKeyMap} from '../typedef';

// Assertions
export const isNil = (value: any): value is nil => value === undefined || value === null;
export const isNumber = (value: any): value is number => typeof value == 'number';
export const isBoolean = (value: any): value is boolean => typeof value == 'boolean';
export const isString = (value: any): value is string => typeof value == 'string';
export const isArray = (value: any): value is any[] => Array.isArray(value);
export const isObject = (value: any): value is object => typeof value === 'object' && value !== null;
export const isFunction = (value: any): value is AnyFunction => typeof value === 'function';
export const getNonNil: <T>(array: Nilable<T[]>, index: number) => Nullable<T> = (array, index) => {
    if (!isArray(array)) return null;
    const length = array.length;
    if (index < 0) index = length + index;
    if (index < 0 || index >= length) return null;
    const elem = array[index];
    if (isNil(elem)) return null;
    return elem;
};


// Math operations
export const clamp = (value: number, min: number, max: number) => {
    if (min > max) [min, max] = [max, min];
    return Math.min(max, Math.max(min, value));
};
export const clampIndex = (value: number, array: any[]) => clamp(value, 0, array.length - 1);


// Keyboard-related util
export const detectKey = (event: KeyboardEvent): Nullable<KbKey> => {
    let result = kbKeyMap[event.key];
    if (!isNil(result)) return result;
    result = kbCodeMap[event.code];
    if (!isNil(result)) return result;
    result = kbKeyCodeMap[event.keyCode];
    return isNil(result) ? result : null;
};
export const handleKeyPress = (event: KeyboardEvent) => {
    if (!isNil(event.target) && event.target instanceof Element) {
        const tagName = event.target.tagName.toUpperCase();
        const isInInput = tagName === 'INPUT' || tagName === 'TEXTAREA';
        if (isInInput) return;
    }

    const key = detectKey(event);
    if (isNil(key)) return;

    const inputEvent: InputEvent = {
        type: InputEventType.Keyboard,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        key,
    };
    const listenerSet = window._chonkyData.kbListenerSet;

    let handled = false;
    listenerSet.forEach(listener => {
        if (listener(inputEvent)) handled = true;
    });
    if (handled) event.preventDefault();
};
export const setupListeners = () => {
    if (isNil(window)) {
        throw new Error('[Chonky] `window` object was not found - Chonky might not work correctly. Are we running in'
            + ' the browser?');
    }
    if (!isNil(window._chonkyData)) return;

    window._chonkyData = {
        kbListenerSet: new Set(),
    };
    document.addEventListener('keydown', handleKeyPress);
};


// FileBrowser instance/ClickableWrapper related util
export const registerKbListener = (kbListener: InputListener) => {
    setupListeners();

    const set = window._chonkyData.kbListenerSet;
    if (set.has(kbListener)) {
        ConsoleUtil.warn('Tried to register the same keyboard listener twice!');
        return;
    }
    set.add(kbListener);
};
export const deregisterKbListener = (kbListener: InputListener) => {
    const set = window._chonkyData.kbListenerSet;
    set.delete(kbListener);
};

export default class Util {

    public static kbEventIsSpace(event: KeyboardEvent) {
        return event.code === 'Space' || event.keyCode === 32;
    }

    public static kbEventIsEnter(event: KeyboardEvent) {
        return event.code === 'Enter' || event.keyCode === 13;
    }

    public static kbEventIsBackspace(event: KeyboardEvent) {
        return event.code === 'Backspace' || event.keyCode === 8;
    }

}
