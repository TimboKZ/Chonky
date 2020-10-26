/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React, { CSSProperties } from 'react';

import { ChonkyIconName } from '../../types/icons.types';
import { makeGlobalChonkyStyles } from '../../util/styles';
import { ChonkyIconFA } from '../external/ChonkyIcon';

export interface FileListEmptyProps {
    width: number;
    height: number;
}

export const FileListEmpty: React.FC<FileListEmptyProps> = (props) => {
    const { width, height } = props;
    const classes = useStyles();
    const style: CSSProperties = {
        width,
        height,
    };

    return (
        <div className={classes.fileListEmpty} style={style}>
            <div className={classes.fileListEmptyContent}>
                <ChonkyIconFA icon={ChonkyIconName.folderOpen} />
                &nbsp; Nothing to show
            </div>
        </div>
    );
};

const useStyles = makeGlobalChonkyStyles((theme) => ({
    fileListEmpty: {
        color: theme.colors.textSubtle,
        position: 'relative',
        textAlign: 'center',
        fontSize: '1.2em',
    },
    fileListEmptyContent: {
        transform: 'translateX(-50%) translateY(-50%)',
        position: 'absolute',
        left: '50%',
        top: '50%',
    },
}));
