import { ChonkyIconName } from '../types/icons.types';
import { defineFileAction } from '../util/helpers';

export const ExtraActions = {
  /**
   * Action that adds a button and shortcut to copy files.
   */
  CopyFiles: defineFileAction({
    id: 'copy_files',
    requiresSelection: true,
    hotkeys: ['ctrl+c'],
    button: {
      name: 'Copy selection',
      toolbar: true,
      contextMenu: true,
      group: 'Actions',
      icon: ChonkyIconName.copy,
    },
  } as const),
  /**
   * Action that adds a button to create a new folder.
   */
  CreateFolder: defineFileAction({
    id: 'create_folder',
    button: {
      name: 'Create folder',
      toolbar: true,
      tooltip: 'Create a folder',
      icon: ChonkyIconName.folderCreate,
    },
  } as const),
  /**
   * Action that adds a button to upload files.
   */
  UploadFiles: defineFileAction({
    id: 'upload_files',
    button: {
      name: 'Upload files',
      toolbar: true,
      tooltip: 'Upload files',
      icon: ChonkyIconName.upload,
    },
  } as const),
  /**
   * Action that adds a button to download files.
   */
  DownloadFiles: defineFileAction({
    id: 'download_files',
    requiresSelection: true,
    button: {
      name: 'Download files',
      toolbar: true,
      contextMenu: true,
      group: 'Actions',
      icon: ChonkyIconName.download,
    },
  } as const),
  /**
   * Action that adds a button and shortcut to delete files.
   */
  DeleteFiles: defineFileAction({
    id: 'delete_files',
    requiresSelection: true,
    hotkeys: ['delete'],
    button: {
      name: 'Delete files',
      toolbar: true,
      contextMenu: true,
      group: 'Actions',
      icon: ChonkyIconName.trash,
    },
  } as const),
};
