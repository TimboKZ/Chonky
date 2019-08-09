// Import React as you normally would
import React from 'react';

// Import Chonky styles and relevant components
import '../../style/main.css';
import {FileBrowser, FolderView} from '../../src';

const files = [
    {
        id: 'qwerty',
        name: 'Random image.jpg',
        isDir: false,

        // This is a custom property, Chonky will just ignore it.
        thumbnailUrl: 'https://timbokz.github.io/Chonky/Chonky_clear.png',
    },
];

const thumbnailGenerator = (file) => {
    return file.thumbnailUrl;
};

const ExampleComponent = () => <FileBrowser files={files}
                                            thumbnailGenerator={thumbnailGenerator}
                                            view={FolderView.SmallThumbs}/>;
export default ExampleComponent;
