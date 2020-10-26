import React, { useState } from 'react';

import { FileHelper } from '../../util/file-helper';
import { makeGlobalChonkyStyles } from '../../util/styles';
import { ClickableWrapper, ClickableWrapperProps } from '../internal/ClickableWrapper';
import { useFileClickHandlers } from './ClickableFileEntry-hooks';
import { FileEntryProps } from './FileEntry';
import { FileEntryGrid } from './FileEntryGrid';
import { FileEntryList } from './FileEntryList';

export const ClickableFileEntry: React.FC<FileEntryProps> = React.memo((props) => {
    const { file, displayIndex, isGridView } = props;

    const fileClickHandlers = useFileClickHandlers(file, displayIndex);
    const [focused, setFocused] = useState(false);

    const classes = useStyles();
    const wrapperProps: ClickableWrapperProps = {
        wrapperTag: 'div',
        passthroughProps: { className: classes.fileEntryClickableWrapper },
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

const useStyles = makeGlobalChonkyStyles((theme) => ({
    fileEntryClickableWrapper: {
        // We disable default browser outline because Chonky provides its own outline
        // (which doesn't compromise accessibility, hopefully)
        outline: 'none !important',
        position: 'relative',
        height: '100%',
    },
}));
