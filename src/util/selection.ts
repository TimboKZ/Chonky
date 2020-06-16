import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Nullable } from 'tsdef';

import { FileArray, FileData, FileFilter, FileSelection } from '../typedef';
import { FileHelper } from './file-helper';

export const useSelection = (files: FileArray, disableSelection: boolean) => {
    // Create React-managed state for components that need to re-render on state change.
    const [selection, setSelection] = useState<FileSelection>({});

    const { selectFiles, toggleSelection, clearSelection } = useSelectionModifiers(
        disableSelection,
        setSelection
    );

    // Create selection ref for functions that need selection but shouldn't re-render
    const selectionUtilRef = useRef<SelectionUtil>(
        new UpdateableSelectionUtil(files, selection)
    );
    useEffect(() => {
        (selectionUtilRef.current as UpdateableSelectionUtil).update(files, selection);
    }, [files, selection]);

    return {
        selection,
        selectionUtilRef,
        selectFiles,
        toggleSelection,
        clearSelection,
    };
};

const useSelectionModifiers = (
    disableSelection: boolean,
    setSelection: React.Dispatch<React.SetStateAction<FileSelection>>
) => {
    const deps = [disableSelection, setSelection];
    const selectFiles = useCallback((fileIds: string[], reset: boolean = true) => {
        if (disableSelection) return;

        setSelection((selection) => {
            const newSelection = reset ? {} : { ...selection };
            for (const fileId of fileIds) newSelection[fileId] = true;
            return newSelection;
        });
    }, deps);
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
        deps
    );
    const clearSelection = useCallback(() => {
        if (disableSelection) return;

        setSelection({});
    }, deps);

    return {
        selectFiles,
        toggleSelection,
        clearSelection,
    };
};

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
        ...filters: FileFilter[]
    ): ReadonlyArray<Readonly<FileData>> {
        const files = this.files;
        const selection = this.selection;

        const selectedFiles = files.filter(
            (file) => FileHelper.isSelectable(file) && selection[file.id] === true
        ) as FileData[];

        return filters.reduce(
            (prevFiles, filter) => prevFiles.filter(filter),
            selectedFiles
        );
    }
    public getSelectionSize(...filters: FileFilter[]): number {
        return this.getSelectedFiles(...filters).length;
    }
    public isSelected(file: Nullable<FileData>): boolean {
        const selection = this.selection;

        return FileHelper.isSelectable(file) && selection[file.id] === true;
    }
}

class UpdateableSelectionUtil extends SelectionUtil {
    public update(...args: Parameters<SelectionUtil['protectedUpdate']>) {
        this.protectedUpdate(...args);
    }
}
