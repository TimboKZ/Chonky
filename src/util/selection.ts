import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Nilable, Nullable } from 'tsdef';

import {
    FileArray,
    FileData,
    FileFilter,
    ReadonlyFileArray,
} from '../types/files.types';
import { FileSelection, SelectionModifiers } from '../types/selection.types';
import { FileHelper } from './file-helper';

export const useSelection = (files: FileArray, disableSelection: boolean) => {
    // Create React-managed state for components that need to re-render on state change.
    const [selection, setSelection] = useState<FileSelection>({});

    // Pre-compute selection size for components that are only interested in the
    // number of selected files but not the actual files
    const selectionSize = useMemo(
        () => SelectionHelper.getSelectionSize(files, selection),
        [files, selection]
    );

    // Create callbacks for updating selection. These will update the React
    // state `selection`, causing re-renders. This is intentional.
    const selectionModifiers = useSelectionModifiers(disableSelection, setSelection);

    // Create selection ref for functions that need selection but shouldn't re-render
    const selectionUtilRef = useRef<SelectionUtil>(
        new UpdateableSelectionUtil(files, selection)
    );
    useEffect(() => {
        (selectionUtilRef.current as UpdateableSelectionUtil).update(files, selection);
    }, [files, selection]);

    return {
        selection,
        selectionSize,
        selectionUtilRef,
        selectionModifiers,
    };
};

const useSelectionModifiers = (
    disableSelection: boolean,
    setSelection: React.Dispatch<React.SetStateAction<FileSelection>>
): SelectionModifiers => {
    const selectFiles = useCallback(
        (fileIds: string[], reset: boolean = true) => {
            if (disableSelection) return;

            setSelection((selection) => {
                const newSelection = reset ? {} : { ...selection };
                for (const fileId of fileIds) newSelection[fileId] = true;
                return newSelection;
            });
        },
        [disableSelection, setSelection]
    );
    const toggleSelection = useCallback(
        (fileId: string, exclusive: boolean = false) => {
            if (disableSelection) return;

            setSelection((selection) => {
                const newSelection = exclusive ? {} : { ...selection };
                if (selection[fileId] === true) {
                    delete newSelection[fileId];
                } else {
                    newSelection[fileId] = true;
                }
                return newSelection;
            });
        },
        [disableSelection, setSelection]
    );
    const clearSelection = useCallback(() => {
        if (disableSelection) return;

        setSelection((oldSelection) => {
            if (Object.keys(oldSelection).length === 0) return oldSelection;
            return {};
        });
    }, [disableSelection, setSelection]);

    const selectionModifiers = useMemo(
        () => ({
            selectFiles,
            toggleSelection,
            clearSelection,
        }),
        [selectFiles, toggleSelection, clearSelection]
    );

    return selectionModifiers;
};

/**
 * This helper relies on the `files` and `selection` objects to be passed from the
 * outside. It is safe to use in React components because it doesn't have any
 * internal state, and all methods are static.
 */
export class SelectionHelper {
    public static getSelectedFiles(
        files: ReadonlyFileArray,
        selection: Readonly<FileSelection>,
        ...filters: Nilable<FileFilter>[]
    ): ReadonlyArray<Readonly<FileData>> {
        const selectedFiles = files.filter(
            (file) => FileHelper.isSelectable(file) && selection[file.id] === true
        ) as FileData[];

        return filters.reduce(
            (prevFiles, filter) => (filter ? prevFiles.filter(filter) : prevFiles),
            selectedFiles
        );
    }
    public static getSelectionSize(
        files: ReadonlyFileArray,
        selection: Readonly<FileSelection>,
        ...filters: Nilable<FileFilter>[]
    ): number {
        return SelectionHelper.getSelectedFiles(files, selection, ...filters).length;
    }
    public static isSelected(
        selection: Readonly<FileSelection>,
        file: Nullable<Readonly<FileData>>
    ): boolean {
        return FileHelper.isSelectable(file) && selection[file.id] === true;
    }
}

/**
 * This `SelectionUtil` contains an internal reference to `files` and `selection`
 * objects. It is exposed via a React context, and is meant to be used in functions
 * that need to access selection WITHOUT triggering re-renders.
 */
export class SelectionUtil {
    private files: FileArray;
    private selection: FileSelection;

    public constructor(files: FileArray = [], selection: FileSelection = {}) {
        this.protectedUpdate(files, selection);
    }

    protected protectedUpdate(files: FileArray, selection: FileSelection) {
        this.files = files;
        this.selection = selection;
    }

    public getSelection(): Readonly<FileSelection> {
        return this.selection;
    }
    public getSelectedFiles(
        ...filters: Nilable<FileFilter>[]
    ): ReadonlyArray<Readonly<FileData>> {
        return SelectionHelper.getSelectedFiles(this.files, this.selection, ...filters);
    }
    public getSelectionSize(...filters: Nilable<FileFilter>[]): number {
        return SelectionHelper.getSelectionSize(this.files, this.selection, ...filters);
    }
    public isSelected(file: Nullable<FileData>): boolean {
        return SelectionHelper.isSelected(this.selection, file);
    }
}

class UpdateableSelectionUtil extends SelectionUtil {
    public update(...args: Parameters<SelectionUtil['protectedUpdate']>) {
        this.protectedUpdate(...args);
    }
}
