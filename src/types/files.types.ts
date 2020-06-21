// If you make changes to required params in `FileData`, make sure to makes relevant
// changes `validation.ts` functions.
import { Nullable, Undefinable } from 'tsdef';

export interface FileData {
    id: string; // (Required) String that uniquely identifies the file

    name: string; // (Required) Full name, e.g. `MyImage.jpg`
    ext?: string; // File extension, e.g. `.jpg`

    isDir?: boolean; // Is a directory, default: false
    isHidden?: boolean; // Is a hidden file, default: false
    isSymlink?: boolean; // Is a symlink, default: false
    openable?: boolean; // Can be opened, default: true
    selectable?: boolean; // Can be selected, default: true
    draggable?: boolean; // Can be dragged, default: true
    droppable?: boolean; // Can have files dropped into it, default: true

    size?: number; // File size in bytes
    modDate?: Date; // Last change date

    parentId?: string; // ID of the parent folder
    childrenIds?: string[]; // An array of IDs of children (only for folders)

    thumbnailUrl?: string; // Automatically load thumbnail from here

    [property: string]: any;
}

export type FileArray = Nullable<FileData>[];
export type ReadonlyFileArray = ReadonlyArray<Nullable<FileData>>;
export type FileFilter = (file: Nullable<FileData>) => boolean;

export interface FileSelection {
    // `true` means selected, anything else - not selected
    [fileId: string]: Undefinable<boolean>;
}
