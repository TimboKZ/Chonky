/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {shallowEqualArrays, shallowEqualObjects} from 'shallow-equal';

import FileList from './FileList';
import Controls from './Controls';
import {FileUtil} from './FileUtil';
import {
    ClickEvent,
    FileClickHandler,
    FileData,
    FolderView,
    Nullable,
    Option,
    Options,
    Selection,
    SelectionType,
    SortOrder,
    SortProperty,
    ThumbnailGenerator,
} from './typedef';
import {isNumber} from 'util';

// Important: Make sure to keep `FileBrowserProps` and `FileBrowserPropTypes` in sync!
type FileBrowserProps = {
    files: Nullable<FileData>[];
    folderChain?: Nullable<FileData>[];

    doubleClickDelay?: number;
    onFileSingleClick?: FileClickHandler<boolean>;
    onFileDoubleClick?: FileClickHandler<boolean>;
    onFileOpen?: (file: FileData) => void;
    onSelectionChange?: (selection: Selection) => void;

    thumbnailGenerator?: ThumbnailGenerator,

    selection?: Selection,
    disableSelection?: boolean,
    view?: FolderView;
    options?: Partial<Options>;
    sortProperty?: SortProperty;
    sortOrder?: SortOrder;
}

// Important: Make sure to keep `FileBrowserProps` and `FileBrowserPropTypes` in sync!
const FileBrowserPropTypes = {
    files: PropTypes.array.isRequired,
    folderChain: PropTypes.array,

    doubleClickDelay: PropTypes.number,
    onFileSingleClick: PropTypes.func,
    onFileDoubleClick: PropTypes.func,
    onFileOpen: PropTypes.func,
    onSelectionChange: PropTypes.func,

    thumbnailGenerator: PropTypes.func,

    selection: PropTypes.object,
    disableSelection: PropTypes.bool,
    view: PropTypes.string,
    options: PropTypes.object,
    sortProperty: PropTypes.string,
    sortOrder: PropTypes.string,
} as unknown as FileBrowserProps;

type FileBrowserState = {
    rawFiles: Nullable<FileData>[];
    folderChain?: Nullable<FileData>[];
    sortedFiles: Nullable<FileData>[];

    previousSelectionIndex?: number;
    selection: Selection;

    view: FolderView;
    options: Options;
    sortProperty: SortProperty;
    sortOrder: SortOrder;
}

export default class FileBrowser extends React.Component<FileBrowserProps, FileBrowserState> {

    static propTypes = FileBrowserPropTypes;

    static defaultProps: Partial<FileBrowserProps> = {
        doubleClickDelay: 300,
    };

    constructor(props: FileBrowserProps) {
        super(props);

        const {
            files: rawFiles, folderChain, selection: propSelection, view: propView,
            options: propOptions, sortProperty: propSortProperty, sortOrder: propSortOrder,
        } = props;
        // const rawFiles = files.concat([null, null]);

        const selection = propSelection ? propSelection : {};
        const view = propView ? propView : FolderView.Details;
        const options = {
            [Option.ShowHidden]: true,
            [Option.FoldersFirst]: true,
            [Option.ShowExtensions]: true,
            [Option.ConfirmDeletions]: true,
            [Option.DisableSelection]: true,
            ...propOptions,
        };
        const sortProperty = propSortProperty ? propSortProperty : SortProperty.Name;
        const sortOrder = propSortOrder ? propSortOrder : SortOrder.Asc;

        this.state = {
            rawFiles,
            folderChain,
            sortedFiles: FileUtil.sortFiles(rawFiles, options, sortProperty, sortOrder),
            selection,
            view,
            options,
            sortProperty,
            sortOrder,
        };
    }

    componentWillReceiveProps(nextProps: Readonly<FileBrowserProps>): void {
        const old = this.props;
        const state = this.state;
        const {files, folderChain, selection, disableSelection, view, options, sortProperty, sortOrder} = nextProps;
        if (!shallowEqualArrays(files, old.files)) {
            this.setState(prevState => {
                const newSelection = {};
                files.map(f => {
                    if (f && prevState.selection[f.id] === true) newSelection[f.id] = true;
                });
                return {rawFiles: files, selection: newSelection};
            });
        }
        if (!shallowEqualArrays(folderChain, old.folderChain)) this.setState({folderChain});

        if (!shallowEqualObjects(selection, old.selection) && !shallowEqualObjects(selection, state.selection)) {
            this.setState({selection: {...selection}});
        }

        if (disableSelection && disableSelection !== old.disableSelection) this.setState({selection: {}});
        if (!!view && view !== old.view) this.setState({view});
        if (!!options && options !== old.options) {
            this.setState(prevState => ({options: {...prevState.options, ...options}}));
        }
        if (!!sortProperty && sortProperty !== old.sortProperty) this.setState({sortProperty});
        if (!!sortOrder && sortOrder !== old.sortOrder) this.setState({sortOrder});
    }

