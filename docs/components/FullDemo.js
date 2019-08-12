// Import React as usual
import React from 'react';

// Import Noty for nice file open notifications
import Noty from 'noty';
import 'noty/lib/noty.css';
import 'noty/lib/themes/relax.css';

// Import Chonky
import 'chonky/style/main.css';
import {FileBrowser, FileView, demoFileMap, demoRootFolderId} from 'chonky';

export default class FullDemo extends React.Component {

    constructor(props) {
        super(props);

        this.fileMap = demoFileMap;
        this.state = {currentFolderId: demoRootFolderId};
    }

    handleFileOpen = (file) => {
        if (file.isDir) {
            this.setState({currentFolderId: file.id});
        } else {
            const type = file.isDir ? 'folder' : 'file';
            const text = `You tried to open a ${type}: ${file.name}`;
            new Noty({text: text, type: 'success', theme: 'relax', timeout: 3000}).show();
        }
    };

    thumbGenerator = (file) => {
        if (!file.thumbnailUrl) return null;
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(file.thumbnailUrl);
            image.onerror = () => reject(`Failed to load thumbnail for ${file.name}.`);
            image.src = file.thumbnailUrl;
        })
            .catch((error) => console.error(error));
    };

    render() {
        const {currentFolderId} = this.state;
        const folder = this.fileMap[currentFolderId];

        const folderChain = [];
        let files = [];
        if (folder) {
            let currentFolder = folder;
            while (currentFolder) {
                folderChain.unshift(currentFolder);
                const parentId = currentFolder.parentId;
                currentFolder = parentId ? this.fileMap[parentId] : null;
            }
            if (folder.childrenIds) {
                files = folder.childrenIds.map(id => this.fileMap[id]);
            }
        }

        return <FileBrowser files={files} folderChain={folderChain} view={FileView.SmallThumbs}
                            onFileOpen={this.handleFileOpen} thumbnailGenerator={this.thumbGenerator}/>;
    }

}
