/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React from 'react';
import { Nullable } from 'tsdef';

import { FileData } from '../../types/file.types';
import { makeLocalChonkyStyles } from '../../util/styles';
import { useFileNameComponent, useModifierIconComponents } from './FileEntry-hooks';

export interface FileEntryNameProps {
    file: Nullable<FileData>;
    className?: string;
}

export const FileEntryName: React.FC<FileEntryNameProps> = React.memo(({ file, className }) => {
    const modifierIconComponents = useModifierIconComponents(file);
    const fileNameComponent = useFileNameComponent(file);

    const classes = useStyles();
    return (
        <span className={className} title={file ? file.name : undefined}>
            {modifierIconComponents.length > 0 && (
                <span className={classes.modifierIcons}>{modifierIconComponents}</span>
            )}
            {fileNameComponent}
        </span>
    );
});
FileEntryName.displayName = 'FileEntryName';

const useStyles = makeLocalChonkyStyles(theme => ({
    modifierIcons: {
        color: theme.palette.text.hint,
        position: 'relative',
        fontSize: '0.775em',
        paddingRight: 5,
    },
}));
