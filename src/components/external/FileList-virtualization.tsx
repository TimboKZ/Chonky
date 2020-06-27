import c from 'classnames';
import React, { useCallback } from 'react';
import { Grid } from 'react-virtualized/dist/commonjs/Grid';
import { Nilable } from 'tsdef';

import { FileEntrySize } from '../../types/file-list-view.types';
import { FileArray } from '../../types/files.types';
import { ChonkyIconName } from '../../types/icons.types';
import { isMobileDevice } from '../../util/validation';
import { SmartFileEntry } from '../file-entry/SmartFileEntry';
import { ChonkyIconFA } from './ChonkyIcon';

export const SmallThumbsSize: FileEntrySize = { width: 165, height: 130 };

export const DefaultEntrySize: FileEntrySize = SmallThumbsSize;

export const getColWidth = (
    index: number,
    columnCount: number,
    entrySize: FileEntrySize,
    gutterSize: number
) => {
    if (index === columnCount - 1) return entrySize.width;
    return entrySize.width + gutterSize;
};

export const getRowHeight = (
    index: number,
    rowCount: number,
    entrySize: FileEntrySize,
    gutterSize: number
) => {
    // We always add `gutterSize` to height because we don't want the last item
    // sticking to the bottom of the scroll pane.
    return entrySize.height + gutterSize;
};

export const useEntryRenderer = (files: FileArray) => {
    // All hook parameters should go into `deps` array
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
                if (!lastColumn) style.width = style.width - gutterSize;

                // We always subtract `gutterSize` to height because we don't want the
                // last item sticking to the bottom of the scroll pane.
                style.height = style.height - gutterSize;
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

            return (
                <div key={key} className="chonky-virtualization-wrapper" style={style}>
                    <SmartFileEntry
                        fileId={file ? file.id : null}
                        displayIndex={index}
                    />
                </div>
            );
        },
        [files]
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

export const useGridRenderer = (
    files: FileArray,
    entrySize: FileEntrySize,
    entryRenderer: ReturnType<typeof useEntryRenderer>,
    thumbsGridRef: React.Ref<Nilable<Grid>>,
    fillParentContainer: boolean
) => {
    return useCallback(
        ({ width, height }) => {
            const isMobile = isMobileDevice();
            const gutter = isMobile ? 5 : 8;
            const scrollbar = !fillParentContainer || isMobile ? 0 : 16;

            // TODO: const isLargeThumbs = view === FileView.LargeThumbs;
            let columnCount: number;
            if (isMobile) {
                // On mobile device, we hardcode column count to 2
                columnCount = 2;
            } else {
                const columnCountFloat =
                    (width + gutter - scrollbar) / (entrySize.width + gutter);
                columnCount = Math.max(1, Math.floor(columnCountFloat));
            }
            const rowCount = Math.ceil(files.length / columnCount);

            return (
                <Grid
                    style={{ minHeight: entrySize.height + 10 }}
                    ref={thumbsGridRef as any}
                    cellRenderer={(data) => {
                        const index = data.rowIndex * columnCount + data.columnIndex;
                        return entryRenderer(
                            data.key,
                            index,
                            { ...data.style },
                            data.parent,
                            gutter,
                            data.rowIndex === rowCount - 1,
                            data.columnIndex === columnCount - 1
                        );
                    }}
                    noContentRenderer={() => noContentRenderer(entrySize.height)}
                    rowCount={rowCount}
                    columnCount={columnCount}
                    columnWidth={({ index }) =>
                        getColWidth(index, columnCount, entrySize, gutter)
                    }
                    rowHeight={({ index }) =>
                        getRowHeight(index, rowCount, entrySize, gutter)
                    }
                    overscanRowCount={2}
                    width={width}
                    containerStyle={{ minHeight: 50 }}
                    height={typeof height === 'number' ? height : 500}
                    autoHeight={!fillParentContainer}
                    tabIndex={null}
                />
            );
        },
        [files, entrySize, entryRenderer, thumbsGridRef, fillParentContainer]
    );
};
