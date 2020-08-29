import c from 'classnames';
import React, { CSSProperties, useCallback } from 'react';
import { FixedSizeGrid, FixedSizeList } from 'react-window';
import { useRecoilValue } from 'recoil';
import { Nilable } from 'tsdef';

import { filesState } from '../../recoil/files.recoil';
import { FileViewConfig } from '../../types/file-view.types';
import { FileData } from '../../types/files.types';
import { ChonkyIconName } from '../../types/icons.types';
import { isMobileDevice } from '../../util/validation';
import { SmartFileEntry } from '../file-entry/SmartFileEntry';
import { ChonkyIconFA } from './ChonkyIcon';

interface NoContentNotificationProps {
    width: number;
    height: number;
}

const NoContentNotification: React.FC<NoContentNotificationProps> = (props) => {
    const { width, height } = props;
    const className = c({
        'chonky-file-list-notification': true,
        'chonky-file-list-notification-empty': true,
    });
    const style: CSSProperties = {
        width,
        height,
    };

    return (
        <div className={className} style={style}>
            <div className="chonky-file-list-notification-content">
                <ChonkyIconFA icon={ChonkyIconName.folderOpen} />
                &nbsp; Nothing to show
            </div>
        </div>
    );
};

const fileListItemRenderer = (
    index: number,
    file: Nilable<FileData>,
    isGridView: boolean,
    style: CSSProperties,
    gutter: number = 0
) => {
    if (file === undefined) return null;

    let styleWithGutter: CSSProperties = style;
    if (gutter) {
        styleWithGutter = {
            ...style,
            left: (style.left as number) + gutter,
            right: (style.right as number) + gutter,
            width: (style.width as number) - gutter,
            height: (style.height as number) - gutter,
        };
    }

    return (
        <div style={styleWithGutter}>
            <SmartFileEntry
                fileId={file ? file.id : null}
                displayIndex={index}
                isGridView={isGridView}
            />
        </div>
    );
};

export const useFileListRenderer = (viewConfig: FileViewConfig) => {
    const files = useRecoilValue(filesState);

    return useCallback(
        ({ width, height }: { width: number; height: number }) => {
            const fileCount = files.length;
            const getItemKey = (index: number) =>
                files[index]?.id ?? `loading-file-${index}`;

            if (fileCount === 0) {
                return (
                    <NoContentNotification
                        width={width}
                        height={viewConfig.entryHeight}
                    />
                );
            }

            if (viewConfig.entryWidth) {
                // When entry size is specified, we use Grid view
                const isMobile = isMobileDevice();
                const gutter = isMobile ? 5 : 8;
                const scrollbar = isMobile ? 0 : 16;
                const columnWidth = isMobile ? 0 : viewConfig.entryWidth + gutter;

                const columnCount = isMobile
                    ? 2
                    : Math.max(1, Math.floor((width - scrollbar) / columnWidth));
                const rowCount = Math.ceil(fileCount / columnCount);

                const cellRenderer = (data: {
                    rowIndex: number;
                    columnIndex: number;
                    style: CSSProperties;
                }) => {
                    const index = data.rowIndex * columnCount + data.columnIndex;
                    return fileListItemRenderer(
                        index,
                        files[index],
                        true,
                        data.style,
                        gutter
                    );
                };

                return (
                    <FixedSizeGrid
                        className="chonky-file-list-grid-view"
                        style={{
                            marginLeft: -gutter,
                            marginRight: -gutter,
                            marginBottom: -gutter,
                        }}
                        columnWidth={viewConfig.entryWidth + gutter}
                        rowHeight={viewConfig.entryHeight + gutter}
                        columnCount={columnCount}
                        height={height}
                        rowCount={rowCount}
                        width={width}
                        itemKey={(data) =>
                            getItemKey(data.rowIndex * columnCount + data.columnIndex)
                        }
                    >
                        {cellRenderer}
                    </FixedSizeGrid>
                );
            } else {
                // When entry size is null, we use List view
                const rowRenderer = (data: { index: number; style: CSSProperties }) => {
                    return fileListItemRenderer(
                        data.index,
                        files[data.index],
                        false,
                        data.style
                    );
                };

                return (
                    <FixedSizeList
                        className="chonky-file-list-list-view"
                        itemSize={viewConfig.entryHeight}
                        height={height}
                        itemCount={fileCount}
                        width={width}
                        itemKey={(index) => getItemKey(index)}
                    >
                        {rowRenderer}
                    </FixedSizeList>
                );
            }
        },
        [viewConfig, files]
    );
};
