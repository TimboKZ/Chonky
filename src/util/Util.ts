/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import {AnyFunction, nil, Nilable, Nullable} from 'tsdef';

export const isNil = (value: any): value is nil => value === undefined || value === null;
export const isNumber = (value: any): value is number => typeof value == 'number';
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
export const clamp = (value: number, min: number, max: number) => {
    if (min > max) [min, max] = [max, min];
    return Math.min(max, Math.max(min, value));
};

export const clampIndex = (value: number, array: any[]) => {
    return clamp(value, 0, array.length - 1);
};

export default class Util {

    public static generateInstanceId() {
        return Math.random().toString(36).substr(2, 9);
    }

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
