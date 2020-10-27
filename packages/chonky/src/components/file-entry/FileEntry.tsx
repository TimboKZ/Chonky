import { Nullable } from 'tsdef';

import { FileData } from '../../types/files.types';

export interface DndEntryState {
    dndIsDragging?: boolean;
    dndIsOver?: boolean;
    dndCanDrop?: boolean;
}

export interface FileEntryProps extends DndEntryState {
    file: Nullable<FileData>;
    displayIndex: number; // Index at which this file appears in the file list
    selected: boolean;
    focused?: boolean;
    isGridView: boolean;
}
