// Import React as you normally would
import React from 'react';

// Import Chonky styles and relevant components
import 'chonky/style/main.css';
import {FileBrowser, FileView} from 'chonky';

const files = [
    {
        id: 'qwerty',
        name: 'Chonky logo.png',
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
                                            view={FileView.SmallThumbs}/>;
export default ExampleComponent;
