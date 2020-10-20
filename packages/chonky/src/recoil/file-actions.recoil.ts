import { atom, selectorFamily } from 'recoil';
import { Nullable } from 'tsdef';

import {
    FileAction,
    InternalFileActionDispatcher,
    InternalFileActionRequester,
} from '../types/file-actions.types';
import { FileData } from '../types/files.types';
import { NOOP_FUNCTION } from '../util/constants';
import { selectedFilesState } from './selection.recoil';

//
// ==== Atoms
export const fileActionsState = atom<FileAction[]>({
    key: 'fileActionsState',
    default: [],
});

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

export const doubleClickDelayState = atom<number>({
    key: 'doubleClickDelayState',
    default: 300,
});

//
// ==== Selectors
export const fileActionDataState = selectorFamily<Nullable<FileAction>, string>({
    key: 'fileActionDataState',
    get: (fileActionId) => ({ get }) => {
        if (!fileActionId) return null;

        const fileActionMap = get(fileActionMapState);
        const fileAction = fileActionMap[fileActionId];
        return fileAction ?? null;
    },
});

/**
 * This Recoil selector family returns a subset of the global file selection that
 * satisfies filter of the provided file action.
 */
export const fileActionSelectedFilesState = selectorFamily<readonly FileData[], string>(
    {
        key: 'fileActionSelectedFilesState',
        get: (fileActionId) => ({ get }) => {
            if (!fileActionId) return [];

            const fileActionMap = get(fileActionMapState);
            const fileAction = fileActionMap[fileActionId];
            if (!fileAction) return [];

            const selectedFiles = get(selectedFilesState);
            if (fileAction.fileFilter) {
                return selectedFiles.filter(fileAction.fileFilter);
            } else {
                return selectedFiles;
            }
        },
    }
);

export const fileActionSelectedFilesCountState = selectorFamily<number, string>({
    key: 'fileActionSelectedFilesCountState',
    get: (fileActionId) => ({ get }) => {
        const actionSelectedFiles = get(fileActionSelectedFilesState(fileActionId));
        return actionSelectedFiles.length;
    },
});
