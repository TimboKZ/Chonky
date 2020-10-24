import { Store } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import watch from 'redux-watch';

import { ChonkyActions } from '../action-definitions';
import { RootState } from '../types/redux.types';
import { FileSelection } from '../types/selection.types';
import { reduxActions } from './reducers';
import {
    selectDisplayFileIds,
    selectLastClickIndex,
    selectSelectedFileIds,
    selectSelectionMap,
} from './selectors';
import { thunkRequestFileAction } from './thunks/dispatchers.thunks';

export const useStoreWatchers = (store: Store<RootState>) => {
    useEffect(() => {
        const selectionWatcher = watch(() => selectSelectionMap(store.getState()));
        const onSelectionChange = (
            newSelection: FileSelection,
            oldSelection: FileSelection
        ) => {
            // We don't check for deep equality here as we expect the
            // reducers to prevent all unnecessary updates.
            if (newSelection === oldSelection) return;

            // Notify users the selection has changed.
            const selectedFilesIds = selectSelectedFileIds(store.getState());
            const selection = new Set<string>(selectedFilesIds);
            store.dispatch(
                thunkRequestFileAction(ChonkyActions.ChangeSelection, {
                    selection,
                }) as any
            );
        };

        const displayFileIdsWatcher = watch(() =>
            selectDisplayFileIds(store.getState())
        );
        const onDisplayFileIdsChange = (
            oldDisplayFileIds: string[],
            newDisplayFileIds: string[]
        ) => {
            const oldLastClickIndex = selectLastClickIndex(store.getState());
            let newLastClickIndex = oldLastClickIndex;

            if (typeof oldLastClickIndex === 'number') {
                if (oldLastClickIndex > newDisplayFileIds.length - 1) {
                    // Reset last click index if it goes beyond the size of the new
                    // array.
                    newLastClickIndex = null;
                } else if (
                    oldDisplayFileIds[oldLastClickIndex] !==
                    newDisplayFileIds[oldLastClickIndex]
                ) {
                    // Reset last click index if the file ID at the last index has
                    // changed.
                    newLastClickIndex = null;
                }
            }

            // Update last click index in the interface
            if (oldLastClickIndex !== newLastClickIndex) {
                store.dispatch(reduxActions.setLastClickIndex(newLastClickIndex));
            }
        };

        const unsubscribeCallbacks = [
            store.subscribe(selectionWatcher(onSelectionChange)),
            store.subscribe(displayFileIdsWatcher(onDisplayFileIdsChange)),
        ];
        return () => {
            for (const unsubscribe of unsubscribeCallbacks) unsubscribe();
        };
    }, [store]);
};
