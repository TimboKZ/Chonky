import { Store } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import watch from 'redux-watch';

import { FileSelection } from '../types/selection.types';
import { ChonkyActions } from '../util/file-actions-definitions';
import { RootState } from './reducers';
import { getSelectedFiles, selectSelectionMap } from './selectors';
import { thunkDispatchFileAction } from './thunks/file-action-dispatchers.thunks';

export const useStoreWatchers = (store: Store<RootState>) => {
    useEffect(() => {
        const selectionWatcher = watch(() => selectSelectionMap(store.getState()));
        const selectionUnsubscribe = store.subscribe(
            selectionWatcher(
                (newSelection: FileSelection, oldSelection: FileSelection) => {
                    // We don't check for deep equality here as we expect the
                    // reducers to prevent all unnecessary updates.
                    if (newSelection === oldSelection) return;

                    const selectedFiles = getSelectedFiles(store.getState());
                    store.dispatch(
                        thunkDispatchFileAction({
                            actionId: ChonkyActions.ChangeSelection.id,
                            files: selectedFiles,
                        }) as any
                    );
                }
            )
        );

        return () => {
            selectionUnsubscribe();
        };
    }, [store]);
};
