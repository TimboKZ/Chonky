import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Nullable } from 'tsdef';

import { ChonkyActions } from '../../action-definitions/index';
import { reduxActions } from '../../redux/reducers';
import { selectContextMenuMounted } from '../../redux/selectors';
import { thunkRequestFileAction } from '../../redux/thunks/dispatchers.thunks';
import { findElementAmongAncestors } from '../../util/helpers';
import { useInstanceVariable } from '../../util/hooks-helpers';

export const findClosestChonkyFileId = (
    element: HTMLElement | any
): Nullable<string> => {
    const fileEntryWrapperDiv = findElementAmongAncestors(
        element,
        (element: any) =>
            element.tagName &&
            element.tagName.toLowerCase() === 'div' &&
            element.dataset &&
            element.dataset.chonkyFileId
    );
    return fileEntryWrapperDiv ? fileEntryWrapperDiv.dataset.chonkyFileId! : null;
};

export const useContextMenuTrigger = () => {
    const dispatch = useDispatch();
    const contextMenuMountedRef = useInstanceVariable(
        useSelector(selectContextMenuMounted)
    );
    return useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
            // Use default browser context menu when Chonky context menu component
            // is not mounted.
            if (!contextMenuMountedRef.current) return;
            // Users can use Alt+Right Click to bring up browser's default
            // context menu instead of Chonky's context menu.
            if (event.altKey) return;

            event.preventDefault();

            const triggerFileId = findClosestChonkyFileId(event.target);
            dispatch(
                thunkRequestFileAction(ChonkyActions.OpenFileContextMenu, {
                    clientX: event.clientX,
                    clientY: event.clientY,
                    triggerFileId,
                })
            );
        },
        [contextMenuMountedRef, dispatch]
    );
};

export const useContextMenuDismisser = () => {
    const dispatch = useDispatch();
    return useCallback(() => dispatch(reduxActions.hideContextMenu()), [dispatch]);
};
