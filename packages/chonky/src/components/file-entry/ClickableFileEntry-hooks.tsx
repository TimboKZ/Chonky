import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Nullable } from 'tsdef';

import { thunkDispatchSpecialAction } from '../../redux/thunks/file-action-dispatchers.thunks';
import { FileData } from '../../types/files.types';
import {
    SpecialAction,
    SpecialFileMouseClickAction,
} from '../../types/special-actions.types';
import { KeyboardClickEvent, MouseClickEvent } from '../internal/ClickableWrapper';

export const useFileClickHandlers = (
    file: Nullable<FileData>,
    displayIndex: number
) => {
    const dispatch = useDispatch();

    // Prepare base handlers
    const onMouseClick = useCallback(
        (
            event: MouseClickEvent,
            clickType: SpecialFileMouseClickAction['clickType']
        ) => {
            if (!file) return;

            dispatch(
                thunkDispatchSpecialAction({
                    actionId: SpecialAction.MouseClickFile,
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
                thunkDispatchSpecialAction({
                    actionId: SpecialAction.KeyboardClickFile,
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
