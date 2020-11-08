import {
    GenericFileActionHandler,
    MapFileActionsToData,
} from './types/action-handler.types';
import { ChonkyActionUnion } from './types/file-browser.types';

export { FileBrowser } from './components/external/FileBrowser';
export { FileNavbar } from './components/external/FileNavbar';
export { FileToolbar } from './components/external/FileToolbar';
export { FileList } from './components/file-list/FileList';
export { FileContextMenu } from './components/external/FileContextMenu';

export { ChonkyActions, DefaultFileActions } from './action-definitions';
export { defineFileAction } from './util/helpers';
export {
    thunkDispatchFileAction,
    thunkRequestFileAction,
} from './redux/thunks/dispatchers.thunks';

export { FileHelper } from './util/file-helper';
export { FileData, FileArray } from './types/file.types';
export {
    FileAction,
    FileActionEffect,
    FileSelectionTransform,
    FileActionButton,
} from './types/action.types';
export {
    GenericFileActionHandler,
    MapFileActionsToData,
    FileActionData,
    FileActionState,
} from './types/action-handler.types';
export { ChonkyActionUnion } from './types/file-browser.types';

export { FileBrowserHandle, FileBrowserProps } from './types/file-browser.types';
export {
    FileViewConfig,
    FileViewConfigGrid,
    FileViewConfigList,
    FileViewMode,
} from './types/file-view.types';
export { ChonkyIconName, ChonkyIconProps } from './types/icons.types';

export { setChonkyDefaults } from './util/default-config';

export type FileActionHandler = GenericFileActionHandler<ChonkyActionUnion>;
export type ChonkyFileActionData = MapFileActionsToData<ChonkyActionUnion>;
