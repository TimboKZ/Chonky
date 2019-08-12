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

import {
    InternalClickHandler,
    FileView,
    Selection,
    SortOrder,
    SortProperty,
    ThumbnailGenerator,
    EntrySize,
    InputListener,
    FileData,
} from '../typedef';
import FileListEntry from './FileListEntry';
import {isObject, isString} from '../util/Util';
import ClickableWrapper from './ClickableWrapper';

interface FileListProps {
    instanceId: string;
    files: Nullable<FileData>[];
    selection: Selection;
    view: FileView;

    doubleClickDelay: number;
    onFileSingleClick: InternalClickHandler;
    onFileDoubleClick: InternalClickHandler;

    thumbnailGenerator?: ThumbnailGenerator;

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

const EntrySizeMap: { [view: string]: EntrySize } = {
    [FileView.SmallThumbs]: {width: 250, height: 180},
    [FileView.LargeThumbs]: {width: 400, height: 300},
};

export default class FileList extends React.Component<FileListProps, FileListState> {

    private renderDetailsHeaders() {
        const {instanceId, doubleClickDelay, sortProperty, sortOrder, activateSortProperty} = this.props;
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
            const onClick: InputListener = () => {
                activateSortProperty(name as SortProperty);
                return true;
            };
            comps[i] = <ClickableWrapper key={`header-${name}`} instanceId={instanceId} wrapperTag={'div'}
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
        }

        const comps = new Array(files.length);
        let loadingCounter = 0;
        for (let i = 0; i < comps.length; ++i) {
            const file = files[i];
            const key = isObject(file) ? file.id : `loading-file-${loadingCounter++}`;
            const selected = isObject(file) ? selection[file.id] === true : false;
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

    public render() {
        const {view} = this.props;
        const isThumbs = view === FileView.SmallThumbs || view === FileView.LargeThumbs;

        const className = classnames({
            'chonky-file-list': true,
            'chonky-file-list-thumbs': isThumbs,
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

}
