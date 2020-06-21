import { Nullable } from 'tsdef';

import { FileData } from '../types/files.types';

export class FileHelper {
    public static isClickable(file: Nullable<FileData>): file is FileData {
        // Clickable by default
        return !!file;
    }

    public static isOpenable(file: Nullable<FileData>): file is FileData {
        // Openable by default
        return !!file && file.openable !== false;
    }

    public static isSelectable(file: Nullable<FileData>): file is FileData {
        // Selectable by default
        return !!file && file.selectable !== false;
    }

    public static isDraggable(file: Nullable<FileData>): file is FileData {
        // File & folders are draggable by default, `null` is not
        return !!file && file.draggable !== false;
    }

    public static isDroppable(file: Nullable<FileData>): file is FileData {
        // Folders are droppable by default, files are not
        if (!file) return false;
        if (file.isDir && file.droppable !== false) return true;
        return file.droppable === true;
    }
}
