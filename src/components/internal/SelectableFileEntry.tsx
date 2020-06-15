/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React, { useContext } from 'react';

import { ChonkySelectionContext } from '../../util/context';
import { BaseFileEntry, FileEntryProps } from './BaseFileEntry';

export interface SelectableProps {
    selected?: boolean;
}

export const SelectableFileEntry: React.FC<FileEntryProps> = (props) => {
    const { file } = props;

    const selection = useContext(ChonkySelectionContext);
    const isSelected = !!file && selection[file.id];

    return <BaseFileEntry {...props} selected={isSelected} />;
};
