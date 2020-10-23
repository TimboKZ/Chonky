import React, { useImperativeHandle } from 'react';
import { useDispatch, useStore } from 'react-redux';

import { reduxActions} from '../redux/reducers';
import { selectSelectionMap } from '../redux/selectors';
import { RootState } from '../redux/types';
import { FileBrowserHandle } from '../types/file-browser.types';

export const useFileBrowserHandle = (ref: React.Ref<FileBrowserHandle>) => {
    const store = useStore<RootState>();
    const dispatch = useDispatch();

    useImperativeHandle(
        ref,
        () => ({
            getFileSelection: () => {
                const selectionMap = selectSelectionMap(store.getState());
                const selectionSet = new Set(Object.keys(selectionMap));
                return selectionSet;
            },
            setFileSelection: (selection, reset = true) => {
                const fileIds = Array.from(selection);
                dispatch(reduxActions.selectFiles({ fileIds, reset }));
            },
        }),
        [store, dispatch]
    );
};
