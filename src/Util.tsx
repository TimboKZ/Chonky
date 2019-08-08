/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

export default class Util {

    static isNumber(value: any): boolean {
        return typeof value == 'number';
    }

    static clamp(value: number, min: number, max: number) {
        if (min > max) [min, max] = [max, min];
        return Math.min(max, Math.max(min, value));
    }

}
