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

    public static logInternalException = (error: Error, action: string) => {
        ConsoleUtil.error(`An exception was thrown while ${action}. This appears to be an internal Chonky issue.`
            + ` If this issue persists, please report it on the https://github.com/TimboKZ/Chonky/issues page.`
            + ` The actual error was:`
            + `\n    ${error}`);
    };

    public static logUnhandledUserException = (error: Error, action: string) => {
        ConsoleUtil.error(`Chonky caught an unhandled exception while ${action}. This exception originated in user`
            + `code. Ideally, you should catch exceptions in your code yourself. The actual error was:`
            + `\n    ${error}`);
    };

}
