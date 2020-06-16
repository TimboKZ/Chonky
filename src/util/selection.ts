import { useCallback, useState } from 'react';

import { FileSelection } from '../typedef';

export const useSelection = (disableSelection: boolean) => {
    // TODO: Rewrite using REDUX!
    const [selection, setSelection] = useState<FileSelection>({});

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
        selection,
        selectFiles,
        toggleSelection,
        clearSelection,
    };
};
