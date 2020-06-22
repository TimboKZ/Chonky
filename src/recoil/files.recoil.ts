import { atom } from 'recoil';
import { Nullable } from 'tsdef';

import { FileArray } from '../types/files.types';

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
