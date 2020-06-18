export { FileBrowser } from './components/external/FileBrowser';
export { FileToolbar } from './components/external/FileToolbar';
export { FileSearch } from './components/external/FileSearch';
export { FileList } from './components/external/FileList';
export { ChonkyIconFA, ChonkyIconName } from './components/external/ChonkyIcon';

export { ChonkyActions } from './util/file-actions';

export {
    FileData,
    FileArray,
    FileSelection,
    FileAction,
    FileActionHandler,
    FileActionData,
} from './typedef';

// Export interface separately to comply with isolated module requirements
// @see https://github.com/microsoft/TypeScript/issues/28481
export type FileBrowserProps = import('./components/external/FileBrowser').FileBrowserProps;
export type FileToolbarProps = import('./components/external/FileToolbar').FileToolbarProps;
export type FileListProps = import('./components/external/FileList').FileListProps;
export type ChonkyIconProps = import('./components/external/ChonkyIcon').ChonkyIconProps;
