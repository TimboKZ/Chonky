/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import React from 'react';
import {Nullable} from 'tsdef';
import classnames from 'classnames';
import {AutoSizer, Grid} from 'react-virtualized';
import {faFolderOpen} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
// import {faArrowDown as DescIcon, faArrowUp as AscIcon, faFolderOpen} from '@fortawesome/free-solid-svg-icons';

import {
    EntrySize,
    FileData,
    FileView,
    InternalClickHandler,
    Selection,
    ThumbnailGenerator,
} from '../typedef';
import FileListEntry from './FileListEntry';
// import ClickableWrapper from './ClickableWrapper';
import {isMobileDevice, isNil, isObject} from '../util/Util';

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

// const HeaderDetails = [
//     [null, ''],
//     [SortProperty.Name, 'Name'],
//     [SortProperty.Size, 'Size'],
//     [SortProperty.ModDate, 'Last change'],
// ];

const SmallThumbsSize: EntrySize = {width: 200, height: 160};
const LargeThumbsSize: EntrySize = {width: 280, height: 220};

export default class FileList extends React.PureComponent<FileListProps, FileListState> {

    // private renderDetailsHeaders() {
    //     const {doubleClickDelay, sortProperty, sortOrder, activateSortProperty} = this.props;
    //     const comps = new Array(HeaderDetails.length);
    //     for (let i = 0; i < HeaderDetails.length; ++i) {
    //         const [name, title] = HeaderDetails[i];
    //         const headerProps = !isString(name) ? {} : {
    //             tabIndex: 0,
    //             className: classnames({
    //                 'chonky-clickable': true,
    //                 'chonky-active': sortProperty === name,
    //             }),
    //         };
    //         let onClick = undefined;
    //         if (!isNil(name)) {
    //             onClick = () => {
    //                 activateSortProperty(name as SortProperty);
    //                 return true;
    //             };
    //         }
    //         comps[i] = <ClickableWrapper key={`header-${name}`} wrapperTag={'div'}
    //                                      passthroughProps={headerProps} doubleClickDelay={doubleClickDelay}
    //                                      onAllClicks={onClick}>
    //             {title}
    //             {/* eslint-disable-next-line */}
    //             {sortProperty === name &&
    //             <span className="chonky-text-subtle">
    //                 &nbsp;
    //                 <FontAwesomeIcon icon={sortOrder === SortOrder.Asc ? AscIcon : DescIcon}
    //                                  fixedWidth={true} size="sm"/>
    //             </span>
    //             }
    //         </ClickableWrapper>;
    //     }
    //     return <div className="chonky-file-list-header">{comps}</div>;
    // }

    private getColWidth = (index: number, columnCount: number, entrySize: EntrySize, gutterSize: number) => {
        if (index === columnCount - 1) return entrySize.width;
        return entrySize.width + gutterSize;
    };

    private getRowHeight = (index: number, rowCount: number, entrySize: EntrySize, gutterSize: number) => {
        if (index === rowCount - 1) return entrySize.height;
        return entrySize.height + gutterSize;
    };

    private cellRenderer = (data: { key: string; parent: any; rowIndex: number; columnIndex: number; style: any },
                            gutterSize: number) => {
        const {
            files, selection,
            doubleClickDelay, onFileSingleClick, onFileDoubleClick, thumbnailGenerator,
            showRelativeDates, view,
        } = this.props;
        const {rowIndex, columnIndex, style: rawStyle} = data;
        const {rowCount, columnCount} = data.parent.props;
        const style = {...rawStyle};

        const index = rowIndex * columnCount + columnIndex;
        if (index >= files.length) return null;

        if (rowIndex !== rowCount - 1) style.height = style.height - gutterSize;
        if (columnIndex !== columnCount - 1) style.width = style.width - gutterSize;

        const file = files[index];
        const key = isObject(file) ? file.id : `loading-file-${data.key}`;
        const selected = isObject(file) ? selection[file.id] === true : false;
        return <FileListEntry key={key}
                              file={file} style={style} selected={selected} displayIndex={index}
                              doubleClickDelay={doubleClickDelay}
                              onFileSingleClick={onFileSingleClick}
                              onFileDoubleClick={onFileDoubleClick}
                              thumbnailGenerator={thumbnailGenerator}
                              showRelativeDates={showRelativeDates} view={view}/>;
    };

    private noContentRenderer = (entrySize: EntrySize) => {
        const placeholderProps: any = {
            className: classnames({
                'chonky-file-list-notification': true,
                'chonky-file-list-notification-empty': true,
            }),
        };
        if (isObject(entrySize)) {
            placeholderProps.style = {
                height: entrySize.height,
            };
        }

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
                    let columnCount: number;
                    let entrySize: EntrySize;

                    const isMobile = isMobileDevice();
                    const gutterSize = isMobile ? 5 : 10;
                    const scrollbarWidth = (!fillParentContainer || isMobile) ? 0 : 16;

                    const isLargeThumbs = view === FileView.LargeThumbs;
                    if (width < 400) {
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

                    return <Grid cellRenderer={data => this.cellRenderer(data, gutterSize)}
                                 noContentRenderer={() => this.noContentRenderer(entrySize)}
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
