import React from 'react';
import { ChonkyConfigProvider, ChonkyErrorBoundary, FullFileBrowser } from 'chonky';
// import { ChonkyIconFA } from 'chonky-icon-fontawesome';

// setChonkyDefaults({ iconComponent: ChonkyIconFA });

export default {
  title: 'Basics/FullFileBrowser',
  component: FullFileBrowser,
};

const Template = (args) => (
  <div style={{ width: 800, height: 400 }}>
    <ChonkyErrorBoundary>
      <ChonkyConfigProvider config={{ 'Hello World': 1, test: 123123 }}>
        <FullFileBrowser {...args} />
      </ChonkyConfigProvider>
    </ChonkyErrorBoundary>
  </div>
);

export const WithFilesAndFolders = Template.bind({});
WithFilesAndFolders.args = {
  folderChain: [
    { id: 'xcv', name: 'Home', isDir: true },
    { id: 'imx', name: 'My Files', isDir: true },
  ],
  files: [
    { id: 'mwq', name: 'Terms and conditions.pdf' },
    { id: 'lht', name: 'Projects', isDir: true },
    {
      id: 'mcd',
      name: 'chonky-sphere-v3.png',
      thumbnailUrl: 'https://chonky.io/chonky-static/chonky-sphere-v3.png',
    },
  ],
};

export const Empty = Template.bind({});
Empty.args = {};

export const DarkMode = Template.bind({});
DarkMode.args = {
  darkMode: true,
  folderChain: [{ id: 'xcv', name: 'Home', isDir: true }],
  files: [
    {
      id: 'mcd',
      name: 'chonky-sphere-v3.png',
      thumbnailUrl: 'https://chonky.io/chonky-static/chonky-sphere-v3.png',
    },
  ],
};

export const DisabledDragNDrop = Template.bind({});
DisabledDragNDrop.args = {
  disableDragAndDrop: true,
  folderChain: [{ id: 'xcv', name: 'Home', isDir: true }],
  files: [
    {
      id: 'mcd',
      name: 'chonky-sphere-v3.png',
      thumbnailUrl: 'https://chonky.io/chonky-static/chonky-sphere-v3.png',
    },
  ],
};
