/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React from 'react';
import { useRecoilValue } from 'recoil';

import { enableDragAndDropState } from '../../recoil/drag-and-drop.recoil';
import { selectionModifiersState } from '../../recoil/selection.recoil';
import { ErrorMessageData } from '../../types/validation.types';
import { useClickListener } from '../../util/hooks-helpers';
import { DnDFileListDragLayer } from '../file-entry/DnDFileListDragLayer';
import { ErrorMessage } from './ErrorMessage';

export interface ChonkyPresentationLayerProps {
    validationErrors: ErrorMessageData[];
}

export const ChonkyPresentationLayer: React.FC<ChonkyPresentationLayerProps> = (
    props
) => {
    const { validationErrors, children } = props;

    const selectionModifiers = useRecoilValue(selectionModifiersState);
    const enableDragAndDrop = useRecoilValue(enableDragAndDropState);

    // Deal with clicks outside of Chonky
    const chonkyRootRef = useClickListener({
        onOutsideClick: selectionModifiers.clearSelection,
    });

    return (
        <div ref={chonkyRootRef} className="chonky-root chonky-no-select">
            {enableDragAndDrop && <DnDFileListDragLayer />}
            {validationErrors.map((data, index) => (
                <ErrorMessage
                    key={`error-message-${index}`}
                    message={data.message}
                    bullets={data.bullets}
                />
            ))}
            {children ? children : null}
        </div>
    );
};
