import { Undefinable } from 'tsdef';

export interface FileSelection {
    // `true` means selected, anything else - not selected
    [fileId: string]: Undefinable<boolean>;
}

export interface SelectionModifiers {
    selectFiles: (fileIds: string[], reset?: boolean) => void;
    toggleSelection: (fileId: string, exclusive?: boolean) => void;
    clearSelection: () => void;
}
