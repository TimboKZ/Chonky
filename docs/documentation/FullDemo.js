import React from 'react';
import Promise from 'bluebird';

import 'chonky/style/main.css';
import {FileBrowser, FolderView, demoFileMap, demoRootFolderId} from 'chonky';

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
            alert(`You tried to open a ${type}: ${file.name}`);
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

        return <FileBrowser files={files} folderChain={folderChain} view={FolderView.SmallThumbs}
                            onFileOpen={this.handleFileOpen} thumbnailGenerator={this.thumbGenerator}/>;
    }

}

;<FullDemo/>;
