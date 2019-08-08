/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

const Prefix = `[Chonky]`;

export default class ConsoleUtil {

    static logUnhandledPromiseError = (error: Error, action: string) => {
        console.error(`${Prefix} Chonky caught an unhandled promise error while ${action}. Ideally, you should catch`
            + ` promise errors yourself and only return promises with error handlers attached. The actual error was:`
            + `\n    ${error}`);
    };

}
