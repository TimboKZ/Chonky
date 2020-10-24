import '@testing-library/jest-dom/extend-expect';

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Nullable } from 'tsdef';

import { FileBrowser } from '../src/components/external/FileBrowser';
import { FileContextMenu } from '../src/components/external/FileContextMenu';
import { FileNavbar } from '../src/components/external/FileNavbar';
import { FileToolbar } from '../src/components/external/FileToolbar';
import { FileList } from '../src/components/file-list/FileList';
import { ChonkyActions, ChonkyFileActionData } from '../src/index';
import { sleep } from './test-util';

describe('File Action handler', () => {
    test('should get triggered on essential actions', async () => {
        let clickedFileId: Nullable<number> = null;
        const handleFileAction = (data: ChonkyFileActionData) => {
            if (data.id === ChonkyActions.MouseClickFile.id) {
                clickedFileId = data.payload.fileDisplayIndex;
            }
        };

        const files = [{ id: 'zxc', name: 'ClickMePlease.txt' }];
        render(
            <FileBrowser files={files} onFileAction={handleFileAction}>
                <FileNavbar />
                <FileToolbar />
                <FileList />
                <FileContextMenu />
            </FileBrowser>
        );
        await sleep(1000);
        const fileEntries = screen.getByRole('listitem');
        fireEvent.click(fileEntries);

        expect(clickedFileId).toEqual('zxc');
    });
});
