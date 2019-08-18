/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import React from 'react';
import {Nullable} from 'tsdef';
import classnames from 'classnames';
import {
    faTh,
    faList,
    faCircle,
    faUpload,
    faThLarge,
    faFolderPlus,
    faCheckCircle,
    faLevelUpAlt as iconPathParentDir,
    faChevronRight, faDownload, faTrash,
} from '@fortawesome/free-solid-svg-icons';
import {faFolder} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import Dropdown from './Dropdown';
import IconButton from './IconButton';
import ButtonGroup from './ButtonGroup';
import ConsoleUtil from '../util/ConsoleUtil';
import DropdownButton from './DropdownButton';
import {getNonNil, isBoolean, isFunction, isNil, isObject} from '../util/Util';
import {FileData, FileView, InputEvent, MultiFileActionHandler, Option, Options, Selection} from '../typedef';

interface ControlsProps {
    folderChain?: (FileData | null)[];
    selection: Selection;

    onFileOpen?: (file: FileData) => void;
    onFolderCreate?: Nullable<() => void>;
    onUploadClick?: Nullable<() => void>;
    onDownloadFiles?: Nullable<MultiFileActionHandler>;
    onDeleteFiles?: Nullable<MultiFileActionHandler>;

    getFilesFromSelection: () => FileData[];

    view: FileView;
    setView: (view: FileView) => void;
    options: Options;
    setOption: (name: Option, value: boolean) => void;
}

interface ControlsState {}

const ViewControls = [
    [faList, FileView.Details, 'Details'],
    [faTh, FileView.SmallThumbs, 'Small thumbnails'],
    [faThLarge, FileView.LargeThumbs, 'Large thumbnails'],
];

const DropdownButtons = [
    [Option.ShowHidden, 'Show hidden files'],
    [Option.FoldersFirst, 'Show folders first'],
    [Option.ShowRelativeDates, 'Show relative dates'],
    [Option.DisableTextSelection, 'Disable text selection'],
];

export default class Controls extends React.PureComponent<ControlsProps, ControlsState> {

    private renderFolderChain() {
        const {folderChain, onFileOpen} = this.props;
        if (isNil(folderChain)) return null;

        const comps = new Array(Math.max(0, folderChain.length * 2 - 1));
        for (let i = 0; i < folderChain.length; ++i) {
            const folder = folderChain[i];
            const isLast = i === folderChain.length - 1;
            const j = i * 2;

            const compProps: any = {
                key: `folder-chain-entry-${j}`,
                className: classnames({
                    'chonky-folder-chain-entry': true,
                    'chonky-loading': isNil(folder),
                }),
            };
            if (!isNil(folder)
                && folder.openable !== false
                && isFunction(onFileOpen)
                && !isLast) {
                compProps.onClick = () => onFileOpen(folder);
            }

            const TagToUse = isFunction(compProps.onClick) ? 'button' : 'div';
            comps[j] = <TagToUse {...compProps}>
                {/* eslint-disable-next-line */}
                {j === 0 && <span className="chonky-text-subtle-dark">
                    <FontAwesomeIcon icon={faFolder}/>&nbsp;&nbsp;
                </span>}
                <span className="chonky-folder-chain-entry-name">
                    {isObject(folder) ? folder.name : 'Loading...'}
                </span>
            </TagToUse>;
            if (!isLast) {
                comps[j + 1] = <div key={`folder-chain-separator-${j}`} className="chonky-folder-chain-separator">
                    <FontAwesomeIcon icon={faChevronRight} size="sm"/>
                </div>;
            }
        }

        return <div className="chonky-folder-chain">{comps}</div>;
    }

    private renderViewControls() {
        const {view, setView} = this.props;
        let i = 0;
        const comps = new Array(ViewControls.length);
        for (const [icon, buttonView, tooltip] of ViewControls) {
            comps[i++] = <IconButton key={`control-${buttonView}`} icon={icon} active={view === buttonView}
                                     tooltip={tooltip as string}
                // @ts-ignore
                                     onClick={() => setView(buttonView as FileView)}/>;
        }
        return <ButtonGroup>{comps}</ButtonGroup>;
    }

    private renderOptionsDropdown() {
        const {options, setOption} = this.props;
        const comps = new Array(DropdownButtons.length);
        let i = 0;
        for (const [optionName, text] of DropdownButtons) {
            const value = options[optionName];
            if (!isBoolean(value)) {
                ConsoleUtil.warn(`Expected boolean value for option ${optionName}, got: ${value}`);
                continue;
            }

            const onClick = (event: React.MouseEvent) => {
                event.preventDefault();
                setOption(optionName as Option, !value);
            };
            comps[i] = <DropdownButton key={`option-${optionName}`}
                                       icon={faCheckCircle} altIcon={faCircle} active={options[optionName]}
                                       text={text} onClick={onClick}/>;
            i++;
        }
        return <Dropdown title="Options">{comps}</Dropdown>;
    }

    public render() {
        const {
            folderChain, selection, onFileOpen, onFolderCreate, onUploadClick,
            onDownloadFiles, onDeleteFiles, getFilesFromSelection,
        } = this.props;
        const parentDirButtonProps: any = {};
        if (isFunction(onFileOpen)) {
            const parentFolder = getNonNil(folderChain, -2);
            if (!isNil(parentFolder) && parentFolder.openable !== false) {
                parentDirButtonProps.onClick = () => onFileOpen(parentFolder);
            }
        }

        let selectionSize = 0;
        for (const key in selection) {
            if (selection[key] === true) selectionSize++;
        }

        const buttonData = [
            [faFolderPlus, 'Create folder', onFolderCreate, false],
            [faUpload, 'Upload files', onUploadClick, false],
            [faDownload, 'Download files', onDownloadFiles, true],
            [faTrash, 'Delete files', onDeleteFiles, true],
        ];
        const buttons = new Array(buttonData.length);
        for (let i = 0; i < buttons.length; ++i) {
            const button = buttonData[i];
            const [iconData, tooltip, clickFunc, isMulti] = button as [any, string, any, boolean];
            if (clickFunc !== null && !isFunction(clickFunc)) continue;
            const buttonProps: any = {
                key: `controls-button-${i}`,
                icon: iconData,
                tooltip,
            };
            if (clickFunc !== null && (!isMulti || selectionSize > 0)) {
                buttonProps.onClick = (event: InputEvent) => {
                    if (isMulti) clickFunc(getFilesFromSelection(), event);
                    else clickFunc();
                    return true;
                };
            }
            buttons[i] = <IconButton {...buttonProps}/>;
        }

        return <div className="chonky-controls">
            <div className="chonky-side chonky-side-left">
                <ButtonGroup>
                    <IconButton icon={iconPathParentDir} {...parentDirButtonProps}/>
                </ButtonGroup>
                {this.renderFolderChain()}
            </div>
            <div className="chonky-side chonky-side-right">
                {buttons}
                {this.renderViewControls()}
                {this.renderOptionsDropdown()}
            </div>
        </div>;
    }

}
