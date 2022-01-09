import { FileAction } from '../types/action.types';
import { ChonkyIconName } from '../types/icons.types';

const validateActionTypes = <T extends { [action: string]: FileAction }>(actionMap: T): T => actionMap;

export const OldChonkyActions = validateActionTypes({
  // Optional actions
  CopyFiles: {
    id: 'copy_files',
    requiresSelection: true,
    hotkeys: ['ctrl+c'],
    button: {
      name: 'Copy selection',
      toolbar: true,
      contextMenu: true,
      group: 'Actions',
      dropdown: true,
      icon: ChonkyIconName.copy,
    },
  },
  CreateFolder: {
    id: 'create_folder',
    button: {
      name: 'Create folder',
      toolbar: true,
      contextMenu: true,
      tooltip: 'Create a folder',
      icon: ChonkyIconName.folderCreate,
    },
  },
  UploadFiles: {
    id: 'upload_files',
    button: {
      name: 'Upload files',
      toolbar: true,
      contextMenu: true,
      tooltip: 'Upload files',
      icon: ChonkyIconName.upload,
    },
  },
  DownloadFiles: {
    id: 'download_files',
    requiresSelection: true,
    button: {
      name: 'Download files',
      toolbar: true,
      contextMenu: true,
      group: 'Actions',
      tooltip: 'Download files',
      dropdown: true,
      icon: ChonkyIconName.download,
    },
  },
  DeleteFiles: {
    id: 'delete_files',
    requiresSelection: true,
    hotkeys: ['delete'],
    button: {
      name: 'Delete files',
      toolbar: true,
      contextMenu: true,
      group: 'Actions',
      tooltip: 'Delete files',
      dropdown: true,
      icon: ChonkyIconName.trash,
    },
  },
});
