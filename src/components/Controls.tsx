/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import React from 'react';
import { Nullable } from 'tsdef';
import classnames from 'classnames';

import {
  FileData,
  FileView,
  InputEvent,
  MultiFileActionHandler,
  Option,
  Options,
  Selection,
  SortOrder,
  SortProperty,
} from '../typedef';
import Dropdown from './Dropdown';
import IconButton from './IconButton';
import ButtonGroup from './ButtonGroup';
import ConsoleUtil from '../util/ConsoleUtil';
import DropdownButton from './DropdownButton';
import DropdownSwitch from './DropdownSwitch';
import {
  getNonNil,
  isBoolean,
  isFunction,
  isNil,
  isObject,
} from '../util/Util';
import { ConfigContext } from './ConfigContext';

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
  sortProperty: string | ((file: FileData) => any);
  sortOrder: SortOrder;
  activateSortProperty: (name: string | ((file: FileData) => any)) => void;
}

interface ControlsState {}

const SortButtons = [
  [SortProperty.Name, 'Name'],
  [SortProperty.Size, 'Size'],
  [SortProperty.ModDate, 'Last change'],
];

const DropdownButtons = [
  [Option.ShowHidden, 'Show hidden files'],
  [Option.FoldersFirst, 'Show folders first'],
  [Option.ShowRelativeDates, 'Show relative dates'],
  [Option.DisableTextSelection, 'Disable text selection'],
];

export default class Controls extends React.PureComponent<
  ControlsProps,
  ControlsState
> {
  public static contextType = ConfigContext;
  public context!: React.ContextType<typeof ConfigContext>;

  private renderFolderChain() {
    const { folderChain, onFileOpen } = this.props;
    const { Icon, icons } = this.context;

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
      if (
        !isNil(folder) &&
        folder.openable !== false &&
        isFunction(onFileOpen) &&
        !isLast
      ) {
        compProps.onClick = () => onFileOpen(folder);
      }
      const TagToUse = isFunction(compProps.onClick) ? 'button' : 'div';
      comps[j] = (
        <TagToUse {...compProps}>
          {/* eslint-disable-next-line */}
          {j === 0 && (
            <span className="chonky-text-subtle-dark">
              <Icon icon={icons.folder} />
              &nbsp;&nbsp;
            </span>
          )}
          <span className="chonky-folder-chain-entry-name">
            {isObject(folder) ? folder.name : 'Loading...'}
          </span>
        </TagToUse>
      );
      if (!isLast) {
        comps[j + 1] = (
          <div
            key={`folder-chain-separator-${j}`}
            className="chonky-folder-chain-separator"
          >
            <Icon icon={icons.angleRight} size="xs" />
          </div>
        );
      }
    }
    return <div className="chonky-folder-chain">{comps}</div>;
  }

  private renderActionButtons() {
    const {
      selection,
      onFolderCreate,
      onUploadClick,
      onDownloadFiles,
      onDeleteFiles,
      getFilesFromSelection,
    } = this.props;
    const { icons } = this.context;

    let selectionSize = 0;
    for (const key in selection) {
      if (selection[key] === true) selectionSize++;
    }

    const buttonData = [
      [icons.folderCreate, 'Create folder', onFolderCreate, false],
      [icons.upload, 'Upload files', onUploadClick, false],
      [icons.download, 'Download files', onDownloadFiles, true],
      [icons.trash, 'Delete files', onDeleteFiles, true],
    ];
    const buttons = new Array(buttonData.length);
    for (let i = 0; i < buttons.length; ++i) {
      const button = buttonData[i];
      const [iconData, tooltip, clickFunc, isMulti] = button as [
        any,
        string,
        any,
        boolean
      ];
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
      buttons[i] = <IconButton {...buttonProps} />;
    }
    return buttons;
  }

  private renderSortDropdownButtons() {
    const { sortProperty, sortOrder, activateSortProperty } = this.props;
    const { icons } = this.context;

    const orderIcon = sortOrder === SortOrder.Asc ? icons.asc : icons.desc;

    const comps = new Array(SortButtons.length);
    for (let i = 0; i < comps.length; ++i) {
      const [propName, propTitle] = SortButtons[i];
      const isActive = sortProperty === propName;
      const onClick = (event: MouseEvent) => {
        event.preventDefault();
        activateSortProperty(propName);
      };
      comps[i] = (
        <DropdownButton
          key={`sort-button-${i}`}
          icon={orderIcon}
          altIcon={icons.checkInactive}
          onClick={onClick}
          active={isActive}
          text={propTitle}
        />
      );
    }
    return comps;
  }

  private renderOptionsDropdownButtons() {
    const { view, setView, options, setOption } = this.props;
    const { icons } = this.context;

    const ViewButtons = [
      {
        id: FileView.Details,
        icon: icons.list,
        tooltip: 'Details',
      },
      {
        id: FileView.SmallThumbs,
        icon: icons.smallThumbnail,
        tooltip: 'Small thumbnails',
      },
      {
        id: FileView.LargeThumbs,
        icon: icons.largetThumbnail,
        tooltip: 'Large thumbnails',
      },
    ];

    const comps = new Array(DropdownButtons.length + 1);
    comps[0] = (
      <DropdownSwitch
        key={'dropdown-switch'}
        activeId={view}
        items={ViewButtons}
        onClick={setView}
      />
    );
    let i = 1;
    for (const [optionName, text] of DropdownButtons) {
      const value = options[optionName];
      if (!isBoolean(value)) {
        ConsoleUtil.warn(
          `Expected boolean value for option ${optionName}, got: ${value}`
        );
        continue;
      }

      const onClick = (event: React.MouseEvent) => {
        event.preventDefault();
        setOption(optionName as Option, !value);
      };
      comps[i] = (
        <DropdownButton
          key={`option-${optionName}`}
          icon={icons.checkActive}
          altIcon={icons.checkInactive}
          active={options[optionName]}
          text={text}
          onClick={onClick}
        />
      );
      i++;
    }
    return comps;
  }

  public render() {
    const { folderChain, onFileOpen } = this.props;
    const { icons } = this.context;
    const parentDirButtonProps: any = {};
    if (isFunction(onFileOpen)) {
      const parentFolder = getNonNil(folderChain, -2);
      if (!isNil(parentFolder) && parentFolder.openable !== false) {
        parentDirButtonProps.onClick = () => onFileOpen(parentFolder);
      }
    }
    return (
      <div className="chonky-controls">
        <div className="chonky-side chonky-side-left">
          <ButtonGroup>
            <IconButton icon={icons.directoryUp} {...parentDirButtonProps} />
          </ButtonGroup>
          {this.renderFolderChain()}
        </div>
        <div className="chonky-side chonky-side-right">
          <div className="chonky-side-inside chonky-side-inside-left">
            {this.renderActionButtons()}
          </div>
          <div className="chonky-side-inside chonky-side-inside-right">
            <Dropdown title="Sort by">
              {this.renderSortDropdownButtons()}
            </Dropdown>
            <Dropdown title="Options">
              {this.renderOptionsDropdownButtons()}
            </Dropdown>
          </div>
        </div>
      </div>
    );
  }
}
