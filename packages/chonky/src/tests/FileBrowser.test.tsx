import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'

import { FullFileBrowser } from '../components/external/FullFileBrowser';
import { FileBrowser } from '../components/external/FileBrowser';
import { FileContextMenu } from '../components/external/FileContextMenu';
import { FileNavbar } from '../components/external/FileNavbar';
import { FileToolbar } from '../components/external/FileToolbar';
import { FileList } from '../components/file-list/FileList';

describe('FileBrowser', () => {
  const files = [
      { id: 'zxc', name: 'My File.txt' },
      { id: 'jre', name: 'My Folder' },
  ];

    const onScrollEventHandler = (e: any) => {
        e.preventDefault();
    };

  it('renders a full file browser as a single component', () => {
    const rendered = render(
      <FullFileBrowser
        files={files}
      />
    )
    expect(rendered).toMatchSnapshot()
  })

  it('renders individual file browser components', () => {
      render(
          <FileBrowser files={files}>
              <FileNavbar />
              <FileToolbar />
              <FileList onScroll={onScrollEventHandler} />
              <FileContextMenu />
          </FileBrowser>
      );
  });
})