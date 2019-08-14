/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import React from 'react';
import {Nilable, Nullable} from 'tsdef';
import classnames from 'classnames';
import {shallowEqualArrays, shallowEqualObjects} from 'shallow-equal';

import {
    InternalClickHandler,
    FileView,
    InputEvent,
    InputListener,
    KbKey,
    Option,
    Options,
    Selection,
    SelectionStatus,
    SelectionType,
    SortOrder,
    SortProperty,
    ThumbnailGenerator,
    FileData,
    SingleFileActionHandler,
} from '../typedef';
import {
    clampIndex,
    deregisterKbListener,
    generateId,
    getNonNil,
    isArray, isBoolean,
    isFunction,
    isNil,
    isNumber,
    isObject,
    registerKbListener,
} from '../util/Util';
import FileList from './FileList';
import Controls from './Controls';
import {FileUtil} from '../util/FileUtil';
import ConsoleUtil from '../util/ConsoleUtil';

// Important: Make sure to keep `FileBrowserProps` and `FileBrowserPropTypes` in sync!
interface FileBrowserProps {
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

    // /**
    //  * This function is similar to `onFileOpen`, except the first argument is an array of files. The array will have
    //  * more than one element if the user makes a file selection containing multiple files, and then double-clicks on
    //  * one of the files.
    //  * [See relevant section](#section-handling-file-actions).
    //  */
    // onOpenFiles?: MultiFileActionHandler;
    // onDownloadFiles?: MultiFileActionHandler;
    // onMoveFiles?: MultiFileActionHandler;
    // onDeleteFiles?: MultiFileActionHandler;

    /**
     * Maximum delay between the two clicks in a double click.
     */
    doubleClickDelay?: number;

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
     * The file object property that files are initially sorted by. This should be set using the `SortProperty` enum.
     * Users can change the sort property by clicking on column names in detailed view.
     * [See relevant section](#section-setting-file-browser-options).
     */
    sortProperty?: SortProperty;

    /**
     * The order in which the files are presented. This should be set using the `SortOrder` enum. Users can change the
     * sort order by clicking on column names in detailed view.
     * [See relevant section](#section-setting-file-browser-options).
     */
    sortOrder?: SortOrder;
}

interface FileBrowserState {
    rawFiles: Nullable<FileData>[];
    folderChain?: Nullable<FileData>[];
    sortedFiles: Nullable<FileData>[];
    fileIndexMap: { [id: string]: number }; // Maps file ID to its index in file array

    previousSelectionIndex?: number;
    selection: Selection;

    view: FileView;
    options: Options;
    sortProperty: SortProperty;
    sortOrder: SortOrder;
}

/**
 * File browser component.
 */
export default class FileBrowser extends React.Component<FileBrowserProps, FileBrowserState> {

