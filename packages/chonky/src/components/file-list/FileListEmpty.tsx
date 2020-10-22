/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import c from 'classnames';
import React, { CSSProperties } from 'react';

import { ChonkyIconName } from '../../types/icons.types';
import { ChonkyIconFA } from '../external/ChonkyIcon';

export interface FileListEmptyProps {
    width: number;
    height: number;
}

export const FileListEmpty: React.FC<FileListEmptyProps> = (props) => {
    const { width, height } = props;
    const className = c({
        'chonky-file-list-notification': true,
        'chonky-file-list-notification-empty': true,
    });
    const style: CSSProperties = {
        width,
        height,
    };

    return (
        <div className={className} style={style}>
            <div className="chonky-file-list-notification-content">
                <ChonkyIconFA icon={ChonkyIconName.folderOpen} />
                &nbsp; Nothing to show
            </div>
        </div>
    );
};
