import { DragObjectWithType } from 'react-dnd';
import { Nilable, Nullable } from 'tsdef';

import { FileData } from './file.types';

export interface ChonkyDndDropResult {
    dropTarget: Nilable<FileData> | any;
    dropEffect: 'move' | 'copy';
}

export type ChonkyDndFileEntryItem = DragObjectWithType & { file: Nullable<FileData> };
export const ChonkyDndFileEntryType = 'dnd-chonky-file-entry';
