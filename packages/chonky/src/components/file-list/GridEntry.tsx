import React from 'react';

import { FileEntryProps } from '../../types/file-list.types';
import { FileHelper } from '../../util/file-helper';
import { c, makeLocalChonkyStyles } from '../../util/styles';
import { useFileEntryHtmlProps, useFileEntryState } from './FileEntry-hooks';
import { FileEntryName } from './FileEntryName';
import { FileEntryState, GridEntryPreviewFile, GridEntryPreviewFolder } from './GridEntryPreview';

export const GridEntry: React.FC<FileEntryProps> = React.memo(({ file, selected, focused, dndState }) => {
    const isDirectory = FileHelper.isDirectory(file);
    const entryState = useFileEntryState(file, selected, focused);

    const classes = useFileEntryStyles(entryState);
    const fileEntryHtmlProps = useFileEntryHtmlProps(file);
    const entryClassName = c({
        [classes.gridFileEntry]: true,
    });
    return (
        <div className={entryClassName} {...fileEntryHtmlProps}>
            {isDirectory ? (
                <GridEntryPreviewFolder
                    className={classes.gridFileEntryPreview}
                    entryState={entryState}
                    dndState={dndState}
                />
            ) : (
                <GridEntryPreviewFile
                    className={classes.gridFileEntryPreview}
                    entryState={entryState}
                    dndState={dndState}
                />
            )}
            <div className={classes.gridFileEntryNameContainer}>
                <FileEntryName className={classes.gridFileEntryName} file={file} />
            </div>
        </div>
    );
});
GridEntry.displayName = 'GridEntry';

const useFileEntryStyles = makeLocalChonkyStyles(theme => ({
    gridFileEntry: {
        flexDirection: 'column',
        display: 'flex',
        height: '100%',
    },
    gridFileEntryPreview: {
        flexGrow: 1,
    },
    gridFileEntryNameContainer: {
        fontSize: theme.gridFileEntry.fontSize,
        wordBreak: 'break-word',
        textAlign: 'center',
        paddingTop: 5,
    },
    gridFileEntryName: {
        backgroundColor: (state: FileEntryState) => (state.selected ? 'rgba(0,153,255, .25)' : 'transparent'),
        textDecoration: (state: FileEntryState) => (state.focused ? 'underline' : 'none'),
        borderRadius: 3,
        padding: [2, 4],
    },
}));
