// Used in React hooks to indicate empty deps are intentional.
import { Logger } from './logger';

// Used in contexts that need to provide some default value for a function.
// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
export const NOOP_FUNCTION = (...args: any[]) => {
    Logger.warn(
        `The "NOOP_FUNCTION" from the constants module was called. ` +
            `This can indicate a bug in one of the components. Supplied args:`,
        args
    );
};
