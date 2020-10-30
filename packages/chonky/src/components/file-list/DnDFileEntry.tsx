import React from 'react';
import { DragObjectWithType } from 'react-dnd';
import { Nullable } from 'tsdef';

import { DndEntryState } from '../../types/file-list.types';
import { FileData } from '../../types/file.types';
import { FileHelper } from '../../util/file-helper';
import { makeLocalChonkyStyles } from '../../util/styles';
import { useFileEntryDnD } from './FileEntry-hooks';

export type DnDFileEntryItem = DragObjectWithType & { file: Nullable<FileData> };
export const DnDFileEntryType = 'chonky-file-entry';

export interface DnDFileEntryProps {
    file: Nullable<FileData>;
    selected: boolean;
    children: (dndState: DndEntryState) => React.ReactElement;
}

export const DnDFileEntry = React.memo(
    ({ file, selected, children }: DnDFileEntryProps) => {
        const { drop, drag, dndState } = useFileEntryDnD(file, selected);
        const classes = useStyles();
        return (
            <div ref={drop} className={classes.fillParent}>
                <div
                    ref={FileHelper.isDraggable(file) ? drag : null}
                    className={classes.fillParent}
                >
                    {children(dndState)}
                </div>
            </div>
        );
    }
);

export const useStyles = makeLocalChonkyStyles((theme) => ({
    fillParent: {
        height: '100%',
    },
}));
