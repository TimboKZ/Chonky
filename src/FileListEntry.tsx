/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import path from 'path';
import {Nullable} from 'tsdef';
import * as React from 'react';
import classnames from 'classnames';
import {Else, If, Then, When} from 'react-if';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faExternalLinkAlt as SymlinkIcon, faEyeSlash as HiddenIcon} from '@fortawesome/free-solid-svg-icons';

import {
    ClickEvent,
    ColorsDark,
    ColorsLight,
    FileClickHandler,
    FileData,
    FolderView,
    ThumbnailGenerator,
    ThumbnailGeneratorResult,
    EntrySize,
} from './typedef';
import {FileUtil} from './FileUtil';
import ConsoleUtil from './ConsoleUtil';
import LoadingPlaceholder from './LoadingPlaceholder';
import {getIconData, LoadingIconData} from './IconUtil';
import ClickableWrapper, {ClickableWrapperProps} from './ClickableWrapper';
import {isFunction, isNil, isNumber, isObject, isString} from './Util';

interface FileListEntryProps {
    instanceId: string;
    file: Nullable<FileData>;
    selected: boolean;
    displayIndex: number;
    view: FolderView;

    doubleClickDelay: number;
    onFileSingleClick: FileClickHandler;
    onFileDoubleClick: FileClickHandler;

    thumbnailGenerator?: ThumbnailGenerator;

    size?: EntrySize;
}

interface FileListEntryState {
    thumbnailUrl: Nullable<string>;
}

export default class FileListEntry extends React.PureComponent<FileListEntryProps, FileListEntryState> {

    public static defaultProps = {};

    public constructor(props: FileListEntryProps) {
        super(props);

        this.state = {
            thumbnailUrl: null,
        };
    }

    public componentDidMount() {
        this.requestThumbnail();
    }

    private requestThumbnail() {
        const {file, thumbnailGenerator} = this.props;
        if (isNil(file) || !isFunction(thumbnailGenerator)) return;

        // Check if thumbnail generator returns anything at all
        let syncResult: ThumbnailGeneratorResult = null;

        try {
            syncResult = thumbnailGenerator(file);
        } catch (error) {
            ConsoleUtil.logUnhandledException(error, `loading thumbnail for "${file.name}"`);
            return;
        }

        if (isNil(syncResult)) return this.setState({thumbnailUrl: null});

        if (typeof syncResult === 'string') return this.setState({thumbnailUrl: syncResult});
        syncResult
            .then((thumbnailUrl: Nullable<string>) => this.setState({thumbnailUrl}))
            .catch(error => {
                ConsoleUtil.logUnhandledPromiseError(error, `loading thumbnail for "${file.name}"`);
            });
    }

    private getIconData() {
        const {file} = this.props;
        return isObject(file) ? getIconData(file) : LoadingIconData;
    }

    private renderFilename() {
        const {file} = this.props;
        if (isNil(file)) return <LoadingPlaceholder/>;

        let displayExtension = '';

        if (isString(file.ext)) displayExtension = file.ext;
        else displayExtension = path.extname(file.name);

        return [
            <When key="chonky-filename-symlink" condition={file.isSymlink === true}>
                <span className="chonky-text-subtle"><FontAwesomeIcon icon={SymlinkIcon} size="xs"/></span>
                &nbsp;&nbsp;
            </When>,
            <When key="chonky-filename-hidden" condition={file.isHidden === true}>
                <span className="chonky-text-subtle"><FontAwesomeIcon icon={HiddenIcon} size="xs"/></span>
                &nbsp;&nbsp;
            </When>,
            <If key="chonky-file-name" condition={displayExtension.length !== 0}>
                <Then>
                    {file.name.substr(0, file.name.length - displayExtension.length)}
                    <span className="chonky-text-subtle-dark">{displayExtension}</span>
                </Then>
                <Else>
                    {file.name}
                </Else>
            </If>,
            <When key="chonky-file-is-dir" condition={file.isDir}>
                <span className="chonky-text-subtle" style={{marginLeft: 2}}>/</span>
            </When>,
        ];
    };

    private renderSize() {
        const {file} = this.props;
        if (isNil(file)) return <LoadingPlaceholder/>;
        if (!isNumber(file.size)) return <span className="chonky-text-subtle">—</span>;
        return FileUtil.readableSize(file.size);
    }

