import { mount } from 'enzyme';
import React from 'react';

import { FileBrowser } from '../src/components/external/FileBrowser';
import { FileContextMenu } from '../src/components/external/FileContextMenu';
import { FileNavbar } from '../src/components/external/FileNavbar';
import { FileToolbar } from '../src/components/external/FileToolbar';
import { FileList } from '../src/components/file-list/FileList';

describe('Empty File Browser', () => {
    test('should mount without errors', () => {
        mount(
            <FileBrowser files={[]}>
                <FileNavbar />
                <FileToolbar />
                <FileList />
                <FileContextMenu />
            </FileBrowser>
        );
    });
});
