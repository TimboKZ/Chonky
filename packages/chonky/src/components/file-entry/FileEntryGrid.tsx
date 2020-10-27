import React from 'react';

import { FileHelper } from '../../util/file-helper';
import { c, makeLocalChonkyStyles } from '../../util/styles';
import {
    FileEntryPreviewFile,
    FileEntryPreviewFolder,
    FileEntryState,
} from '../file-entry-grid/FileEntryPreview';
import { FileEntryProps } from './FileEntry';
import {
    useCommonFileEntryComponents,
    useFileEntryHtmlProps,
    useThumbnailUrl,
} from './FileEntry-hooks';

export const FileEntryGrid: React.FC<FileEntryProps> = React.memo((props) => {
    const { file, selected, focused } = props;
    const isDirectory = FileHelper.isDirectory(file);

    // Deal with thumbnails
    const { thumbnailUrl, thumbnailLoading } = useThumbnailUrl(file);

    // Get file entry components/properties
    const {
        fileColor,
        iconSpin,
        icon,
        modifierIconComponents,
        fileNameComponent,
    } = useCommonFileEntryComponents(
        props,
        true,
        !!thumbnailUrl,
        thumbnailLoading,
        thumbnailUrl
    );

    const entryState: FileEntryState = {
        childrenCount: FileHelper.getChildrenCount(file),
        icon: file && file.icon !== undefined ? file.icon : icon,
        iconSpin: iconSpin,
        thumbnailUrl: thumbnailUrl,
        color: file && file.color !== undefined ? file.color : fileColor,
        selected: selected,
        focused: !!focused,
    };

    const classes = useFileEntryStyles(entryState);
    const fileEntryHtmlProps = useFileEntryHtmlProps(file);

    const entryClassName = c({
        [classes.gridFileEntry]: true,
    });
    return (
        <div className={entryClassName} {...fileEntryHtmlProps}>
            {isDirectory ? (
                <FileEntryPreviewFolder
                    className={classes.gridFileEntryPreview}
                    entryState={entryState}
                    dndState={props}
                />
            ) : (
                <FileEntryPreviewFile
                    className={classes.gridFileEntryPreview}
                    entryState={entryState}
                    dndState={props}
                />
            )}
            <div
                className={classes.gridFileEntryNameContainer}
                title={file ? file.name : undefined}
            >
                <span className={classes.gridFileEntryName}>
                    {modifierIconComponents.length > 0 && (
                        <span className={classes.gridFileEntryNameModifiers}>
                            {modifierIconComponents}
                        </span>
                    )}
                    {fileNameComponent}
                </span>
            </div>
        </div>
    );
});

const useFileEntryStyles = makeLocalChonkyStyles((theme) => ({
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
        backgroundColor: (state: FileEntryState) =>
            state.selected ? 'rgba(0,153,255, .25)' : 'transparent',
        textDecoration: (state: FileEntryState) =>
            state.focused ? 'underline' : 'none',
        borderRadius: 3,
        padding: [2, 4],
    },
    gridFileEntryNameModifiers: {
        color: theme.gridFileEntry.modifiersColor,
        position: 'relative',
        fontSize: '0.775em',
        paddingRight: 5,
    },
}));
