export class Logger {
    public static error(message: string) {
        // eslint-disable-next-line no-console
        console.error(`[Chonky runtime error] ${message}`);
    }
}
