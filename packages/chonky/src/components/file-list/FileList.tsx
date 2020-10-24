import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';

import {
    selectDisplayFileIds,
    selectFileViewConfig,
    selectIsGridView,
} from '../../redux/selectors';
import { FileViewConfig } from '../../types/file-view.types';
import { makeChonkyStyles } from '../../util/styles';
import { FileListEmpty } from './FileListEmpty';
import { FileListGrid } from './FileListGrid';
import { FileListList } from './FileListList';

export interface FileListProps {}

export const FileList: React.FC<FileListProps> = React.memo(() => {
    const displayFileIds = useSelector(selectDisplayFileIds);
    const viewConfig = useSelector(selectFileViewConfig);
    const isGridView = useSelector(selectIsGridView);
    const classes = useStyles(viewConfig);

    // In Chonky v0.x, this field was user-configurable. In Chonky v1.x+, we hardcode
    // this to `true` to simplify configuration. Users can just wrap Chonky in their
    // own `div` if they want to have finer control over the height.
    const fillParentContainer = true;

    const listRenderer = useCallback(
        ({ width, height }: { width: number; height: number }) => {
            if (displayFileIds.length === 0) {
                return <FileListEmpty width={width} height={viewConfig.entryHeight} />;
            } else if (isGridView) {
                return <FileListGrid width={width} height={height} />;
            } else {
                return <FileListList width={width} height={height} />;
            }
        },
        [displayFileIds, viewConfig, isGridView]
    );

    return (
        <div className={classes.fileListWrapper}>
            <AutoSizer disableHeight={!fillParentContainer}>{listRenderer}</AutoSizer>
        </div>
    );
});

const useStyles = makeChonkyStyles(() => ({
    fileListWrapper: {
        minHeight: (viewConfig: FileViewConfig) => viewConfig.entryHeight,
        height: '100%',
    },
}));
