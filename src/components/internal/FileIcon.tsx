/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React from 'react';

import { ChonkyIconFA } from '../external/ChonkyIcon';
import {  FileIconData } from '../../typedef';

export interface FileIconProps {
    iconData: FileIconData;
}

export const FileIcon: React.FC<FileIconProps> = (props) => {
    const { iconData } = props;

    return (
        <div className="chonky-file-icon">
            <ChonkyIconFA icon={iconData.icon} />
        </div>
    );
};
