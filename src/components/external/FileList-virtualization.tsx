import c from 'classnames';
import React, { useCallback, useContext } from 'react';

import { FileArray } from '../../typedef';
import { ChonkyDisableDragNDropContext } from '../../util/context';
import { BaseFileEntry, FileEntryProps } from '../internal/BaseFileEntry';
import { DnDFileEntry } from '../internal/DnDFileEntry';
import { ChonkyIconFA, ChonkyIconName } from './ChonkyIcon';

export interface EntrySize {
    width: number;
    height: number;
}

export const SmallThumbsSize: EntrySize = { width: 160, height: 120 };

export const getColWidth = (
    index: number,
    columnCount: number,
    entrySize: EntrySize,
    gutterSize: number
) => {
    if (index === columnCount - 1) return entrySize.width;
    return entrySize.width + gutterSize;
};

export const getRowHeight = (
    index: number,
    rowCount: number,
    entrySize: EntrySize,
    gutterSize: number
) => {
    if (index === rowCount - 1) return entrySize.height;
    return entrySize.height + gutterSize;
};

export const useEntryRenderer = (files: FileArray) => {
    const disableDragNDrop = useContext(ChonkyDisableDragNDropContext);
    // All hook parameters should go into `deps` array
    const deps = [files, disableDragNDrop];
    const entryRenderer = useCallback(
        (
            virtualKey: string,
            index: number,
            style: any,
            parent: any,
            gutterSize?: number,
            lastRow?: boolean,
            lastColumn?: boolean
        ) => {
            if (typeof gutterSize === 'number') {
                if (!lastRow) style.height = style.height - gutterSize;

                if (!lastColumn) style.width = style.width - gutterSize;
            }

            // When rendering the file list, some browsers cut off the last pixel of
            // a file entry, making it look ugly. To get around this rendering bug
            // we make file entries in the last row/column 1 pixel shorter.
            // TODO: Instead of subtracting 1 here, add 1 to width/height of last
            //  column.
            if (lastRow) style.height = style.height - 1;
            if (lastColumn) style.width = style.width - 1;

            if (index >= files.length) return null;
            const file = files[index];
            const key = file ? file.id : `loading-file-${virtualKey}`;
            const entryProps: FileEntryProps = {
                file,
                displayIndex: index,
            };

            const fileEntryComponent = disableDragNDrop ? (
                <BaseFileEntry {...entryProps} />
            ) : (
                <DnDFileEntry {...entryProps} />
            );
            return (
                <div key={key} className="chonky-virtualization-wrapper" style={style}>
                    {fileEntryComponent}
                </div>
            );
        },
        deps
    );

    return entryRenderer;
};

export const noContentRenderer = (height?: number) => {
    const placeholderProps: any = {
        className: c({
            'chonky-file-list-notification': true,
            'chonky-file-list-notification-empty': true,
        }),
    };
    if (typeof height === 'number') placeholderProps.style = { height };

    return (
        <div {...placeholderProps}>
            <div className="chonky-file-list-notification-content">
                <ChonkyIconFA icon={ChonkyIconName.folderOpen} />
                &nbsp; Nothing to show
            </div>
        </div>
    );
};
