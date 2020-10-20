import sort from 'fast-sort';
import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { optionState } from '../recoil/options.recoil';
import { sortConfigState } from '../recoil/sort.recoil';
import { FileArray } from '../types/files.types';
import { FileSortKeySelector, SortOrder } from '../types/sort.types';
import { ChonkyActions } from './file-actions-definitions';
import { FileHelper } from './file-helper';

export const useFileSorting = (files: FileArray) => {
    const sortConfig = useRecoilValue(sortConfigState);
    const showFolderFirstState = useRecoilValue(
        optionState(ChonkyActions.ToggleShowFoldersFirst.option.id)
    );

    const sortedFiles = useMemo(() => {
        const sortFunctions: {
            asc?: FileSortKeySelector;
            desc?: FileSortKeySelector;
        }[] = [];

        if (showFolderFirstState) {
            sortFunctions.push({ desc: FileHelper.isDirectory });
        }

        if (sortConfig.order === SortOrder.Asc) {
            sortFunctions.push({ asc: sortConfig.sortKeySelector });
        } else {
            sortFunctions.push({ desc: sortConfig.sortKeySelector });
        }

        sortFunctions.push({ asc: ChonkyActions.SortFilesByName.sortKeySelector });

        // !!! We create a new array because by default `fast-sort` mutates the array!
        return sort([...files]).by(sortFunctions as any);
    }, [files, sortConfig, showFolderFirstState]);

    return sortedFiles;
};
