import React, { useImperativeHandle } from 'react';
import { useRecoilValue } from 'recoil';

import { selectionState } from '../recoil/selection.recoil';
import { FileBrowserHandle } from '../types/file-browser.types';
import { FileSelection, SelectionModifiers } from '../types/selection.types';
import { useInstanceVariable } from './hooks-helpers';

export const useFileBrowserHandle = (
    ref: React.Ref<FileBrowserHandle>,
    selectionModifiers: SelectionModifiers
) => {
    const selectionRef = useInstanceVariable(useRecoilValue(selectionState));

    useImperativeHandle(
        ref,
        () => ({
            getFileSelection: () => new Set(selectionRef.current),
            setFileSelection: (selection: FileSelection, reset: boolean = true) =>
                selectionModifiers.selectFiles(Array.from(selection), reset),
        }),
        [selectionModifiers, selectionRef]
    );
};
