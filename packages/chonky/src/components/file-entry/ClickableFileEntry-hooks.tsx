import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Nullable } from 'tsdef';

import { selectSpecialActionDispatcher } from '../../redux/selectors';
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
    const dispatchSpecialAction = useSelector(selectSpecialActionDispatcher);

    // Prepare base handlers
    const onMouseClick = useCallback(
        (
            event: MouseClickEvent,
            clickType: SpecialFileMouseClickAction['clickType']
        ) => {
            if (!file) return;

            dispatchSpecialAction({
                actionId: SpecialAction.MouseClickFile,
                clickType,
                file,
                fileDisplayIndex: displayIndex,
                altKey: event.altKey,
                ctrlKey: event.ctrlKey,
                shiftKey: event.shiftKey,
            });
        },
        [file, displayIndex, dispatchSpecialAction]
    );
    const onKeyboardClick = useCallback(
        (event: KeyboardClickEvent) => {
            if (!file) return;

            dispatchSpecialAction({
                actionId: SpecialAction.KeyboardClickFile,
                file,
                fileDisplayIndex: displayIndex,
                enterKey: event.enterKey,
                spaceKey: event.spaceKey,
                altKey: event.altKey,
                ctrlKey: event.ctrlKey,
                shiftKey: event.shiftKey,
            });
        },
        [file, displayIndex, dispatchSpecialAction]
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
