import { render } from '@testing-library/react';
import React from 'react';
import { FileArray, FullFileBrowser } from '../.';
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
        render(<FullFileBrowser files={files} />);
    });
    it('renders without crashing when using individual components', () => {
        render(
            <FileBrowser files={files}>
                <FileNavbar />
                <FileToolbar />
                <FileList />
                <FileContextMenu />
            </FileBrowser>
        );
    });
});
