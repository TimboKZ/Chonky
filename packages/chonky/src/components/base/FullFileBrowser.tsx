import React, { useMemo } from 'react';

import { ChonkyIconName } from 'chonky-engine/dist/types/icons.types';
import type { ChonkyToolbarItem } from 'chonky-engine/dist/types/toolbar.types';

import { FileGrid } from '../files/FileGrid';
import { FileToolbar } from '../toolbar/FileToolbar';
import { FileBrowser, FileBrowserProps } from './FileBrowser';

export const FullFileBrowser = function FullFileBrowser(props: FileBrowserProps) {
  const toolbarTop1Items = useMemo<ChonkyToolbarItem[]>(
    () => [
      {
        preset: 'buttons',
        side: 'left',
        groups: ['open-parent'],
      },
      {
        preset: 'location',
        side: 'left',
      },
      {
        preset: 'buttons',
        side: 'right',
        groups: ['chonky-warnings'],
      },
    ],
    [],
  );
  const toolbarTop2Items = useMemo<ChonkyToolbarItem[]>(
    () => [
      {
        preset: 'search',
        side: 'left',
      },
      {
        preset: 'dropdown',
        side: 'right',
        label: 'Options',
        icon: ChonkyIconName.cog,
        groups: ['radio-options', 'toggle-options'],
      },
    ],
    [],
  );

  return (
    <FileBrowser {...props}>
      <FileToolbar toolbarId="top-1" toolbarItems={toolbarTop1Items} />
      <FileToolbar toolbarId="top-2" toolbarItems={toolbarTop2Items} />
      <FileGrid />
      <FileToolbar toolbarId="bottom" />
    </FileBrowser>
  );
};
