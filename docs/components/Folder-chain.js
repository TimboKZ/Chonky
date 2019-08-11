import React from 'react';

import '../../style/main.css';
import {FileBrowser} from '../../index';

const folderChain = [
    {
        id: 'folder-1',
        name: 'Folder 1',
        isDir: true,
    },
    {
        id: 'folder-2',
        name: 'Folder 2',
        isDir: true,
    },
    null,
    {
        id: 'folder-3',
        name: 'Folder 3',
        isDir: true,
        openable: false,
    },
    {
        id: 'folder-4',
        name: 'Folder 4',
        isDir: true,
    },
];

export default class ExampleComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {infoFile: null};
    }

    handleFileOpen = (file) => {
        this.setState({
            infoFile: {
                id: 'info-file',
                name: `You opened "${file.name}"`,
                isDir: false,
                openable: false,
            },
        });
    };

    render() {
        const {infoFile} = this.state;
        const files = [];
        if (infoFile) files.push(infoFile);

        return <FileBrowser files={files} folderChain={folderChain}
                            onFileOpen={this.handleFileOpen}/>;
    }
}
