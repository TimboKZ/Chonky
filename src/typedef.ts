import { Nilable, Nullable } from 'tsdef';

// If you make changes to required params in `FileData`, make sure to makes relevant
// changes `validation.ts` functions.

// Required properties are marked with `!!`
export interface FileData {
    id: string; // !! String that uniquely identifies the file

    name: string; // !! Full name, e.g. `MyImage.jpg`
    ext?: string; // File extension, e.g. `.jpg`

    isDir?: boolean; // Is a directory, default: false
    isHidden?: boolean; // Is a hidden file, default: false
    isSymlink?: boolean; // Is a symlink, default: false
    openable?: boolean; // Can be opened, default: true
    selectable?: boolean; // Can be selected, default: true

    size?: number; // File size in bytes
    modDate?: Date; // Last change date

    parentId?: string; // ID of the parent folder
    childrenIds?: string[]; // An array of IDs of children (only for folders)
}

export type FileArray = Nullable<FileData>[];

export type ThumbnailGenerator = (
    file: FileData
) => Nilable<string> | Promise<Nilable<string>>;
