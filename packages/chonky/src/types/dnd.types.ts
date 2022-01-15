// import { DragObjectWithType } from 'react-dnd';
import { Nilable } from 'tsdef';

import { StartDragNDropPayload } from './action-payloads.types';
import { FileData } from './file.types';

export interface ChonkyDndDropResult {
  dropTarget: Nilable<FileData> | any;
  dropEffect: 'move' | 'copy';
}

export type ChonkyDndFileEntryItem = any & {
  payload: StartDragNDropPayload;
};
export const ChonkyDndFileEntryType = 'dnd-chonky-file-entry';
