import React, { useContext, useMemo } from 'react';

import { FileEntryProps } from '../../types/file-list.types';
import { FileHelper } from '../../util/file-helper';
import { ChonkyIconContext } from '../../util/icon-helper';
import { c, makeLocalChonkyStyles } from '../../util/styles';
import { TextPlaceholder } from '../external/TextPlaceholder';
import {
    useDndIcon,
    useFileEntryHtmlProps,
    useFileEntryState,
} from './FileEntry-hooks';
import { FileEntryName } from './FileEntryName';
import { FileEntryState, useCommonEntryStyles } from './GridEntryPreview';

export const ListEntry: React.FC<FileEntryProps> = React.memo(
    ({ file, selected, focused, dndState }) => {
        const entryState: FileEntryState = useFileEntryState(file, selected, focused);
        const { dndIconColor, dndIconName } = useDndIcon(dndState);

        const dndStyle = useMemo(
            () =>
                dndIconName
                    ? {
                          color: dndIconColor,
                      }
                    : undefined,
            [dndIconColor, dndIconName]
        );

        const fileSizeString = FileHelper.getReadableDate(file);
        const fileDateString = FileHelper.getReadableFileSize(file);

        const classes = useStyles(entryState);
        const commonClasses = useCommonEntryStyles(entryState);
        const ChonkyIcon = useContext(ChonkyIconContext);
        const fileEntryHtmlProps = useFileEntryHtmlProps(file);
        return (
            <div
                className={classes.listFileEntry}
                {...fileEntryHtmlProps}
                style={dndStyle}
            >
                <div className={commonClasses.focusIndicator}></div>
                <div
                    className={c([
                        commonClasses.selectionIndicator,
                        classes.listFileEntrySelection,
                    ])}
                ></div>
                <div className={classes.listFileEntryIcon} style={dndStyle}>
                    <ChonkyIcon
                        icon={dndIconName ?? entryState.icon}
                        spin={dndIconName ? false : entryState.iconSpin}
                        fixedWidth={true}
                    />
                </div>
                <div
                    className={classes.listFileEntryName}
                    title={file ? file.name : undefined}
                >
                    <FileEntryName file={file} />
                </div>
                <div className={classes.listFileEntryProperty}>
                    {file ? (
                        fileSizeString ?? <span>—</span>
                    ) : (
                        <TextPlaceholder minLength={5} maxLength={15} />
                    )}
                </div>
                <div className={classes.listFileEntryProperty}>
                    {file ? (
                        fileDateString ?? <span>—</span>
                    ) : (
                        <TextPlaceholder minLength={10} maxLength={20} />
                    )}
                </div>
            </div>
        );
    }
);

const useStyles = makeLocalChonkyStyles((theme) => ({
    listFileEntry: {
        boxShadow: `inset ${theme.listFileEntry.borderColor} 0 -1px 0`,
        fontSize: theme.listFileEntry.fontSize,
        alignItems: 'center',
        position: 'relative',
        display: 'flex',
        height: '100%',
    },
    listFileEntrySelection: {
        opacity: 0.6,
    },
    listFileEntryIcon: {
        color: (state: FileEntryState) => state.color,
        fontSize: theme.listFileEntry.iconFontSize,
        boxSizing: 'border-box',
        padding: [2, 4],
        zIndex: 20,
    },
    listFileEntryName: {
        textOverflow: 'ellipsis',
        boxSizing: 'border-box',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        flex: '1 1 300px',
        paddingLeft: 8,
        zIndex: 20,
    },
    listFileEntryProperty: {
        fontSize: theme.listFileEntry.propertyFontSize,
        boxSizing: 'border-box',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        flex: '0 1 150px',
        padding: [2, 8],
        zIndex: 20,
    },
}));
