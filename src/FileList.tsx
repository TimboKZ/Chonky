/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import {When} from 'react-if';
import * as React from 'react';
import classnames from 'classnames';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowDown as DescIcon, faArrowUp as AscIcon} from '@fortawesome/free-solid-svg-icons';

import FileListEntry from './FileListEntry';
import {
    FileClickHandler,
    FileData,
    FolderView,
    Nullable,
    Selection,
    SortOrder,
    SortProperty,
    ThumbnailGenerator,
} from './typedef';

type FileListProps = {
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
            files, selection, view, doubleClickDelay, onFileSingleClick, onFileDoubleClick,
            thumbnailGenerator,
        } = this.props;

        const comps = new Array(files.length);
        let loadingCounter = 0;
        for (let i = 0; i < comps.length; ++i) {
            const file = files[i];
            const key = file ? file.id : `loading-file-${loadingCounter++}`;
            const selected = file ? !!selection[file.id] : false;
            comps[i] = <FileListEntry key={key} selected={selected} file={file} displayIndex={i}
                                      view={view} doubleClickDelay={doubleClickDelay}
                                      onFileSingleClick={onFileSingleClick}
                                      onFileDoubleClick={onFileDoubleClick}
                                      thumbnailGenerator={thumbnailGenerator}/>;
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
