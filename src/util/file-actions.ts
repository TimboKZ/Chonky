import { FileAction } from '../typedef';

export const DefaultActions: { [name: string]: FileAction } = {
    OpenParentFolder: {
        name: 'open_parent_folder',
        hotkeys: ['backspace'],
    },
    OpenFiles: {
        name: 'open_files',
        requiresSelection: true,
    },
};

export const ChonkyActions: { [name: string]: FileAction } = {
    ...DefaultActions,
};
