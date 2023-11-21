import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { 
  FileNavbar, 
  FileBrowser, 
  FileToolbar, 
  FileList, 
  FileContextMenu, 
  setChonkyDefaults,
  ChonkyActions,
  defineFileAction,
  ChonkyIconName
} from '../.';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';

setChonkyDefaults({ iconComponent: ChonkyIconFA });

const App = () => {
  const files = [
    {
      id: 'nTe',
      name: 'Normal file.yml',
      size: 890,
      modDate: new Date('2012-01-01'),
    },
    {
      id: 'zxc',
      name: 'Hidden file.mp4',
      // isHidden: true,
      size: 890,
    },
    {
      id: 'bnm',
      name: 'Normal folder',
      isDir: true,
      childrenCount: 12,
    },
    {
      id: 'vfr',
      name: 'Symlink folder',
      isDir: true,
      // isSymlink: true,
      childrenCount: 0,
    },
    {
      id: '7zp',
      name: 'Encrypted file.mp3',
      // isEncrypted: true,
    },
    {
      id: 'qwe',
      name: 'Not selectable.tar.gz',
      ext: '.tar.gz', // Custom extension
      selectable: false, // Disable selection
      size: 54300000000,
      modDate: new Date(),
    },
    {
      id: 'rty',
      name: 'Not openable.md',
      openable: false, // Prevent opening
      size: 100000000,
    },
    {
      id: 'btj',
      name: 'Not draggable.csv',
      draggable: false, // Prevent this files from being dragged
    },
    {
      id: 'upq',
      name: 'Not droppable',
      isDir: true,
      droppable: false, // Prevent files from being dropped into this folder
    },
    {
      id: 'mRw',
      name: 'Unknown file name',
    },
    {
      id: 'mEt',
      name: 'Custom icon & color',
      // color: '#09f',
      // icon: ChonkyIconName.dndCanDrop,
    },
  ];

  const folderChain = [
    { id: 'zxc', name: 'Files', isDir: true },
    { id: 'dfg', name: 'Subfolder', isDir: true },
  ];

  const fileActions = [
    ChonkyActions.CreateFolder,
    ChonkyActions.UploadFiles,
    ChonkyActions.DownloadFiles,
    ChonkyActions.DeleteFiles,
  ]

  return (
    <div style={{ height: 700 }}>
      <FileBrowser 
        files={files}
        folderChain={folderChain}
        fileActions={fileActions}
        defaultFileViewActionId={ChonkyActions.EnableListView.id}
      >
        <FileNavbar />
        <FileToolbar />
        <FileList />
        <FileContextMenu />
      </FileBrowser>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
