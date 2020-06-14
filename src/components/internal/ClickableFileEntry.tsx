import React, { useContext } from 'react';
import { Nilable } from 'tsdef';

import { ChonkyDispatchSpecialActionContext } from '../../util/context';
import { FileHelper } from '../../util/file-helper';
import { SpecialAction, SpecialClickFileAction } from '../../util/special-actions';
import { BaseFileEntry, FileEntryProps } from './BaseFileEntry';

export const ClickableFileEntry: React.FC<FileEntryProps> = (props) => {
    const { file } = props;

    const dispatchSpecialAction = useContext(ChonkyDispatchSpecialActionContext);
    // TODO: Read this from context.
    const doubleClickDelay = 300;

    // Deal with clicks
    let clickCount = 0; // Deliberately mutable
    let clickTimeout: Nilable<number>; // Deliberately mutable
    const onClick = (event: React.MouseEvent) => {
        if (!FileHelper.isClickable(file)) return;

        const actionData: SpecialClickFileAction = {
            actionName: SpecialAction.ClickFile,
            file,
            clickType: 'single',
        };

        clickCount++;
        if (clickCount === 1) {
            event.preventDefault();
            actionData.clickType = 'single';
            dispatchSpecialAction(actionData);

            clickCount = 1;
            // @ts-ignore
            clickTimeout = setTimeout(() => {
                clickCount = 0;
            }, doubleClickDelay);
        } else if (clickCount >= 2) {
            event.preventDefault();
            actionData.clickType = 'double';
            dispatchSpecialAction(actionData);

            if (typeof clickTimeout === 'number') {
                clearTimeout(clickTimeout);
                clickTimeout = undefined;
                clickCount = 0;
            }
        }
    };

    return (
        <div
            className="chonky-file-entry-clickable-wrapper chonky-fill-parent"
            onClick={onClick}
        >
            <BaseFileEntry {...props} />
        </div>
    );
};
