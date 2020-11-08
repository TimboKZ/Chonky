import React, { useImperativeHandle } from 'react';
import { useDispatch, useStore } from 'react-redux';

import { reduxActions } from '../redux/reducers';
import { selectSelectionMap } from '../redux/selectors';
import { thunkRequestFileAction } from '../redux/thunks/dispatchers.thunks';
import { FileAction } from '../types/action.types';
import { FileBrowserHandle } from '../types/file-browser.types';
import { RootState } from '../types/redux.types';

export const useFileBrowserHandle = (ref: React.Ref<FileBrowserHandle>) => {
    const store = useStore<RootState>();
    const dispatch = useDispatch();

    useImperativeHandle(
        ref,
        () => ({
            getFileSelection(): Set<string> {
                const selectionMap = selectSelectionMap(store.getState());
                const selectionSet = new Set(Object.keys(selectionMap));
                return selectionSet;
            },
            setFileSelection(selection, reset = true): void {
                const fileIds = Array.from(selection);
                dispatch(reduxActions.selectFiles({ fileIds, reset }));
            },
            requestFileAction<Action extends FileAction>(
                action: Action,
                payload: Action['__payloadType']
            ): Promise<void> {
                return Promise.resolve(
                    dispatch(thunkRequestFileAction(action, payload))
                ).then();
            },
        }),
        [store, dispatch]
    );
};
