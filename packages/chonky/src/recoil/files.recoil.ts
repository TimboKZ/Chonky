import { atom } from 'recoil';

import { FileArray } from '../types/files.types';

//
// ==== Atoms
export const filesState = atom<FileArray>({
    key: 'filesState',
    default: [],
});
