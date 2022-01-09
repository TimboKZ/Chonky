import { useEffect } from 'react';
import watch from 'redux-watch';

import { Store } from '@reduxjs/toolkit';

import { ChonkyActions } from '../action-definitions';
import { RootState } from '../types/redux.types';
import { FileSelection } from '../types/selection.types';
import { selectSelectedFileIds, selectSelectionMap } from './selectors';
import { thunkRequestFileAction } from './thunks/dispatchers.thunks';

export const useStoreWatchers = (store: Store<RootState>) => {
  useEffect(() => {
    const selectionWatcher = watch(() => selectSelectionMap(store.getState()));
    const onSelectionChange = (newSelection: FileSelection, oldSelection: FileSelection) => {
      // We don't check for deep equality here as we expect the
      // reducers to prevent all unnecessary updates.
      if (newSelection === oldSelection) return;

      // Notify users the selection has changed.
      const selectedFilesIds = selectSelectedFileIds(store.getState());
      const selection = new Set<string>(selectedFilesIds);
      store.dispatch(
        thunkRequestFileAction(ChonkyActions.ChangeSelection, {
          selection,
        }) as any,
      );
    };

    const unsubscribeCallbacks = [store.subscribe(selectionWatcher(onSelectionChange))];
    return () => {
      for (const unsubscribe of unsubscribeCallbacks) unsubscribe();
    };
  }, [store]);
};
