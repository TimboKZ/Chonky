/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React from 'react';

import { FileIconData } from '../../typedef';
import { ChonkyIconFA } from '../external/ChonkyIcon';

export interface FileIconProps {
    iconData: FileIconData;
}

export const FileIcon: React.FC<FileIconProps> = React.memo((props) => {
    const { iconData } = props;

    return (
        <div className="chonky-file-icon">
            <ChonkyIconFA icon={iconData.icon} />
        </div>
    );
});
