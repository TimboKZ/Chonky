import React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useRecoilValue } from 'recoil';

import { fileViewConfigState } from '../../recoil/file-view.recoil';
import { useFileListRenderer } from './FileList-virtualization';

export interface FileListProps {}

export const FileList: React.FC<FileListProps> = React.memo(() => {
    const viewConfig = useRecoilValue(fileViewConfigState);

    // In Chonky v0.x, this field was user-configurable. In Chonky v1.x+, we hardcode
    // this to `true` to simplify configuration. Users can just wrap Chonky in their
    // own `div` if they want to have finer control over the height.
    const fillParentContainer = true;

    const gridRenderer = useFileListRenderer(viewConfig);

    return (
        <div className="chonky-file-list" style={{ minHeight: viewConfig.entryHeight }}>
            <AutoSizer disableHeight={!fillParentContainer}>{gridRenderer}</AutoSizer>
        </div>
    );
});
