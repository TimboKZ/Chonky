/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import {When} from 'react-if';
import * as React from 'react';
import classnames from 'classnames';
import {AutoSizer, Grid} from 'react-virtualized';
import {Nullable} from 'tsdef';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowDown as DescIcon, faArrowUp as AscIcon, faFolderOpen} from '@fortawesome/free-solid-svg-icons';

import {
    EntrySize,
    FileData,
    FileView,
    InternalClickHandler,
    Selection,
    SortOrder,
    SortProperty,
    ThumbnailGenerator,
} from '../typedef';
import FileListEntry from './FileListEntry';
import ClickableWrapper from './ClickableWrapper';
import {isNil, isObject, isString} from '../util/Util';

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
    sortProperty: SortProperty;
    sortOrder: SortOrder;
    activateSortProperty: (name: SortProperty) => void;
}

interface FileListState {}

const HeaderDetails = [
    [null, ''],
    [SortProperty.Name, 'Name'],
    [SortProperty.Size, 'Size'],
    [SortProperty.ModDate, 'Last change'],
];

const GutterSize = 10;
const SmallThumbsSize: EntrySize = {width: 200, height: 160};
const LargeThumbsSize: EntrySize = {width: 280, height: 220};

export default class FileList extends React.PureComponent<FileListProps, FileListState> {

    private renderDetailsHeaders() {
        const {doubleClickDelay, sortProperty, sortOrder, activateSortProperty} = this.props;
        const comps = new Array(HeaderDetails.length);
        for (let i = 0; i < HeaderDetails.length; ++i) {
            const [name, title] = HeaderDetails[i];
            const headerProps = !isString(name) ? {} : {
                tabIndex: 0,
                className: classnames({
                    'chonky-clickable': true,
                    'chonky-active': sortProperty === name,
                }),
            };
            let onClick = undefined;
            if (!isNil(name)) {
                onClick = () => {
                    activateSortProperty(name as SortProperty);
                    return true;
                };
            }
            comps[i] = <ClickableWrapper key={`header-${name}`} wrapperTag={'div'}
                                         passthroughProps={headerProps} doubleClickDelay={doubleClickDelay}
                                         onAllClicks={onClick}>
                {title}
                {/* eslint-disable-next-line */}
                {sortProperty === name &&
                <span className="chonky-text-subtle">
                    &nbsp;
                    <FontAwesomeIcon icon={sortOrder === SortOrder.Asc ? AscIcon : DescIcon}
                                     fixedWidth={true} size="sm"/>
                </span>
                }
            </ClickableWrapper>;
        }
        return <div className="chonky-file-list-header">{comps}</div>;
    }

    private renderFileEntries() {
        // const {
        //     files, selection, doubleClickDelay, onFileSingleClick, onFileDoubleClick, thumbnailGenerator,
        //     showRelativeDates, view,
        // } = this.props;
        //
        // const entrySize = EntrySizeMap[view];
        //
        // if (files.length === 0) {
        //     const placeholderProps: any = {
        //         className: classnames({
        //             'chonky-file-list-notification': true,
        //             'chonky-file-list-notification-empty': true,
        //         }),
        //     };
        //     if (isObject(entrySize)) {
        //         placeholderProps.style = {
        //             height: entrySize.height,
        //         };
        //     }
        //
        //     return <div {...placeholderProps}>
        //         <div className="chonky-file-list-notification-content">
        //             <FontAwesomeIcon icon={faFolderOpen}/>
        //             &nbsp;
        //             Nothing to show
        //         </div>
        //     </div>;
        // }
        //
        // const comps = new Array(files.length);
        // let loadingCounter = 0;
        // for (let i = 0; i < comps.length; ++i) {
        //     const file = files[i];
        //     const key = isObject(file) ? file.id : `loading-file-${loadingCounter++}`;
        //     const selected = isObject(file) ? selection[file.id] === true : false;
        //     comps[i] = <FileListEntry key={key}
        //                               file={file}  selected={selected} displayIndex={i}
        //                               doubleClickDelay={doubleClickDelay}
        //                               onFileSingleClick={onFileSingleClick}
        //                               onFileDoubleClick={onFileDoubleClick}
        //                               thumbnailGenerator={thumbnailGenerator}
        //                               showRelativeDates={showRelativeDates} view={view} containerSize={entrySize}
        //     />;
        // }
        // return comps;
    }

    public oldRender() {
        const {view} = this.props;
        const isThumbs = view === FileView.SmallThumbs || view === FileView.LargeThumbs;

        const className = classnames({
            'chonky-file-list': true,
            'chonky-file-list-thumbs': isThumbs,
            'chonky-file-list-thumbs-small': isThumbs && view === FileView.SmallThumbs,
            'chonky-file-list-thumbs-large': isThumbs && view === FileView.LargeThumbs,
            'chonky-file-list-details': !isThumbs,
        });

        return <div className={className}>
            <When condition={!isThumbs}>
                {this.renderDetailsHeaders()}
            </When>
            {this.renderFileEntries()}
        </div>;
    }

    private getEntrySize = () => {
        const {view} = this.props;
        if (view === FileView.LargeThumbs) return LargeThumbsSize;
        return SmallThumbsSize;
    };

    private getColumnWidth = (index: number, columnCount: number) => {
        const entrySize = this.getEntrySize();
        if (index === columnCount - 1) return entrySize.width;
        return entrySize.width + GutterSize;
    };

    private getRowHeight = (index: number, rowCount: number) => {
        const entrySize = this.getEntrySize();
        if (index === rowCount - 1) return entrySize.height;
        return entrySize.height + GutterSize;
    };

    private cellRenderer = (data: { key: string; parent: any; rowIndex: number; columnIndex: number; style: any }) => {
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

        if (rowIndex !== rowCount - 1) style.height = style.height - GutterSize;
        if (columnIndex !== columnCount - 1) style.width = style.width - GutterSize;

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

    private noContentRenderer = () => {
        const entrySize = this.getEntrySize();
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
                    const entrySize = this.getEntrySize();
                    const scrollbarWidth = fillParentContainer ? 16 : 0;
                    const columnCountFloat = (width + GutterSize - scrollbarWidth) / (entrySize.width + GutterSize);
                    const columnCount = Math.max(1, Math.floor(columnCountFloat));
                    const rowCount = Math.ceil(files.length / columnCount);

                    return <Grid cellRenderer={this.cellRenderer} noContentRenderer={this.noContentRenderer}
                                 itemData={{rowCount, columnCount}}
                                 rowCount={rowCount} columnCount={columnCount}
                                 columnWidth={({index}) => this.getColumnWidth(index, columnCount)}
                                 rowHeight={({index}) => this.getRowHeight(index, rowCount)}
                                 width={width} height={isNil(height) ? 500 : height}
                                 autoHeight={!fillParentContainer}
                                 tabIndex={null}/>;
                }}
            </AutoSizer>
        </div>;
    }

}
