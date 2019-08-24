/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import React from 'react';
import {Nullable} from 'tsdef';
import classnames from 'classnames';
import {AutoSizer, Grid, List} from 'react-virtualized';
import {faFolderOpen} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import FileListEntry from './FileListEntry';
import {isMobileDevice, isNil, isNumber, isObject} from '../util/Util';
import {EntrySize, FileData, FileView, InternalClickHandler, Selection, ThumbnailGenerator} from '../typedef';

interface FileListProps {
    files: Nullable<FileData>[];
    selection: Selection;

    // Action handlers and other functions
    doubleClickDelay: number;
    onFileSingleClick: InternalClickHandler;
    onFileDoubleClick: InternalClickHandler;
    thumbnailGenerator?: ThumbnailGenerator;

    // Options
    showRelativeDates: boolean;

    // View & sort settings
    fillParentContainer: boolean;
    view: FileView;
}

interface FileListState {}

const SmallThumbsSize: EntrySize = {width: 200, height: 160};
const LargeThumbsSize: EntrySize = {width: 280, height: 220};

export default class FileList extends React.PureComponent<FileListProps, FileListState> {

    private getColWidth = (index: number, columnCount: number, entrySize: EntrySize, gutterSize: number) => {
        if (index === columnCount - 1) return entrySize.width;
        return entrySize.width + gutterSize;
    };

    private getRowHeight = (index: number, rowCount: number, entrySize: EntrySize, gutterSize: number) => {
        if (index === rowCount - 1) return entrySize.height;
        return entrySize.height + gutterSize;
    };

    private entryRenderer = (virtualKey: string, index: number, style: any,
                            gutterSize?: number, lastRow?: boolean, lastColumn?: boolean) => {
        const {
            files, selection,
            doubleClickDelay, onFileSingleClick, onFileDoubleClick, thumbnailGenerator,
            showRelativeDates, view,
        } = this.props;

        if (isNumber(gutterSize)) {
            if (lastRow !== true) style.height = style.height - gutterSize;
            if (lastColumn !== true) style.width = style.width - gutterSize;
        }

        if (index >= files.length) return null;
        console.log('Rendering file', style);
        const file = files[index];
        const key = isObject(file) ? file.id : `loading-file-${virtualKey}`;
        const selected = isObject(file) ? selection[file.id] === true : false;
        return <FileListEntry key={key}
                              file={file} style={style} selected={selected} displayIndex={index}
                              doubleClickDelay={doubleClickDelay}
                              onFileSingleClick={onFileSingleClick}
                              onFileDoubleClick={onFileDoubleClick}
                              thumbnailGenerator={thumbnailGenerator}
                              showRelativeDates={showRelativeDates} view={view}/>;
    };

    private noContentRenderer = (height?: number) => {
        const placeholderProps: any = {
            className: classnames({
                'chonky-file-list-notification': true,
                'chonky-file-list-notification-empty': true,
            }),
        };
        if (isNumber(height)) placeholderProps.style = {height};

        return <div {...placeholderProps}>
            <div className="chonky-file-list-notification-content">
                <FontAwesomeIcon icon={faFolderOpen}/>
                &nbsp;
                Nothing to show
            </div>
        </div>;
    };

    public render() {
        const {files, fillParentContainer, view} = this.props;

        const isThumbs = view === FileView.SmallThumbs || view === FileView.LargeThumbs;
        const className = classnames({
            'chonky-file-list': true,
            'chonky-file-list-thumbs': isThumbs,
            'chonky-file-list-thumbs-small': isThumbs && view === FileView.SmallThumbs,
            'chonky-file-list-thumbs-large': isThumbs && view === FileView.LargeThumbs,
            'chonky-file-list-details': !isThumbs,
        });

        const autoSizerProps: any = {};
        if (!fillParentContainer) autoSizerProps.disableHeight = true;

        return <div className={className}>
            <AutoSizer {...autoSizerProps}>
                {({width, height}) => {
                    let rowCount: number;

                    if (view === FileView.Details) {
                        rowCount = files.length;
                        const rowHeight = 35;
                        return <List rowRenderer={data => this.entryRenderer(data.key, data.index, data.style)}
                                     noRowsRenderer={() => this.noContentRenderer(rowHeight)}
                                     rowCount={rowCount} rowHeight={rowHeight}
                                     width={width} height={isNil(height) ? 500 : height}
                                     autoHeight={!fillParentContainer}
                                     tabIndex={null}/>;
                    }

                    let columnCount: number;
                    let entrySize: EntrySize;

                    const isMobile = isMobileDevice();
                    const gutterSize = isMobile ? 5 : 10;
                    const scrollbarWidth = (!fillParentContainer || isMobile) ? 0 : 16;

                    const isLargeThumbs = view === FileView.LargeThumbs;
                    if (isMobile && width < 400) {
                        // Hardcode column count on mobile
                        columnCount = isLargeThumbs ? 2 : 3;
                        entrySize = {
                            width: Math.floor((width - gutterSize * (columnCount - 1)) / columnCount),
                            height: isLargeThumbs ? 180 : 140,
                        };
                    } else {
                        entrySize = isLargeThumbs ? LargeThumbsSize : SmallThumbsSize;
                        const columnCountFloat = (width + gutterSize - scrollbarWidth) / (entrySize.width + gutterSize);
                        columnCount = Math.max(1, Math.floor(columnCountFloat));
                    }
                    rowCount = Math.ceil(files.length / columnCount);

                    return <Grid cellRenderer={data => {
                        const index = data.rowIndex * columnCount + data.columnIndex;
                        return this.entryRenderer(data.key, index, {...data.style},
                            gutterSize, data.rowIndex === rowCount - 1, data.columnIndex === columnCount - 1);
                    }}
                                 noContentRenderer={() => this.noContentRenderer(entrySize.height)}
                                 rowCount={rowCount} columnCount={columnCount}
                                 columnWidth={({index}) => this.getColWidth(index, columnCount, entrySize, gutterSize)}
                                 rowHeight={({index}) => this.getRowHeight(index, rowCount, entrySize, gutterSize)}
                                 width={width} height={isNil(height) ? 500 : height}
                                 autoHeight={!fillParentContainer}
                                 tabIndex={null}/>;
                }}
            </AutoSizer>
        </div>;
    }

}
