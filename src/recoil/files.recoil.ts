import { atom, selector, selectorFamily } from 'recoil';
import { Nullable } from 'tsdef';

import { FileArray, FileData } from '../types/files.types';

//
// ==== Atoms
export const filesState = atom<FileArray>({
    key: 'filesState',
    default: [],
});

export const folderChainState = atom<Nullable<FileArray>>({
    key: 'folderChainState',
    default: null,
});

export const parentFolderState = atom<Nullable<FileData>>({
    key: 'parentFolderState',
    default: null,
});

//
// ==== Selectors
export const fileMapState = selector<{ [fileId: string]: FileData }>({
    key: 'fileMapState',
    get: ({ get }) => {
        const files = get(filesState);

        const fileMap = {};

        for (const file of files) {
            if (!file) continue;
            fileMap[file.id] = file;
        }

        return fileMap;
    },
});

export const fileDataState = selectorFamily<Nullable<FileData>, Nullable<string>>({
    key: 'fileDataState',
    get: (fileId) => ({ get }) => {
        if (!fileId) return null;

        const fileMap = get(fileMapState);
        const file = fileMap[fileId];
        return file ?? null;
    },
});
