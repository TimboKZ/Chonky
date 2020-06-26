import React from 'react';

import { FileHelper } from '../../util/file-helper';
import { ClickableWrapper, ClickableWrapperProps } from '../internal/ClickableWrapper';
import { BaseFileEntry, FileEntryProps } from './BaseFileEntry';
import { useFileClickHandlers } from './ClickableFileEntry-hooks';

export const ClickableFileEntry: React.FC<FileEntryProps> = React.memo((props) => {
    const { file, displayIndex } = props;

    const fileClickHandlers = useFileClickHandlers(file, displayIndex);

    const wrapperProps: ClickableWrapperProps = {
        wrapperTag: 'div',
        passthroughProps: {
            className: 'chonky-file-entry-clickable-wrapper chonky-fill-parent',
        },
        ...(FileHelper.isClickable(file) ? fileClickHandlers : undefined),
    };

    return (
        <ClickableWrapper {...wrapperProps}>
            <BaseFileEntry {...props} />
        </ClickableWrapper>
    );
});
