export class Logger {
    public static error(...args: any[]) {
        // eslint-disable-next-line no-console
        console.error.call(console, '[Chonky runtime error]', ...args);
    }
}
