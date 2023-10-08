import { Nilable } from 'tsdef';

import { StartDragNDropPayload } from './action-payloads.types';
import { FileData } from './file.types';

export interface ChonkyDndDropResult {
    dropTarget: Nilable<FileData> | any;
    dropEffect: 'move' | 'copy';
}

export type ChonkyDndFileEntryItem = {
    type: string, // This used to come from `DragSourceMonitor` type in `react-dnd` package but they don't export it anymore.
    payload: StartDragNDropPayload;
};
export const ChonkyDndFileEntryType = 'dnd-chonky-file-entry';
