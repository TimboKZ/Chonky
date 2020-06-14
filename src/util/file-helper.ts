import { Nullable } from 'tsdef';

import { FileData } from '../typedef';

export class FileHelper {
    public static isClickable(file: Nullable<FileData>): file is FileData {
        // Clickable by default
        // TODO: Perhaps add `clickable` to `FileData`... Probably not.
        return !!file;
    }

    public static isOpenable(file: Nullable<FileData>): file is FileData {
        // Openable by default
        return !!file && file.openable !== false;
    }

    public static isDraggable(file: Nullable<FileData>): file is FileData {
        // File & folders are draggable by default, `null` is not
        return !!file && file.droppable !== false;
    }

    public static isDroppable(file: Nullable<FileData>): file is FileData {
        // Folders are droppable by default, files are not
        return !!file && (file.droppable === true || !!file.isDir);
    }
}
