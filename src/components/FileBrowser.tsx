/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import React from 'react';
import classnames from 'classnames';
import { Nilable, Nullable } from 'tsdef';
import { shallowEqualArrays, shallowEqualObjects } from 'shallow-equal';

import {
  FileArray,
  FileData,
  FileIndexMap,
  FileView,
  InputEvent,
  InputListener,
  InternalClickHandler,
  KbKey,
  MultiFileActionHandler,
  Option,
  Options,
  Selection,
  SelectionStatus,
  SelectionType,
  SingleFileActionHandler,
  SortOrder,
  SortProperty,
  ThumbnailGenerator,
} from '../typedef';
import {
  clampIndex,
  deregisterKbListener,
  getNonNil,
  isArray,
  isFunction,
  isMobileDevice,
  isNil,
  isNumber,
  isObject,
  registerKbListener,
} from '../util/Util';
import FileList from './FileList';
import Controls from './Controls';
import { FileUtil } from '../util/FileUtil';
import ConsoleUtil from '../util/ConsoleUtil';
import Denque = require('denque');
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons as defaultIcons, Icon as DefaultIcon } from './Icon';
import { ConfigContext, ConfigValue } from './ConfigContext';

export interface FileBrowserProps {
  /**
   * List of files that will be displayed in the main container. The provided value **must** be an array, where
   * each element is either `null` or an object that satisfies the `FileData` type. If an element is `null`, a
   * loading placeholder will be displayed in its place.
   * [See relevant section](#section-passing-files-to-chonky).
   */
  files: Nullable<FileData>[];

  /**
   * The current folder hierarchy. This should be an array to `files`, every element should either be `null` or an
   * object of `FileData` type. The first element should represent the top-level directory, and the last element
   * should be the current folder.
   * [See relevant section](#section-specifying-current-folder).
   */
  folderChain?: Nullable<FileData>[];

  /**
   * The function that determines the thumbnail image URL for a file. It gets a file object as the input, and
   * should return a `string` or `null`. It can also return a promise that resolves into a `string` or `null`.
   * [See relevant section](#section-displaying-file-thumbnails).
   */
  thumbnailGenerator?: ThumbnailGenerator;

  /**
   * The function that is called whenever the user tries to open a file. This behaviour can be triggered via a
   * double-click on a file in the main container, or by clicking on the name of a folder in the top bar.
   * [See relevant section](#section-handling-file-actions).
   */
  onFileOpen?: SingleFileActionHandler;

  /**
   * A callback that is called when user clicks on the "Create Folder" button in the control panel. If this
   * callback is not provided, the button will be hidden. If you want the button to be displayed in disabled mode,
   * pass `null` as the value.
   */
  onFolderCreate?: Nullable<() => void>;

  /**
   * A callback that is called when user clicks on the "Upload Files" button in the control panel. If this
   * callback is not provided, the button will be hidden. If you want the button to be displayed in disabled mode,
   * pass `null` as the value.
   */
  onUploadClick?: Nullable<() => void>;

  /**
   * This function is similar to `onFileOpen`, except the first argument is an array of files. The array will have
   * more than one element if the user makes a file selection containing multiple files, and then double-clicks on
   * one of the files.
   * [See relevant section](#section-handling-file-actions).
   */
  onOpenFiles?: MultiFileActionHandler;

  onMoveFiles?: MultiFileActionHandler;
  onDownloadFiles?: Nullable<MultiFileActionHandler>;
  onDeleteFiles?: Nullable<MultiFileActionHandler>;

  /**
   * The function that is called whenever a file entry in the main `FileBrowser` container is clicked once. If it
   * returns `true` (or a promise that resolves into `true`), the default Chonky behaviour will be cancelled.
   * [See relevant section](#section-handling-file-actions).
   */
  onFileSingleClick?: SingleFileActionHandler;

  /**
   * The function that is called whenever a file entry in the main `FileBrowser` container is double-clicked. If it
   * returns `true` (or a promise that resolves into `true`), the default Chonky behaviour will be cancelled.
   * [See relevant section](#section-handling-file-actions).
   */
  onFileDoubleClick?: SingleFileActionHandler;

