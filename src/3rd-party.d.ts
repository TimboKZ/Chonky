declare module 'shallow-equal' {
    export function shallowEqualArrays(a?: any[], b?: any[]): boolean;

    export function shallowEqualObjects(a?: object, b?: object): boolean;
}

declare module 'javascript-time-ago' {
    class TimeAgo {
        constructor(options?: any);

        static addLocale(locale: any): void;

        format(date: Date, type?: any): string;
    }

    export default TimeAgo;
}

declare module 'javascript-time-ago/locale/*' {
    const Locale: any;
    export default Locale;
}