    componentDidUpdate(prevProps: Readonly<FileBrowserProps>, prevState: Readonly<FileBrowserState>,
                       snapshot?: any): void {
        const {
            rawFiles: oldRawFiles, options: oldOptions,
            sortProperty: oldSortProperty, sortOrder: oldSortOrder,
        } = prevState;
        const {rawFiles, options, sortProperty, sortOrder} = this.state;
        const needToResort = !shallowEqualArrays(rawFiles, oldRawFiles)
            || !shallowEqualObjects(options, oldOptions)
            || sortProperty !== oldSortProperty
            || sortOrder !== oldSortOrder;
        if (needToResort) {
            this.setState({
                sortedFiles: FileUtil.sortFiles(rawFiles, options, sortProperty, sortOrder),
            });
        }
    }

    setView = (view: FolderView) => {
        this.setState(prevState => {
            if (prevState.view !== view) return {view};
            return null;
        });
    };

    setOption = (name: Option, value: boolean) => {
        this.setState(prevState => {
            const {options} = prevState;
            if (options[name] !== value) return {options: {...options, [name]: value}};
            else return null;
        });
    };

    activateSortProperty = (name: SortProperty) => {
        this.setState(prevState => {
            if (prevState.sortProperty !== name) {
                return {sortProperty: name, sortOrder: SortOrder.Asc};
            } else {
                const sortOrder = prevState.sortOrder === SortOrder.Asc ? SortOrder.Desc : SortOrder.Asc;
                return {sortProperty: name, sortOrder};
            }
        });
    };

    handleFileSingleClick: FileClickHandler = (file: FileData, displayIndex: number,
                                               event: ClickEvent, keyboard: boolean) => {
        const {onFileSingleClick, onSelectionChange, disableSelection} = this.props;

        // Prevent default behaviour if user's handler returns `true`
        let preventDefault = false;
        if (onFileSingleClick) {
            const funcResult = onFileSingleClick(file, displayIndex, event, keyboard) as boolean | undefined;
            preventDefault = funcResult === true;
        }
        if (preventDefault) return;
        if (disableSelection) return;

        this.setState(prevState => {
            const {sortedFiles, selection: oldSelection, previousSelectionIndex: prevI} = prevState;
            const prevIndex = isNumber(prevI) ? Math.max(0, Math.min(sortedFiles.length - 1, prevI)) : null;

            let type = SelectionType.Single;
            if (event.ctrlKey) type = SelectionType.Multiple;
            if (event.shiftKey && isNumber(prevIndex)) type = SelectionType.Range;

            let newSelection: Selection = {};
            const oldSelected = oldSelection[file.id];
            switch (type) {
                case SelectionType.Single:
                    newSelection[file.id] = true;
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
                        if (file) newSelection[file.id] = true;
                    }
                    break;
            }

            if (onSelectionChange) onSelectionChange(newSelection);
            return {selection: newSelection, previousSelectionIndex: displayIndex};
        });
    };

    handleFileDoubleClick: FileClickHandler = (file: FileData, displayIndex: number,
                                               event: ClickEvent, keyboard: boolean) => {
        const {onFileDoubleClick, onFileOpen} = this.props;

        // Prevent default behaviour if user's handler returns `true`
        let preventDefault = false;
        if (onFileDoubleClick) {
            const funcResult = onFileDoubleClick(file, displayIndex, event, keyboard) as boolean | undefined;
            preventDefault = funcResult === true;
        }
        if (preventDefault) return;

        if (onFileOpen) onFileOpen(file);
    };

    render() {
        const {doubleClickDelay, onFileOpen, thumbnailGenerator} = this.props;
        const {folderChain, sortedFiles, selection, view, options, sortProperty, sortOrder} = this.state;

        const className = classnames({
            'chonky': true,
            'chonky-no-select': options[Option.DisableSelection],
        });
        return (
            <div className={className}>
                <Controls folderChain={folderChain} onFileOpen={onFileOpen} view={view}
                          setView={this.setView} options={options} setOption={this.setOption}/>
                <FileList files={sortedFiles} selection={selection} view={view}
                          sortProperty={sortProperty} sortOrder={sortOrder}
                          activateSortProperty={this.activateSortProperty}
                          doubleClickDelay={doubleClickDelay as number}
                          onFileSingleClick={this.handleFileSingleClick}
                          onFileDoubleClick={this.handleFileDoubleClick}
                          thumbnailGenerator={thumbnailGenerator}/>
            </div>
        );
    }

}
