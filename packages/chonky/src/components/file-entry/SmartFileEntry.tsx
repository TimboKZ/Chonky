/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React from 'react';
import { useSelector } from 'react-redux';
import { Nullable } from 'tsdef';

import {
    selectFileData,
    selectIsDnDDisabled,
    selectIsFileSelected,
} from '../../redux/selectors';
import { useParamSelector } from '../../redux/store';
import { ClickableFileEntry } from './ClickableFileEntry';
import { DnDFileEntry } from './DnDFileEntry';
import { FileEntryProps } from './FileEntry';

export interface SmartFileEntryProps {
    fileId: Nullable<string>;
    displayIndex: number;
    isGridView: boolean;
}

export const SmartFileEntry: React.FC<SmartFileEntryProps> = React.memo((props) => {
    const { fileId, displayIndex, isGridView } = props;

    const file = useParamSelector(selectFileData, fileId);
    const selected = useParamSelector(selectIsFileSelected, fileId);
    const dndDisabled = useSelector(selectIsDnDDisabled);

    const entryProps: FileEntryProps = {
        file,
        displayIndex,
        selected,
        isGridView,
    };

    return dndDisabled ? (
        <ClickableFileEntry {...entryProps} />
    ) : (
        <DnDFileEntry {...entryProps} />
    );
});
