export class Logger {
    public static error(...args: any[]) {
        // eslint-disable-next-line no-console
        console.error('[Chonky runtime error]', ...args);
    }
}
