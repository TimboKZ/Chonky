// Used in React hooks to indicate empty deps are intentional.
import { MaybePromise, Nullable, WritableProps } from 'tsdef';

import { FileAction, FileActionEffect } from '../types/action.types';
import { Logger } from './logger';

// Used in contexts that need to provide some default value for a function.
// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
export const NOOP_FUNCTION = (...args: any[]) => {
  Logger.warn(
    `The "NOOP_FUNCTION" from the constants module was called. ` +
      `This can indicate a bug in one of the components. Supplied args:`,
    args,
  );
};

export const isPromise = <T>(value: MaybePromise<T> | any): value is Promise<T> => {
  if (typeof value !== 'object' || !value) return false;
  const then = (value as Promise<T>).then;
  return then && typeof then === 'function';
};

export const defineFileAction = <Action extends FileAction>(
  action: Action,
  effect?: FileActionEffect<FileAction>,
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

  action.effect = effect;
  return action;
};

/**
 * Recursively check the current element and the parent elements, going bottom-up.
 * Returns the first element to match the predicate, otherwise returns null if such
 * element is not found.
 */
export const findElementAmongAncestors = (
  maybeElement: HTMLElement | any,
  predicate: (maybeElement: HTMLElement | any) => boolean,
): Nullable<HTMLElement> => {
  if (!maybeElement) return maybeElement;

  if (predicate(maybeElement)) return maybeElement;

  if (maybeElement.parentElement) {
    return findElementAmongAncestors(maybeElement.parentElement, predicate);
  }

  return null;
};

export const elementIsInsideButton = (buttonCandidate: HTMLElement | any): boolean => {
  return !!findElementAmongAncestors(
    buttonCandidate,
    (element: any) => element.tagName && element.tagName.toLowerCase() === 'button',
  );
};

export const getValueOrFallback = <T extends any>(
  value: T | undefined,
  fallback: T,
  desiredType?: 'boolean' | 'string' | 'number',
): NonNullable<T> => {
  if (desiredType) {
    return (typeof value === desiredType ? value : fallback) as NonNullable<T>;
  }
  return (value !== undefined ? value : fallback) as NonNullable<T>;
};