  /**
   * Maximum delay between the two clicks in a double click, in milliseconds.
   */
  doubleClickDelay?: number;

  /**
   * The function that is called whenever file selection changes.
   * [See relevant section](#section-managing-file-selection).
   */
  onSelectionChange?: (selection: Selection) => void;

  /**
   * The flag that completely disables file selection functionality. If any handlers depend on file selections, their
   * input will look like no files are selected.
   * [See relevant section](#section-managing-file-selection).
   */
  disableSelection?: boolean;

  /**
   * The flag that determines whether Chonky should fill the height parent container. When set to `true`, the maximum
   * height of the file browser will be limited to the height of the parent container, and scrollbar will be shown
   * when necessary. When set to `false`, file browser height will be extended to display all files at the same time.
   */
  fillParentContainer?: boolean;

  /**
   * The initial file view. This should be set using the `FileView` enum. Users can change file view using the
   * controls in the top bar.
   * [See relevant section](#section-setting-file-browser-options).
   */
  view?: FileView;

  /**
   * Initial values for the file view options. Users can toggle all of these using the "Options" dropdown.
   * [See relevant section](#section-setting-file-browser-options).
   */
  options?: Partial<Options>;

  /**
   * The file object property that files are initially sorted by. This can be a string corresponding to one of the
   * file properties, or a function that takes in a `FileData` object and returns some value. This should can be set
   * using the `SortProperty` enum. Users can change the sort property by clicking on column names in detailed view.
   * [See relevant section](#section-setting-file-browser-options).
   */
  sortProperty?: string | ((file: FileData) => any);

  /**
   * The order in which the files are presented. This should be set using the `SortOrder` enum. Users can change the
   * sort order by clicking on column names in detailed view.
   * [See relevant section](#section-setting-file-browser-options).
   */
  sortOrder?: SortOrder;

  /**
   * Icon component
   */
  Icon?: typeof FontAwesomeIcon;

  /**
   * Map of default icons
   */
  icons: Partial<typeof defaultIcons>;
}

interface FileBrowserState {
  rawFiles: FileArray;
  folderChain?: FileArray;
  sortedFiles: FileArray;
  fileIndexMap: FileIndexMap;

  previousSelectionIndex?: number;
  selection: Selection;

  // View, display & sort options
  view: FileView;
  options: Options;
  sortProperty: string | ((file: FileData) => any);
  sortOrder: SortOrder;
}

/**
 * File browser component.
 */
export default class FileBrowser extends React.Component<
  FileBrowserProps,
  FileBrowserState
