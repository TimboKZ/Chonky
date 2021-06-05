import { FullFileBrowser, fileMap, setChonkyDefaults } from 'chonky';
import React, { useCallback } from 'react';

import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import DemoFsMap from './demo.fs_map.json';

setChonkyDefaults({ iconComponent: ChonkyIconFA });

const StoryComponent = () => {
    const { data, methods } = fileMap.useFileMap({
        baseFileMap: DemoFsMap.fileMap,
        initialFolderId: DemoFsMap.rootFolderId,
    });
    const thumbnailGenerator = useCallback(
        file =>
            file.thumbnailUrl ? `http://localhost:3000/img/${file.thumbnailUrl}` : null,
        []
    );
    return (
        <FullFileBrowser
            folderChain={data.folderChain}
            files={data.files}
            thumbnailGenerator={thumbnailGenerator}
        />
    );
};

StoryComponent.displayName = 'Mutable FS';
export const MutableFS = StoryComponent;
