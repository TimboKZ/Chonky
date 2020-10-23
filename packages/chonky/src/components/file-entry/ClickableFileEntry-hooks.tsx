import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Nullable } from 'tsdef';

import { ChonkyActions } from '../../file-actons/definitions/index';
import { thunkRequestFileAction } from '../../redux/thunks/file-action-dispatchers.thunks';
import { FileData } from '../../types/files.types';
import { KeyboardClickEvent, MouseClickEvent } from '../internal/ClickableWrapper';

export const useFileClickHandlers = (
    file: Nullable<FileData>,
    displayIndex: number
) => {
    const dispatch = useDispatch();

    // Prepare base handlers
    const onMouseClick = useCallback(
        (event: MouseClickEvent, clickType: 'single' | 'double') => {
            if (!file) return;

            dispatch(
                thunkRequestFileAction(ChonkyActions.MouseClickFile, {
                    clickType,
                    file,
                    fileDisplayIndex: displayIndex,
                    altKey: event.altKey,
                    ctrlKey: event.ctrlKey,
                    shiftKey: event.shiftKey,
                })
            );
        },
        [dispatch, file, displayIndex]
    );
    const onKeyboardClick = useCallback(
        (event: KeyboardClickEvent) => {
            if (!file) return;

            dispatch(
                thunkRequestFileAction(ChonkyActions.KeyboardClickFile, {
                    file,
                    fileDisplayIndex: displayIndex,
                    enterKey: event.enterKey,
                    spaceKey: event.spaceKey,
                    altKey: event.altKey,
                    ctrlKey: event.ctrlKey,
                    shiftKey: event.shiftKey,
                })
            );
        },
        [dispatch, file, displayIndex]
    );

    // Prepare single/double click handlers
    const onSingleClick = useCallback(
        (event: MouseClickEvent) => onMouseClick(event, 'single'),
        [onMouseClick]
    );
    const onDoubleClick = useCallback(
        (event: MouseClickEvent) => onMouseClick(event, 'double'),
        [onMouseClick]
    );

    return {
        onSingleClick,
        onDoubleClick,
        onKeyboardClick,
    };
};
