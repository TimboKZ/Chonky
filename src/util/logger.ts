export class Logger {
    public static error(...args: any[]): void {
        // eslint-disable-next-line no-console
        console.error('[Chonky runtime error]', ...args);
    }

    public static formatBullets(bullets: string[]): string {
        return `\n- ${bullets.join('\n- ')}`;
    }
}