> {
  public static defaultProps: Partial<FileBrowserProps> = {
    onFolderCreate: undefined,
    onUploadClick: undefined,
    onDownloadFiles: undefined,
    onDeleteFiles: undefined,
    doubleClickDelay: 300,
    disableSelection: false,
    fillParentContainer: false,
    view: FileView.Details,
    options: {
      showHidden: true,
      foldersFirst: true,
      showRelativeDates: true,
      disableTextSelection: true,
    },
    sortProperty: SortProperty.Name,
    sortOrder: SortOrder.Asc,
  };

  private readonly ref = React.createRef<HTMLDivElement>();
  private selectedFilesSnapshotBeforeSingleClick: Nullable<FileData[]> = null;

  public constructor(props: FileBrowserProps) {
    super(props);
    this.ref = React.createRef();

    const {
      files: rawFiles,
      folderChain,
      view: propView,
      options: propOptions,
      sortProperty: propSortProperty,
      sortOrder: propSortOrder,
    } = props;

    const defaults = FileBrowser.defaultProps;
    const selection = {};
    const view = !isNil(propView) ? propView : (defaults.view as FileView);
    const options: Options = {
      ...(defaults.options as Options),
      ...propOptions,
    };
    const sortProperty = !isNil(propSortProperty)
      ? propSortProperty
      : (defaults.sortProperty as SortProperty);
    const sortOrder = !isNil(propSortOrder)
      ? propSortOrder
      : (defaults.sortOrder as SortOrder);

    const [sortedFiles, fileIndexMap] = FileUtil.sortFiles(
      rawFiles,
      options,
      sortProperty,
      sortOrder
    );

    this.state = {
      rawFiles,
      folderChain,
      sortedFiles,
      fileIndexMap,
      selection,
      view,
      options,
      sortProperty,
      sortOrder,
    };
  }

  public componentDidMount(): void {
    registerKbListener(this.handleKeyPress);
  }

  public componentWillUnmount(): void {
    deregisterKbListener(this.handleKeyPress);
  }

  public UNSAFE_componentWillReceiveProps(
    nextProps: Readonly<FileBrowserProps>
  ): void {
    const old = this.props;
    const {
      files,
      folderChain,
      onSelectionChange,
      disableSelection,
      view,
      options,
      sortProperty,
      sortOrder,
    } = nextProps;

    let selectionStatus = SelectionStatus.Ok;

    if (!shallowEqualArrays(files, old.files)) {
      selectionStatus = SelectionStatus.NeedsCleaning;
      this.setState({ rawFiles: files });
    }
    if (!shallowEqualArrays(folderChain, old.folderChain)) {
      if (
        !isArray(folderChain) ||
        getNonNil(folderChain, -1) !== getNonNil(old.folderChain, -1)
      ) {
        selectionStatus = SelectionStatus.NeedsResetting;
      }
      this.setState({ folderChain });
    }

    if (
      disableSelection === true &&
      disableSelection !== old.disableSelection
    ) {
      selectionStatus = SelectionStatus.NeedsResetting;
    }
    if (!isNil(view) && view !== old.view) this.setState({ view });
    if (isObject(options) && options !== old.options) {
      this.setState(prevState => ({
        options: { ...prevState.options, ...options },
      }));
    }
    if (!isNil(sortProperty) && sortProperty !== old.sortProperty)
      this.setState({ sortProperty });
    if (!isNil(sortOrder) && sortOrder !== old.sortOrder)
      this.setState({ sortOrder });

    if (selectionStatus === SelectionStatus.NeedsResetting) {
      this.setState(() => {
        const selection = {};
        if (isFunction(onSelectionChange)) onSelectionChange(selection);
        return { selection, previousSelectionIndex: undefined };
      });
    } else if (selectionStatus === SelectionStatus.NeedsCleaning) {
      this.setState(prevState => {
        const {
          rawFiles: files,
          selection: oldSelection,
          previousSelectionIndex: prevIndex,
        } = prevState;
        const selection = {};
        let previousSelectionIndex = undefined;
        if (isArray(files)) {
          previousSelectionIndex = isNumber(prevIndex)
            ? clampIndex(prevIndex, files)
            : undefined;
          files.map(file => {
            if (!isObject(file)) return;
            const wasSelected = oldSelection[file.id] === true;
            const canBeSelected = file.selectable !== false;
            if (wasSelected && canBeSelected) selection[file.id] = true;
          });
        }

        if (isFunction(onSelectionChange)) onSelectionChange(selection);
        return { selection, previousSelectionIndex };
      });
    }
  }

  public componentDidUpdate(
    prevProps: Readonly<FileBrowserProps>,
    prevState: Readonly<FileBrowserState>
  ): void {
    const { onSelectionChange } = this.props;
    const {
      rawFiles: oldRawFiles,
      selection: oldSelection,
      options: oldOptions,
      sortProperty: oldSortProperty,
      sortOrder: oldSortOrder,
    } = prevState;
    const {
      rawFiles,
      selection,
      options,
      sortProperty,
      sortOrder,
    } = this.state;

    let justChangedSelection = false;

    const needToResort =
      !shallowEqualArrays(rawFiles, oldRawFiles) ||
      !shallowEqualObjects(options, oldOptions) ||
      sortProperty !== oldSortProperty ||
      sortOrder !== oldSortOrder;
    if (needToResort) {
      const [sortedFiles, fileIndexMap] = FileUtil.sortFiles(
        rawFiles,
        options,
        sortProperty,
        sortOrder
      );
      const newState: Partial<FileBrowserState> = { sortedFiles, fileIndexMap };

      const newSelection = {};
      let additionCount = 0;
      for (const file of sortedFiles) {
        if (isNil(file) || selection[file.id] !== true) continue;
        newSelection[file.id] = true;
        additionCount++;
      }
      if (additionCount !== Object.keys(selection).length) {
        newState.selection = newSelection;
        justChangedSelection = true;
      }

      this.setState(newState as FileBrowserState);
    }

    if (
      !justChangedSelection &&
      selection !== oldSelection &&
      isFunction(onSelectionChange)
    ) {
      onSelectionChange(selection);
    }
  }

  protected setView = (view: FileView) => {
    this.setState(prevState => {
      if (prevState.view !== view) return { view };
      return null;
    });
  };

  protected setOption = (name: Option, value: boolean) => {
    this.setState(prevState => {
      const { options } = prevState;
      if (options[name] !== value)
        return { options: { ...options, [name]: value } };
      else return null;
    });
  };

  protected activateSortProperty = (name: SortProperty) => {
    this.setState(prevState => {
      if (prevState.sortProperty !== name) {
        return { sortProperty: name, sortOrder: SortOrder.Asc };
      } else {
        const sortOrder =
          prevState.sortOrder === SortOrder.Asc
            ? SortOrder.Desc
            : SortOrder.Asc;
        return { sortProperty: name, sortOrder };
      }
    });
  };

  private handleSelectionToggle = (
    type: SelectionType,
    file?: FileData,
    displayIndex?: number
  ) => {
    const { disableSelection } = this.props;

    this.selectedFilesSnapshotBeforeSingleClick = null;
    if (disableSelection === true) return;

    if (type === SelectionType.All) {
      this.setState(prevState => {
        const { sortedFiles, selection: oldSelection } = prevState;
        const count = Object.keys(oldSelection).length;
        if (count === sortedFiles.length) return { selection: {} };
        const selection = {};
        for (const file of sortedFiles) {
          if (isObject(file)) selection[file.id] = true;
        }
        return { selection };
      });
      return;
    } else if (type === SelectionType.None) {
      this.setState(prevState => {
        const { selection: oldSelection } = prevState;
        const count = Object.keys(oldSelection).length;
        if (count === 0) return null;
        return { selection: {} };
      });
      return;
    }

    if (isNil(file) || isNil(displayIndex)) {
      ConsoleUtil.warn(
        `Tried to toggle "${type}" selection without "file" or "displayIndex" specified!`
      );
      return;
    }

    this.setState(prevState => {
      const {
        sortedFiles,
        selection: oldSelection,
        previousSelectionIndex: prevI,
      } = prevState;
      const prevIndex = isNumber(prevI)
        ? clampIndex(prevI as number, sortedFiles)
        : null;

      if (type === SelectionType.Range && !isNumber(prevIndex)) {
        // Fallback to multiple selection if no previous index is available
        type = SelectionType.Multiple;
      }

      let selectionIndexToPersist = displayIndex;
      if (type == SelectionType.Multiple || type == SelectionType.Range) {
        if (isNumber(prevIndex)) selectionIndexToPersist = prevIndex as number;
      }

      let newSelection: Selection = {};
      const oldSelected = oldSelection[file.id];
      let singleAndInOldSelection = false;
      switch (type) {
        case SelectionType.Single:
          if (file.selectable !== false) {
            const selectionSize = Object.keys(oldSelection).length;
            singleAndInOldSelection = oldSelected === true;
            if (oldSelected !== true || selectionSize > 1) {
              newSelection[file.id] = true;
            }
          }
          if (isNil(oldSelected) && file.selectable !== false)
            newSelection[file.id] = true;
          break;
        case SelectionType.Multiple:
          newSelection = { ...oldSelection };
          if (oldSelected === true) delete newSelection[file.id];
          else if (file.selectable !== false) newSelection[file.id] = true;
          break;
        case SelectionType.Range:
          let indexA = prevIndex as number;
          let indexB = displayIndex;
          if (indexA > indexB) [indexA, indexB] = [indexB, indexA];
          for (let i = indexA; i < indexB + 1; ++i) {
            const file = sortedFiles[i];
            if (!isNil(file) && file.selectable !== false)
              newSelection[file.id] = true;
          }
          break;
      }

      if (singleAndInOldSelection) {
        this.selectedFilesSnapshotBeforeSingleClick = this.getFilesFromSelection(
          oldSelection
        );
      }

      return {
        selection: newSelection,
        previousSelectionIndex: selectionIndexToPersist,
      };
    });
  };

  /**
   * The method that returns the current file selection. The return value is an object where each key
   * represents a file ID, and value of `true` indicates that the object should be selected. This object is read-only.
   * [See relevant section](#section-managing-file-selection).
   * @public
   */
  public getSelection(): Selection {
    const { selection } = this.state;
    return { ...selection };
  }

  /**
   * A method that can be used to set the current file selection. The input should be an object where each key
   * represents a file ID, and value of `true` indicates that the object should be selected.
   * [See relevant section](#section-managing-file-selection).
   * @public
   */
  public setSelection(selection: Selection) {
    this.setState(prevState => {
      const { sortedFiles, fileIndexMap } = prevState;
      const newSelection = {};
      for (const id in selection) {
        if (selection[id] !== true) continue;

        const index = fileIndexMap[id];
        if (!isNumber(index)) continue;
        const file = sortedFiles[index];
        if (isNil(file)) continue;

        newSelection[file.id] = true;
      }
      return { selection: newSelection };
    });
  }

  public isInViewport(inputEvent: InputEvent, offset: number = 100): boolean {
    const ref = this.ref.current;
    if (isNil(ref)) return false;
    const {
      top: containerTop,
      bottom: containerBottom,
    } = ref.getBoundingClientRect();

    const doc = document.documentElement;
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const viewportHeight = Math.max(doc.clientHeight, window.innerHeight || 0);

    const outsideViewport =
      containerBottom + offset < 0 || containerTop - offset > viewportHeight;
    return !outsideViewport;
  }

  public getFilesFromSelection = (customSelection?: Selection) => {
    const { sortedFiles, fileIndexMap, selection: stateSelection } = this.state;
    const selection = isNil(customSelection) ? stateSelection : customSelection;
    const queue = new Denque();
    for (const id in selection) {
      if (selection[id] !== true) continue;
      const index = fileIndexMap[id];
      if (!isNumber(index)) continue;
      const file = sortedFiles[index];
      if (isNil(file)) continue;
      queue.push(file);
    }
    return queue.toArray();
  };

  private handleKeyPress: InputListener = (event: InputEvent) => {
    const { folderChain, onFileOpen, onDeleteFiles } = this.props;
    if (!this.isInViewport(event)) return false;

    if (event.key === KbKey.Backspace) {
      const parentFolder = getNonNil(folderChain, -2);
      if (isNil(parentFolder) || parentFolder.openable === false) return false;
      if (isFunction(onFileOpen)) {
        onFileOpen(parentFolder);
        return true;
      }
    } else if (event.key === KbKey.A && event.ctrlKey) {
      this.handleSelectionToggle(SelectionType.All);
      return true;
    } else if (event.key === KbKey.Escape) {
      this.handleSelectionToggle(SelectionType.None);
      return true;
    } else if (event.key === KbKey.Delete) {
      const files = this.getFilesFromSelection();
      if (files.length > 0 && isFunction(onDeleteFiles)) {
        onDeleteFiles(files, event);
        return true;
      }
    }

    return false;
  };

  private handleFileSingleClick: InternalClickHandler = (
    file: FileData,
    displayIndex: number,
    event: InputEvent
  ) => {
    const { onFileSingleClick } = this.props;

    Promise.resolve()
      .then(() => {
        return Promise.resolve()
          .then(() => {
            if (!isFunction(onFileSingleClick)) return false;
            return onFileSingleClick(file, event);
          })
          .catch((error: Error) => {
            ConsoleUtil.logUnhandledUserException(
              error,
              'running the single click handler'
            );
            return false;
          });
      })
      .then((preventDefault: Nilable<boolean>) => {
        if (preventDefault === true) return;

        let type = isMobileDevice()
          ? SelectionType.Multiple
          : SelectionType.Single;
        if (event.ctrlKey || event.key === KbKey.Space)
          type = SelectionType.Multiple;
        if (event.shiftKey) type = SelectionType.Range;

        return this.handleSelectionToggle(type, file, displayIndex);
      })
      .catch((error: Error) =>
        ConsoleUtil.logInternalException(error, 'handling selection toggle.')
      );
  };

  private handleFileDoubleClick: InternalClickHandler = (
    file: FileData,
    displayIndex: number,
    event: InputEvent
  ) => {
    const { onFileDoubleClick, onFileOpen, onOpenFiles } = this.props;

    // Tried to load snapshot to make double-clicking a file when it's a part of
    // multi-file selection work correctly.
    const localSelectedFilesSnapshot = this
      .selectedFilesSnapshotBeforeSingleClick;
    const selectedFilesSnapshot = isNil(localSelectedFilesSnapshot)
      ? this.getFilesFromSelection()
      : localSelectedFilesSnapshot;

    return Promise.resolve()
      .then(() => {
        return Promise.resolve()
          .then(() => {
            if (!isFunction(onFileDoubleClick)) return false;
            return onFileDoubleClick(file, event);
          })
          .catch((error: Error) => {
            ConsoleUtil.logUnhandledUserException(
              error,
              'running the double click handler'
            );
            return false;
          });
      })
      .then((preventDefault: Nilable<boolean>) => {
        if (preventDefault === true) return;

        let promise: Promise<any> = Promise.resolve();
        if (isFunction(onFileOpen) && file.openable !== false) {
          promise = promise
            .then(() => onFileOpen(file, event))
            .catch((error: Error) =>
              ConsoleUtil.logUnhandledUserException(
                error,
                'running the single file opening handler'
              )
            );
        }
        if (isFunction(onOpenFiles)) {
          const openableFiles = selectedFilesSnapshot.filter(
            f => f.openable !== false
          );
          if (openableFiles.length > 0) {
            promise = promise
              .then(() => onOpenFiles(openableFiles, event))
              .catch((error: Error) =>
                ConsoleUtil.logUnhandledUserException(
                  error,
                  'running the multiple file opening handler'
                )
              );
          }
        }
        return promise;
      });
  };

  public render() {
    const {
      doubleClickDelay,
      onFileOpen,
      onFolderCreate,
      onUploadClick,
      onDownloadFiles,
      onDeleteFiles,
      thumbnailGenerator,
      fillParentContainer,
    } = this.props;
    const {
      folderChain,
      sortedFiles,
      selection,
      view,
      options,
      sortProperty,
      sortOrder,
    } = this.state;

    const className = classnames({
      chonky: true,
      'chonky-no-select': options[Option.DisableTextSelection],
      'chonky-fill-parent': fillParentContainer === true,
    });
    return (
      <div ref={this.ref} className={className}>
        <Controls
          folderChain={folderChain}
          selection={selection}
          onFileOpen={onFileOpen}
          onFolderCreate={onFolderCreate}
          onUploadClick={onUploadClick}
          onDownloadFiles={onDownloadFiles}
          onDeleteFiles={onDeleteFiles}
          getFilesFromSelection={this.getFilesFromSelection}
          view={view}
          setView={this.setView}
          options={options}
          setOption={this.setOption}
          activateSortProperty={this.activateSortProperty}
          sortProperty={sortProperty}
          sortOrder={sortOrder}
        />
        <FileList
          files={sortedFiles}
          selection={selection}
          doubleClickDelay={doubleClickDelay as number}
          onFileSingleClick={this.handleFileSingleClick}
          onFileDoubleClick={this.handleFileDoubleClick}
          thumbnailGenerator={thumbnailGenerator}
          showRelativeDates={options[Option.ShowRelativeDates]}
          fillParentContainer={fillParentContainer === true}
          view={view}
        />
      </div>
    );
  }
}
