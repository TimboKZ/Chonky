/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

export default class Util {

    static generateInstanceId() {
        return Math.random().toString(36).substr(2, 9);
    }

    static isNumber(value: any): boolean {
        return typeof value == 'number';
    }

    static clamp(value: number, min: number, max: number) {
        if (min > max) [min, max] = [max, min];
        return Math.min(max, Math.max(min, value));
    }

    static kbEventIsSpace(event: KeyboardEvent) {
        return event.code === 'Space' || event.keyCode === 32;
    }

    static kbEventIsEnter(event: KeyboardEvent) {
        return event.code === 'Enter' || event.keyCode === 13;
    }

    static kbEventIsBackspace(event: KeyboardEvent) {
        return event.code === 'Backspace' || event.keyCode === 8;
    }

}
