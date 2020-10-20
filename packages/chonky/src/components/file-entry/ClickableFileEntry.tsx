import React, { useState } from 'react';

import { FileHelper } from '../../util/file-helper';
import { ClickableWrapper, ClickableWrapperProps } from '../internal/ClickableWrapper';
import { useFileClickHandlers } from './ClickableFileEntry-hooks';
import { FileEntryProps } from './FileEntry';
import { FileEntryGrid } from './FileEntryGrid';
import { FileEntryList } from './FileEntryList';

export const ClickableFileEntry: React.FC<FileEntryProps> = React.memo((props) => {
    const { file, displayIndex, isGridView } = props;

    const fileClickHandlers = useFileClickHandlers(file, displayIndex);
    const [focused, setFocused] = useState(false);

    const wrapperProps: ClickableWrapperProps = {
        wrapperTag: 'div',
        passthroughProps: {
            className: 'chonky-file-entry-clickable-wrapper chonky-fill-parent',
        },
        ...(FileHelper.isClickable(file) ? fileClickHandlers : undefined),
        setFocused,
    };

    return (
        <ClickableWrapper {...wrapperProps}>
            {isGridView ? (
                <FileEntryGrid {...props} focused={focused} />
            ) : (
                <FileEntryList {...props} focused={focused} />
            )}
        </ClickableWrapper>
    );
});
