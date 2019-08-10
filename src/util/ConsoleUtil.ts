/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

const Prefix = `[Chonky]`;

export default class ConsoleUtil {

    public static logUnhandledException = (error: Error, action: string) => {
        console.error(`${Prefix} Chonky caught an unhandled exception while ${action}. Ideally, you should catch`
            + ` exceptions in your synchronous code yourself by writing it into try/catch blocks. The actual error was:`
            + `\n    ${error}`);
    };

    public static logUnhandledPromiseError = (error: Error, action: string) => {
        console.error(`${Prefix} Chonky caught an unhandled promise error while ${action}. Ideally, you should catch`
            + ` promise errors yourself and only return promises with error handlers attached. The actual error was:`
            + `\n    ${error}`);
    };

}
