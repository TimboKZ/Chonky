import { atom } from 'recoil';

import {
    FileAction,
    InternalFileActionDispatcher,
    InternalFileActionRequester,
} from '../types/file-actions.types';
import { NOOP_FUNCTION } from '../util/constants';

//
// ==== Atoms
export const fileActionMapState = atom<{ [fileActionId: string]: FileAction }>({
    key: 'fileActionMapState',
    default: {},
});

export const dispatchFileActionState = atom<InternalFileActionDispatcher>({
    key: 'dispatchFileActionState',
    default: NOOP_FUNCTION,
});

export const requestFileActionState = atom<InternalFileActionRequester>({
    key: 'requestFileActionState',
    default: NOOP_FUNCTION,
});