    private renderModDate() {
        const {file} = this.props;
        if (isNil(file)) return <LoadingPlaceholder/>;
        if (!(file.modDate instanceof Date)) return <span className="chonky-text-subtle">—</span>;
        const relativeDate = FileUtil.relativeDate(file.modDate);
        const readableDate = FileUtil.readableDate(file.modDate);

        const displayDate = relativeDate;
        const tooltipDate = readableDate;

        return <span className="chonky-tooltip" data-tooltip={tooltipDate}>{displayDate}</span>;
    }

    private renderDetailsEntry() {
        const {file} = this.props;
        const loading = isNil(file);

        const iconData = this.getIconData();
        const iconProps = {
            style: loading ? {} : {color: ColorsDark[iconData.colorCode]},
            className: classnames({
                'chonky-file-list-entry-icon': true,
                'chonky-text-subtle-light': loading,
            }),
        };

        return [
            <div key="chonky-file-icon" {...iconProps}>
                <FontAwesomeIcon icon={iconData.icon} fixedWidth={true} spin={loading}/>
            </div>,
            <div key="chonky-file-name" className="chonky-file-list-entry-name">{this.renderFilename()}</div>,
            <div key="chonky-file-size" className="chonky-file-list-entry-size">{this.renderSize()}</div>,
            <div key="chonky-file-date" className="chonky-file-list-entry-date">{this.renderModDate()}</div>,
        ];
    }

    private renderThumbsEntry() {
        const {file} = this.props;
        const {thumbnailUrl} = this.state;
        const loading = isNil(file);

        const hasThumbnail = isString(thumbnailUrl);
        const iconData = this.getIconData();
        const iconProps = {
            className: classnames({
                'chonky-file-list-entry-icon': true,
                'chonky-text-subtle-light': loading,
                'chonky-icon-over-image': hasThumbnail,
            }),
        };

        const imageBgClassName = classnames({
            'chonky-file-list-entry-image-bg': true,
            'chonky-thumbnail-loaded': hasThumbnail,
        });
        const imageFgClassName = classnames({
            'chonky-file-list-entry-image-fg': true,
            'chonky-thumbnail-loaded': hasThumbnail,
        });
        const imageStyle = hasThumbnail ? {backgroundImage: `url('${thumbnailUrl}')`} : {};
        const BgColors = hasThumbnail ? ColorsDark : ColorsLight;

        return <div className="chonky-file-list-entry-content"
                    style={{backgroundColor: BgColors[iconData.colorCode]}}>
            <div className="chonky-file-list-entry-thumb">
                <div className="chonky-file-list-entry-background"/>
                <div className={imageBgClassName} style={imageStyle}/>
                <div className={imageFgClassName} style={imageStyle}/>
                <div className="chonky-file-list-entry-selection"/>
                <div {...iconProps}><FontAwesomeIcon icon={iconData.icon} fixedWidth={true} spin={loading}/></div>
            </div>
            <div className="chonky-file-list-entry-description">
                <div className="chonky-file-list-entry-name">{this.renderFilename()}</div>
                <div className="chonky-file-list-entry-group">
                    <div className="chonky-file-list-entry-size">{this.renderSize()}</div>
                    <div className="chonky-file-list-entry-date">{this.renderModDate()}</div>
                </div>
            </div>
        </div>;
    }

    public render() {
        const {
            instanceId, file, selected, displayIndex, view, doubleClickDelay,
            onFileSingleClick, onFileDoubleClick, size,
        } = this.props;

        const wrapperProps: ClickableWrapperProps = {
            wrapperTag: 'div',
            passthroughProps: {
                style: {...size},
                className: classnames({
                    'chonky-file-list-entry': true,
                    'chonky-selected': selected,
                }),
                'data-chonky-file-id': isObject(file) ? file.id : undefined,
                'data-chonky-instance-id': instanceId,
            },
            doubleClickDelay,
        };
        if (isObject(file)) {
            if (isFunction(onFileSingleClick)) wrapperProps.onSingleClick =
                (event: ClickEvent, keyboard: boolean) => onFileSingleClick(file, displayIndex, event, keyboard);
            if (isFunction(onFileDoubleClick)) wrapperProps.onDoubleClick =
                (event: ClickEvent, keyboard: boolean) => onFileDoubleClick(file, displayIndex, event, keyboard);
        }

        return <ClickableWrapper {...wrapperProps}>
            {/* eslint-disable-next-line */}
            {view === FolderView.Details && this.renderDetailsEntry()}
            {/* eslint-disable-next-line */}
            {view !== FolderView.Details && this.renderThumbsEntry()}
        </ClickableWrapper>;
    }

}
