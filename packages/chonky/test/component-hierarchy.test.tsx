import { render } from '@testing-library/react';
import React from 'react';

import { FileBrowser } from '../src/components/external/FileBrowser';
import { FileContextMenu } from '../src/components/external/FileContextMenu';
import { FileNavbar } from '../src/components/external/FileNavbar';
import { FileToolbar } from '../src/components/external/FileToolbar';
import { FileList } from '../src/components/file-list/FileList';
import { FileArray } from '../src/types/file.types';
import { sleep } from './test-util';

describe('File Browser will all components', () => {
    test('should mount without errors', async () => {
        const files: FileArray = [
            { id: 'zxc', name: 'My File.txt' },
            { id: 'jre', name: 'My Folder' },
        ];
        const { container } = render(
            <FileBrowser files={files}>
                <FileNavbar />
                <FileToolbar />
                <FileList />
                <FileContextMenu />
            </FileBrowser>
        );
        await sleep(1000);
        expect(container).toMatchSnapshot();
    });
});
