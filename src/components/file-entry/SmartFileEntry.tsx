/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React from 'react';
import { useRecoilValue } from 'recoil';
import { Nullable } from 'tsdef';

import { enableDragAndDropState } from '../../recoil/drag-and-drop.recoil';
import { fileDataState } from '../../recoil/files.recoil';
import { fileSelectedState } from '../../recoil/selection.recoil';
import { FileEntryProps } from './BaseFileEntry';
import { ClickableFileEntry } from './ClickableFileEntry';
import { DnDFileEntry } from './DnDFileEntry';

export interface SmartFileEntryProps {
    fileId: Nullable<string>;
    displayIndex: number;
}

export const SmartFileEntry: React.FC<SmartFileEntryProps> = React.memo((props) => {
    const { fileId, displayIndex } = props;

    const file = useRecoilValue(fileDataState(fileId));
    const selected = useRecoilValue(fileSelectedState(fileId));
    const enableDragAndDrop = useRecoilValue(enableDragAndDropState);

    const entryProps: FileEntryProps = {
        file,
        displayIndex,
        selected,
    };

    return enableDragAndDrop ? (
        <DnDFileEntry {...entryProps} />
    ) : (
        <ClickableFileEntry {...entryProps} />
    );
});
