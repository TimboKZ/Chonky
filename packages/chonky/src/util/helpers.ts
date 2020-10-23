// Used in React hooks to indicate empty deps are intentional.
import { MaybePromise, WritableProps } from 'tsdef';

import { FileAction, FileActionEffect } from '../file-actons/actions.types';
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

export const isPromise = <T>(value: MaybePromise<T> | any): value is Promise<T> => {
    if (typeof value !== 'object' || !value) return false;
    const then = (value as Promise<T>).then;
    return then && typeof then === 'function';
};

export const defineSimpleAction = <Action extends FileAction>(
    action: Action
): WritableProps<Action> => {
    if (action.__payloadType !== undefined && (action.hotkeys || action.button)) {
        const errorMessage =
            `Invalid definition was provided for file action "${action.id}". Actions ` +
            `that specify hotkeys or buttons cannot define a payload type. If ` +
            `your application requires this functionality, define two actions ` +
            `and chain them using effects.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
    }

    return action as any;
};

export const defineActionWithEffect = <
    Action extends FileAction,
    Payload extends any = undefined
>(params: {
    definition: Action;
    effect?: FileActionEffect<FileAction>;
}): WritableProps<Action> => {
    const { definition, effect } = params;

    if (
        definition.__payloadType !== undefined &&
        (definition.hotkeys || definition.button)
    ) {
        const errorMessage =
            `Invalid definition was provided for file action "${definition.id}". Actions ` +
            `that specify hotkeys or buttons cannot define a payload type. If ` +
            `your application requires this functionality, define two actions ` +
            `and chain them using effects.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
    }

    definition.effect = effect;
    return definition as any;
};
