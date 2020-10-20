import { atom } from 'recoil';

import { FileViewConfig } from '../types/file-view.types';
import { ChonkyActions } from '../util/file-actions-definitions';

//
// ==== Atoms
export const fileViewConfigState = atom<FileViewConfig>({
    key: 'fileViewConfig',
    default: ChonkyActions.EnableGridView.fileViewConfig,
});
