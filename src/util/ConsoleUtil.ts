/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

const Prefix = `[Chonky]`;

export default class ConsoleUtil {

    public static log = (...inputArgs: any) => {
        let args = [].slice.call(inputArgs);
        console.log.apply(null, [Prefix].concat(args));
    };

    public static warn = (...inputArgs: any) => {
        let args = [].slice.call(inputArgs);
        console.warn.apply(null, [Prefix].concat(args));
    };

    public static error = (...inputArgs: any) => {
        let args = [].slice.call(inputArgs);
        console.error.apply(null, [Prefix].concat(args));
    };

    public static logUnhandledException = (error: Error, action: string) => {
        ConsoleUtil.error(`Chonky caught an unhandled exception while ${action}. Ideally, you should catch exceptions`
            + ` in your synchronous code yourself by writing it into try/catch blocks. The actual error was:`
            + `\n    ${error}`);
    };

    public static logUnhandledPromiseError = (error: Error, action: string) => {
        ConsoleUtil.error(`Chonky caught an unhandled promise error while ${action}. Ideally, you should handle`
            + ` promise errors yourself and only return promises with error handlers attached. The actual error was:`
            + `\n    ${error}`);
    };

}
