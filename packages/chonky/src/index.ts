import {
    GenericFileActionHandler,
    MapFileActionsToData,
} from './file-actons/handler.types';
import { ChonkyActionUnion } from './types/file-browser.types';

export { FileBrowser } from './components/external/FileBrowser';
export { FileNavbar } from './components/external/FileNavbar';
export { FileToolbar } from './components/external/FileToolbar';
export { FileList } from './components/file-list/FileList';

export { ChonkyActions, DefaultFileActions } from './file-actons/definitions';
export { FileHelper } from './util/file-helper';

export { FileData, FileArray } from './types/files.types';
export {
    FileAction,
    FileActionEffect,
    FileSelectionTransform,
    FileActionButton,
} from './file-actons/actions.types';
export {
    GenericFileActionHandler,
    MapFileActionsToData,
    FileActionData,
    FileActionState,
} from './file-actons/handler.types';
export { ChonkyActionUnion } from './types/file-browser.types';

export { FileBrowserHandle } from './types/file-browser.types';
export { ChonkyIconName } from './types/icons.types';

export type FileActionHandler = GenericFileActionHandler<ChonkyActionUnion>;
export type ChonkyFileActionData = MapFileActionsToData<ChonkyActionUnion>;
