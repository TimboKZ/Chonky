/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React, {
    CSSProperties,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useSelector } from 'react-redux';
import { VariableSizeGrid } from 'react-window';

import { selectDisplayFileIds, selectFileViewConfig } from '../../redux/selectors';
import { FileViewConfig } from '../../types/file-view.types';
import { useInstanceVariable } from '../../util/hooks-helpers';
import { isMobileDevice } from '../../util/validation';
import { fileListItemRenderer } from './FileList-hooks';

export interface FileListGridProps {
    width: number;
    height: number;
}

interface GridConfig {
    rowCount: number;
    columnCount: number;
    gutter: number;
}

export const getGridConfig = (
    width: number,
    fileCount: number,
    viewConfig: FileViewConfig
): GridConfig => {
    const isMobile = isMobileDevice();
    const gutter = isMobile ? 5 : 8;
    const scrollbar = isMobile ? 0 : 16;
    const columnWidth = isMobile ? 0 : viewConfig.entryWidth! + gutter;

    const columnCount = isMobile
        ? 2
        : Math.max(1, Math.floor((width - scrollbar) / columnWidth));
    const rowCount = Math.ceil(fileCount / columnCount);

    return {
        rowCount,
        columnCount,
        gutter,
    };
};

export const FileListGrid: React.FC<FileListGridProps> = React.memo((props) => {
    const { width, height } = props;

    const viewConfig = useSelector(selectFileViewConfig);
    const viewConfigRef = useInstanceVariable(viewConfig);
    const displayFileIds = useSelector(selectDisplayFileIds);
    const fileCount = useMemo(() => displayFileIds.length, [displayFileIds]);

    const gridRef = useRef<VariableSizeGrid>();

    // Whenever the grid config changes at runtime, we call a method on the
    // `VariableSizeGrid` handle to reset column width/row height cache.
    // !!! Note that we deliberately update the `gridRef` firsts and update the React
    //     state AFTER that. This is needed to avoid file entries jumping up/down.
    const [gridConfig, setGridConfig] = useState(
        getGridConfig(width, fileCount, viewConfig)
    );
    const gridConfigRef = useRef(gridConfig);
    useEffect(() => {
        const oldConf = gridConfigRef.current;
        const newConf = getGridConfig(width, fileCount, viewConfig);

        gridConfigRef.current = newConf;
        if (gridRef.current) {
            if (oldConf.rowCount !== newConf.rowCount) {
                gridRef.current.resetAfterRowIndex(
                    Math.min(oldConf.rowCount, newConf.rowCount) - 1
                );
            }
            if (oldConf.columnCount !== newConf.columnCount) {
                gridRef.current.resetAfterColumnIndex(
                    Math.min(oldConf.columnCount, newConf.rowCount) - 1
                );
            }
        }

        setGridConfig(newConf);
    }, [setGridConfig, gridConfigRef, width, viewConfig, fileCount]);

    const sizers = useMemo(() => {
        const vc = viewConfigRef;
        const gc = gridConfigRef;
        return {
            getColumnWidth: (index: number) =>
                vc.current.entryWidth! +
                (index === gc.current.columnCount - 1 ? 0 : gc.current.gutter),
            getRowHeight: (index: number) =>
                vc.current.entryHeight +
                (index === gc.current.rowCount - 1 ? 0 : gc.current.gutter),
        };
    }, [viewConfigRef, gridConfigRef]);

    const displayFileIdsRef = useInstanceVariable(useSelector(selectDisplayFileIds));
    const getItemKey = useCallback(
        (data: { columnIndex: number; rowIndex: number; data: any }) => {
            const index =
                data.rowIndex * gridConfigRef.current.columnCount + data.columnIndex;

            return displayFileIdsRef.current[index] ?? `loading-file-${index}`;
        },
        [gridConfigRef, displayFileIdsRef]
    );

    const cellRenderer = useCallback(
        (data: { rowIndex: number; columnIndex: number; style: CSSProperties }) => {
            const gc = gridConfigRef;
            const index = data.rowIndex * gc.current.columnCount + data.columnIndex;
            return fileListItemRenderer(
                index,
                displayFileIds[index],
                true,
                data.style,
                data.rowIndex === gc.current.rowCount - 1 ? 0 : gc.current.gutter,
                data.columnIndex === gc.current.columnCount - 1 ? 0 : gc.current.gutter
            );
        },
        [gridConfigRef, displayFileIds]
    );

    const gridComponent = useMemo(() => {
        return (
            <VariableSizeGrid
                ref={gridRef as any}
                className="chonky-file-list-grid-view"
                estimatedRowHeight={viewConfig.entryHeight + gridConfig.gutter}
                rowHeight={sizers.getRowHeight}
                estimatedColumnWidth={viewConfig.entryWidth! + gridConfig.gutter}
                columnWidth={sizers.getColumnWidth}
                columnCount={gridConfig.columnCount}
                height={height}
                rowCount={gridConfig.rowCount}
                width={width}
                itemKey={getItemKey}
            >
                {cellRenderer}
            </VariableSizeGrid>
        );
    }, [width, height, viewConfig, gridConfig, sizers, getItemKey, cellRenderer]);

    return gridComponent;
});
