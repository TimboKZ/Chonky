/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import {When} from 'react-if';
import * as React from 'react';
import {Nullable} from 'tsdef';
import classnames from 'classnames';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFolderOpen} from '@fortawesome/free-regular-svg-icons/faFolderOpen';
import {faArrowDown as DescIcon, faArrowUp as AscIcon} from '@fortawesome/free-solid-svg-icons';

import FileListEntry from './FileListEntry';
import {
    FileClickHandler,
    FileData,
    FolderView,
    Selection,
    SortOrder,
    SortProperty,
    ThumbnailGenerator, EntrySize,
} from './typedef';

type FileListProps = {
    instanceId: string;
    files: Nullable<FileData>[];
    selection: Selection;
    view: FolderView;

    doubleClickDelay: number;
    onFileSingleClick: FileClickHandler;
    onFileDoubleClick: FileClickHandler;

    thumbnailGenerator?: ThumbnailGenerator,

    sortProperty: SortProperty;
    sortOrder: SortOrder;
    activateSortProperty: (name: SortProperty) => void;
}

type FileListState = {}

const HeaderDetails = [
    [null, ''],
    [SortProperty.Name, 'Name'],
    [SortProperty.Size, 'Size'],
    [SortProperty.ModDate, 'Last change'],
];

const EntrySizeMap: { [view: string]: EntrySize } = {
    [FolderView.SmallThumbs]: {width: 250, height: 180},
    [FolderView.LargeThumbs]: {width: 400, height: 300},
};

export default class FileList extends React.Component<FileListProps, FileListState> {

    static defaultProps = {};

    constructor(props: FileListProps) {
        super(props);
    }

    renderDetailsHeaders() {
        const {sortProperty, sortOrder, activateSortProperty} = this.props;
        const comps = new Array(HeaderDetails.length);
        for (let i = 0; i < HeaderDetails.length; ++i) {
            const [name, title] = HeaderDetails[i];
            const headerProps = !name ? {} : {
                tabIndex: 0,
                className: classnames({
                    'chonky-clickable': true,
                    'chonky-active': sortProperty === name,
                }),
                onClick: () => activateSortProperty(name as SortProperty),
            };
            comps[i] = <div key={`header-${name}`} {...headerProps}>
                {title}
                {sortProperty === name &&
                <span className="chonky-text-subtle">
                    &nbsp;
                    <FontAwesomeIcon icon={sortOrder === SortOrder.Asc ? AscIcon : DescIcon} fixedWidth size="sm"/>
                </span>
                }
            </div>;
        }
        return <div className="chonky-file-list-header">{comps}</div>;
    }

    renderFileEntries() {
        const {
            instanceId, files, selection, view, doubleClickDelay,
            onFileSingleClick, onFileDoubleClick, thumbnailGenerator,
        } = this.props;

        const entrySize = EntrySizeMap[view];

        if (files.length === 0) {
            const placeholderProps: any = {
                className: classnames({
                    'chonky-file-list-notification': true,
                    'chonky-file-list-notification-empty': true,
                }),
            };
            if (entrySize) {
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
        }

        const comps = new Array(files.length);
        let loadingCounter = 0;
        for (let i = 0; i < comps.length; ++i) {
            const file = files[i];
            const key = file ? file.id : `loading-file-${loadingCounter++}`;
            const selected = file ? !!selection[file.id] : false;
            comps[i] = <FileListEntry key={key} instanceId={instanceId}
                                      selected={selected} file={file} displayIndex={i}
                                      view={view} doubleClickDelay={doubleClickDelay}
                                      onFileSingleClick={onFileSingleClick}
                                      onFileDoubleClick={onFileDoubleClick}
                                      thumbnailGenerator={thumbnailGenerator}
                                      size={entrySize}/>;
        }
        return comps;
    }

    render() {
        const {view} = this.props;
        const isThumbs = view === FolderView.SmallThumbs || view === FolderView.LargeThumbs;

        const className = classnames({
            'chonky-file-list': true,
            'chonky-file-list-thumbs': isThumbs,
            'chonky-file-list-thumbs-large': isThumbs && view === FolderView.LargeThumbs,
            'chonky-file-list-details': !isThumbs,
        });

        return <div className={className}>
            <When condition={!isThumbs}>
                {this.renderDetailsHeaders()}
            </When>
            {this.renderFileEntries()}
        </div>;
    }

}
