import { useCallback, useContext } from 'react';
import { Nullable } from 'tsdef';

import { FileData } from '../../types/files.types';
import {
    SpecialAction,
    SpecialFileMouseClickAction,
} from '../../types/special-actions.types';
import { ChonkyDispatchSpecialActionContext } from '../../util/context';
import { KeyboardClickEvent, MouseClickEvent } from './ClickableWrapper';

export const useFileClickHandlers = (file: Nullable<FileData>) => {
    const dispatchSpecialAction = useContext(ChonkyDispatchSpecialActionContext);

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
                altKey: event.altKey,
                ctrlKey: event.ctrlKey,
                shiftKey: event.shiftKey,
            });
        },
        [file, dispatchSpecialAction]
    );
    const onKeyboardClick = useCallback(
        (event: KeyboardClickEvent) => {
            if (!file) return;

            dispatchSpecialAction({
                actionId: SpecialAction.KeyboardClickFile,
                file,
                enterKey: event.enterKey,
                spaceKey: event.spaceKey,
                altKey: event.altKey,
                ctrlKey: event.ctrlKey,
                shiftKey: event.shiftKey,
            });
        },
        [file, dispatchSpecialAction]
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
