/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React, { CSSProperties, useContext } from 'react';

import { ChonkyIconName } from '../../types/icons.types';
import { ChonkyIconContext } from '../../util/icon-helper';
import { makeGlobalChonkyStyles } from '../../util/styles';

export interface FileListEmptyProps {
    width: number;
    height: number;
}

export const FileListEmpty: React.FC<FileListEmptyProps> = (props) => {
    const { width, height } = props;
    const classes = useStyles();
    const ChonkyIcon = useContext(ChonkyIconContext);
    const style: CSSProperties = {
        width,
        height,
    };

    return (
        <div className={classes.fileListEmpty} style={style}>
            <div className={classes.fileListEmptyContent}>
                <ChonkyIcon icon={ChonkyIconName.folderOpen} />
                &nbsp; Nothing to show
            </div>
        </div>
    );
};

const useStyles = makeGlobalChonkyStyles((theme) => ({
    fileListEmpty: {
        color: theme.palette.text.disabled,
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