    public static defaultProps: Partial<FileBrowserProps> = {
        doubleClickDelay: 300,
        disableSelection: false,
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
    private readonly instanceId: string;

    public constructor(props: FileBrowserProps) {
        super(props);
        this.ref = React.createRef();
        this.instanceId = generateId();
        this.instanceId = generateId();

        const {
            files: rawFiles, folderChain, view: propView,
            options: propOptions, sortProperty: propSortProperty, sortOrder: propSortOrder,
        } = props;

        const defaults = FileBrowser.defaultProps;
        const selection = {};
        const view = !isNil(propView) ? propView : defaults.view as FileView;
        const options: Options = {...defaults.options as Options, ...propOptions};
        const sortProperty = !isNil(propSortProperty) ? propSortProperty : defaults.sortProperty as SortProperty;
        const sortOrder = !isNil(propSortOrder) ? propSortOrder : defaults.sortOrder as SortOrder;

        const [sortedFiles, fileIndexMap] = FileUtil.sortFiles(rawFiles, options, sortProperty, sortOrder);

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

    public UNSAFE_componentWillReceiveProps(nextProps: Readonly<FileBrowserProps>): void {
        const old = this.props;
        const {
            files, folderChain, onSelectionChange, disableSelection,
            view, options, sortProperty, sortOrder,
        } = nextProps;

        let selectionStatus = SelectionStatus.Ok;

        if (!shallowEqualArrays(files, old.files)) {
            selectionStatus = SelectionStatus.NeedsCleaning;
            this.setState({rawFiles: files});
        }
        if (!shallowEqualArrays(folderChain, old.folderChain)) {
            if (!isArray(folderChain) || getNonNil(folderChain, -1) !== getNonNil(old.folderChain, -1)) {
                selectionStatus = SelectionStatus.NeedsResetting;
            }
            this.setState({folderChain});
        }

        if (disableSelection === true && disableSelection !== old.disableSelection) {
            selectionStatus = SelectionStatus.NeedsResetting;
        }
        if (!isNil(view) && view !== old.view) this.setState({view});
        if (isObject(options) && options !== old.options) {
            this.setState(prevState => ({options: {...prevState.options, ...options}}));
        }
        if (!isNil(sortProperty) && sortProperty !== old.sortProperty) this.setState({sortProperty});
        if (!isNil(sortOrder) && sortOrder !== old.sortOrder) this.setState({sortOrder});

        if (selectionStatus === SelectionStatus.NeedsResetting) {
            this.setState(() => {
                const selection = {};
                if (isFunction(onSelectionChange)) onSelectionChange(selection);
                return {selection, previousSelectionIndex: undefined};
            });
        } else if (selectionStatus === SelectionStatus.NeedsCleaning) {
            this.setState(prevState => {
                const {rawFiles: files, selection: oldSelection, previousSelectionIndex: prevIndex} = prevState;
                const selection = {};
                let previousSelectionIndex = undefined;
                if (isArray(files)) {
                    previousSelectionIndex = isNumber(prevIndex) ? clampIndex(prevIndex, files) : undefined;
                    files.map(file => {
                        if (!isObject(file)) return;
                        const wasSelected = oldSelection[file.id] === true;
                        const canBeSelected = file.selectable !== false;
                        if (wasSelected && canBeSelected) selection[file.id] = true;
                    });
                }

                if (isFunction(onSelectionChange)) onSelectionChange(selection);
                return {selection, previousSelectionIndex};
            });
        }
    }

    public componentDidUpdate(prevProps: Readonly<FileBrowserProps>, prevState: Readonly<FileBrowserState>): void {
        const {onSelectionChange} = this.props;
        const {
            rawFiles: oldRawFiles, selection: oldSelection, options: oldOptions,
            sortProperty: oldSortProperty, sortOrder: oldSortOrder,
        } = prevState;
        const {rawFiles, selection, options, sortProperty, sortOrder} = this.state;

        let justChangedSelection = false;

        const needToResort = !shallowEqualArrays(rawFiles, oldRawFiles)
            || !shallowEqualObjects(options, oldOptions)
            || sortProperty !== oldSortProperty
            || sortOrder !== oldSortOrder;
        if (needToResort) {
            const [sortedFiles, fileIndexMap] = FileUtil.sortFiles(rawFiles, options, sortProperty, sortOrder);
            const newState: Partial<FileBrowserState> = {sortedFiles, fileIndexMap};

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

        if (!justChangedSelection && selection !== oldSelection && isFunction(onSelectionChange)) {
            onSelectionChange(selection);
        }
    }

    protected setView = (view: FileView) => {
        this.setState(prevState => {
            if (prevState.view !== view) return {view};
            return null;
        });
    };

    protected setOption = (name: Option, value: boolean) => {
        this.setState(prevState => {
            const {options} = prevState;
            if (options[name] !== value) return {options: {...options, [name]: value}};
            else return null;
        });
    };

    protected activateSortProperty = (name: SortProperty) => {
        this.setState(prevState => {
            if (prevState.sortProperty !== name) {
                return {sortProperty: name, sortOrder: SortOrder.Asc};
            } else {
                const sortOrder = prevState.sortOrder === SortOrder.Asc ? SortOrder.Desc : SortOrder.Asc;
                return {sortProperty: name, sortOrder};
            }
        });
    };

    private handleSelectionToggle = (type: SelectionType, file?: FileData, displayIndex?: number) => {
        const {disableSelection} = this.props;

        if (disableSelection === true) return;

        if (type === SelectionType.All) {
            this.setState(prevState => {
                const {sortedFiles, selection: oldSelection} = prevState;
                const count = Object.keys(oldSelection).length;
                if (count === sortedFiles.length) return {selection: {}};
                const selection = {};
                for (const file of sortedFiles) {
                    if (isObject(file)) selection[file.id] = true;
                }
                return {selection};
            });
            return;
        } else if (type === SelectionType.None) {
            this.setState(prevState => {
                const {selection: oldSelection} = prevState;
                const count = Object.keys(oldSelection).length;
                if (count === 0) return null;
                return {selection: {}};
            });
            return;
        }

        if (isNil(file) || isNil(displayIndex)) {
            ConsoleUtil.warn(`Tried to toggle "${type}" selection without "file" or "displayIndex" specified!`);
            return;
        }

        this.setState(prevState => {
            const {sortedFiles, selection: oldSelection, previousSelectionIndex: prevI} = prevState;
            const prevIndex = isNumber(prevI) ? clampIndex(prevI as number, sortedFiles) : null;

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
            switch (type) {
                case SelectionType.Single:
                    if (isNil(oldSelected) && file.selectable !== false) newSelection[file.id] = true;
                    break;
                case SelectionType.Multiple:
                    newSelection = {...oldSelection};
                    if (oldSelected === true) delete newSelection[file.id];
                    else newSelection[file.id] = true;
                    break;
                case SelectionType.Range:
                    let indexA = prevIndex as number;
                    let indexB = displayIndex;
                    if (indexA > indexB) [indexA, indexB] = [indexB, indexA];
                    for (let i = indexA; i < indexB + 1; ++i) {
                        const file = sortedFiles[i];
                        if (!isNil(file) && file.selectable !== false) newSelection[file.id] = true;
                    }
                    break;
            }

            return {selection: newSelection, previousSelectionIndex: selectionIndexToPersist};
        });
    };

    public isInViewport(inputEvent: InputEvent, offset: number = 100): boolean {
        const ref = this.ref.current;
        if (isNil(ref)) return false;
        const {top: containerTop, bottom: containerBottom} = ref.getBoundingClientRect();

        const doc = document.documentElement;
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        const viewportHeight = Math.max(doc.clientHeight, window.innerHeight || 0);

        const outsideViewport = (containerBottom + offset < 0) || (containerTop - offset > viewportHeight);
        return !outsideViewport;
    }

    private handleKeyPress: InputListener = (event: InputEvent) => {
        const {folderChain, onFileOpen} = this.props;
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
        }

        return false;
    };

    private handleFileSingleClick: InternalClickHandler = (file: FileData, displayIndex: number, event: InputEvent) => {
        const {onFileSingleClick} = this.props;

        // TODO: Simplify this code, throw away `isPromise
        let isPromise = true;
        Promise.resolve()
            .then(() => {
                return Promise.resolve()
                    .then(() => {
                        if (!isFunction(onFileSingleClick)) return false;
                        const result = onFileSingleClick(file, event);
                        isPromise = !isNil(result) && !isBoolean(result) && isFunction(result.then);
                        return result;
                    })
                    .catch((error: Error) => {
                        const action = `running the single click handler`;
                        if (isPromise) ConsoleUtil.logUnhandledPromiseError(error, action);
                        else ConsoleUtil.logUnhandledException(error, action);
                        return false;
                    });
            })
            .then((preventDefault: Nilable<boolean>) => {
                if (preventDefault === true) return;

                let type = SelectionType.Single;
                if (event.key === KbKey.Space || event.ctrlKey === true) type = SelectionType.Multiple;
                if (event.shiftKey === true) type = SelectionType.Range;

                return this.handleSelectionToggle(type, file, displayIndex);
            })
            .catch((error: Error) => ConsoleUtil.logInternalException(error, 'handling selection toggle.'));
    };

    private handleFileDoubleClick: InternalClickHandler = (file: FileData, displayIndex: number, event: InputEvent) => {
        const {onFileDoubleClick, onFileOpen} = this.props;

        // TODO: Simplify this code, throw away `isPromise
        let isPromise = true;
        Promise.resolve()
            .then(() => {
                return Promise.resolve()
                    .then(() => {
                        if (!isFunction(onFileDoubleClick)) return false;
                        const result = onFileDoubleClick(file, event);
                        isPromise = !isNil(result) && !isBoolean(result) && isFunction(result.then);
                        return result;
                    })
                    .catch((error: Error) => {
                        const action = `running the double click handler`;
                        if (isPromise) ConsoleUtil.logUnhandledPromiseError(error, action);
                        else ConsoleUtil.logUnhandledException(error, action);
                        return false;
                    });
            })
            .then((preventDefault: Nilable<boolean>) => {
                if (preventDefault === true) return;

                if (isFunction(onFileOpen) && file.openable !== false) return onFileOpen(file);
                return;
            })
            .catch((error: Error) => ConsoleUtil.logUnhandledException(error, 'running the file opening handler'));
    };

    public render() {
        const {doubleClickDelay, onFileOpen, thumbnailGenerator} = this.props;
        const {folderChain, sortedFiles, selection, view, options, sortProperty, sortOrder} = this.state;

        const className = classnames({
            'chonky': true,
            'chonky-no-select': options[Option.DisableTextSelection],
        });
        return (
            <div ref={this.ref} className={className}>
                <Controls folderChain={folderChain} onFileOpen={onFileOpen} view={view}
                          setView={this.setView} options={options} setOption={this.setOption}/>
                <FileList instanceId={this.instanceId} files={sortedFiles} selection={selection}
                          activateSortProperty={this.activateSortProperty}
                          doubleClickDelay={doubleClickDelay as number}
                          onFileSingleClick={this.handleFileSingleClick}
                          onFileDoubleClick={this.handleFileDoubleClick}
                          thumbnailGenerator={thumbnailGenerator}
                          view={view} sortProperty={sortProperty}
                          sortOrder={sortOrder} showRelativeDates={options[Option.ShowRelativeDates]}
                />
            </div>
        );
    }

}
