import React from 'react';
import * as ReactDOM from 'react-dom';
import { FullFileBrowser, FileArray } from '../.';
import { FileBrowser } from '../src/components/external/FileBrowser';
import { FileContextMenu } from '../src/components/external/FileContextMenu';
import { FileNavbar } from '../src/components/external/FileNavbar';
import { FileToolbar } from '../src/components/external/FileToolbar';
import { FileList } from '../src/components/file-list/FileList';

describe('FileBrowser', () => {
  const files: FileArray = [
    { id: 'zxc', name: 'My File.txt' },
    { id: 'jre', name: 'My Folder' },
  ];

  it('renders without crashing when using FullFileBrowser', () => {
    const div = document.createElement('div');
    ReactDOM.render(<FullFileBrowser files={files} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
  it('renders without crashing when using individual components', () => {
    const div = document.createElement('div');
    ReactDOM.render(

        <FileBrowser files={files}>
          <FileNavbar />
          <FileToolbar />
          <FileList />
          <FileContextMenu />
        </FileBrowser>
    , div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
