import React from 'react';
import { Nullable } from 'tsdef';
import { useDrag } from 'react-dnd';
import c from 'classnames';

import { FileData } from '../../typedef';

export interface FileEntryProps {
    file: Nullable<FileData>;
    style?: React.CSSProperties,
}

export const FileEntry: React.FC<FileEntryProps> = (props) => {
    const { file, style } = props;

    const [{ isDragging }, drag] = useDrag({
        item: { type: 'chonky-file-entry' },
        canDrag: !!file && file.droppable !== true,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const className = c({
        'chonky-file-list-entry': true,
        'chonky-file-list-entry-dragging': isDragging,
    });

    return (
        <div ref={drag} className={className} style={style}>
            {file ? file.name : '---'}
        </div>
    );
};
