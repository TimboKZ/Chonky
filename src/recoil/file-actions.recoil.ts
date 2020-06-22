import { atom } from 'recoil';

import { FileAction, InternalFileActionDispatcher } from '../types/file-actions.types';
import { NOOP_FUNCTION } from '../util/constants';

//
// ==== Atoms
export const fileActionsState = atom<FileAction[]>({
    key: 'fileActionsState',
    default: [],
});

export const dispatchFileActionState = atom<InternalFileActionDispatcher>({
    key: 'dispatchFileActionState',
    default: NOOP_FUNCTION,
});

export const doubleClickDelayState = atom<number>({
    key: 'doubleClickDelayState',
    default: 300,
});
