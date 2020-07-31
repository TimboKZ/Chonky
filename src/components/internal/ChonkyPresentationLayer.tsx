/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React, { useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { enableDragAndDropState } from '../../recoil/drag-and-drop.recoil';
import { fileActionsState } from '../../recoil/file-actions.recoil';
import { selectionModifiersState } from '../../recoil/selection.recoil';
import { ErrorMessageData } from '../../types/validation.types';
import { useClickListener } from '../../util/hooks-helpers';
import { DnDFileListDragLayer } from '../file-entry/DnDFileListDragLayer';
import { ErrorMessage } from './ErrorMessage';
import { HotkeyListener } from './HotkeyListener';

export interface ChonkyPresentationLayerProps {
    validationErrors: ErrorMessageData[];
}

export const ChonkyPresentationLayer: React.FC<ChonkyPresentationLayerProps> = (
    props
) => {
    const { validationErrors, children } = props;

    const fileActions = useRecoilValue(fileActionsState);
    const selectionModifiers = useRecoilValue(selectionModifiersState);
    const enableDragAndDrop = useRecoilValue(enableDragAndDropState);

    // Deal with clicks outside of Chonky
    const chonkyRootRef = useClickListener({
        // We only clear out the selection on outside click if the click target was
        // not a button. We don't want to clear out the selection when a button is
        // clicked because Chonky users might want to trigger some
        // selection-related action on that button click.
        onOutsideClick: (event, targetIsAButton) =>
            targetIsAButton ? null : selectionModifiers.clearSelection(),
    });

    // Generate necessary components
    const hotkeyListenerComponents = useMemo(
        () =>
            fileActions.map((action) => (
                <HotkeyListener
                    key={`file-action-listener-${action.id}`}
                    fileActionId={action.id}
                />
            )),
        [fileActions]
    );
    const validationErrorComponents = useMemo(
        () =>
            validationErrors.map((data, index) => (
                <ErrorMessage
                    key={`error-message-${index}`}
                    message={data.message}
                    bullets={data.bullets}
                />
            )),
        [validationErrors]
    );

    return (
        <div ref={chonkyRootRef} className="chonky-root chonky-no-select">
            {enableDragAndDrop && <DnDFileListDragLayer />}
            {hotkeyListenerComponents}
            {validationErrorComponents}
            {children ? children : null}
        </div>
    );
};
