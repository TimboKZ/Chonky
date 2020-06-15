import { useCallback, useState } from 'react';

import { FileSelection } from '../typedef';

export const useSelection = () => {
    // TODO: Rewrite using REDUX!
    const [selection, setSelection] = useState<FileSelection>({});

    const selectFiles = useCallback((fileIds: string[], reset: boolean = true) => {
        setSelection((selection) => {
            const newSelection = reset ? {} : { ...selection };
            for (const fileId of fileIds) newSelection[fileId] = true;
            return newSelection;
        });
    }, []);
    const toggleSelection = useCallback((fileId: string) => {
        setSelection((selection) => {
            const newSelection = { ...selection };
            if (newSelection[fileId] === true) {
                delete newSelection[fileId];
            } else {
                newSelection[fileId] = true;
            }
            return newSelection;
        });
    }, []);
    const clearSelection = useCallback(() => setSelection({}), [setSelection]);

    return {
        selection,
        selectFiles,
        toggleSelection,
        clearSelection,
    };
};
