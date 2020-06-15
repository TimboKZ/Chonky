import { useCallback, useContext } from 'react';
import { Nullable } from 'tsdef';

import { FileData } from '../../typedef';
import { ChonkyDispatchSpecialActionContext } from '../../util/context';
import { SpecialAction, SpecialFileMouseClickAction } from '../../util/special-actions';
import { KeyboardClickEvent, MouseClickEvent } from './ClickableWrapper';

export const useFileClickHandlers = (file: Nullable<FileData>) => {
    const dispatchSpecialAction = useContext(ChonkyDispatchSpecialActionContext);

    // Prepare base handlers
    const handlerDeps = [file, dispatchSpecialAction];
    const onMouseClick = useCallback(
        (
            event: MouseClickEvent,
            clickType: SpecialFileMouseClickAction['clickType']
        ) => {
            if (!file) return;

            dispatchSpecialAction({
                actionName: SpecialAction.MouseClickFile,
                clickType,
                file,
                altKey: event.altKey,
                ctrlKey: event.ctrlKey,
                shiftKey: event.shiftKey,
            });
        },
        handlerDeps
    );
    const onKeyboardClick = useCallback((event: KeyboardClickEvent) => {
        if (!file) return;

        dispatchSpecialAction({
            actionName: SpecialAction.KeyboardClickFile,
            file,
            enterKey: event.enterKey,
            spaceKey: event.spaceKey,
            altKey: event.altKey,
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
        });
    }, handlerDeps);

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
