import { atom } from 'recoil';

import { DefaultEntrySize } from '../components/external/FileList-virtualization';
import { FileEntrySize } from '../types/file-list-view.types';

//
// ==== Atoms
export const fileEntrySizeState = atom<FileEntrySize>({
    key: 'fileEntrySizeState',
    default: DefaultEntrySize,
});
