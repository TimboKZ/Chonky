// Used in React hooks to indicate empty deps are intentional.
export const INTENTIONAL_EMPTY_DEPS: ReadonlyArray<never> = [];

// Used in contexts that need to provide some default value for a function.
// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
export const NOOP_FUNCTION = (...args: any[]) => undefined;
