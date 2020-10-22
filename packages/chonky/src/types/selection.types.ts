import { FileIdTrueMap } from './files.types';

export type FileSelection = FileIdTrueMap;

export interface SelectionModifiers {
    selectFiles: (fileIds: string[], reset?: boolean) => void;
    toggleSelection: (fileId: string, exclusive?: boolean) => void;
    clearSelection: () => void;
}
