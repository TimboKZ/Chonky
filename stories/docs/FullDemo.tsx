import React from 'react';
import Promise from 'bluebird';
import {Undefinable, Nullable} from 'tsdef';

import '../../style/main.css';
import {FileData} from '../../src/typedef';
import {FileBrowser, FolderView} from '../../src';
import {getMainDemoFsData} from '../util/StoriesUtil';

export default class FullDemo extends React.Component<any, any> {

    fileMap: { [id: string]: FileData };

    constructor(props: any) {
        super(props);

        const {fileMap, rootFolderId} = getMainDemoFsData();
        this.fileMap = fileMap;
        this.state = {currentFolderId: rootFolderId};
    }

    handleFileOpen = (file: FileData) => {
        if (file.isDir) {
            this.setState({currentFolderId: file.id});
        } else {
            const type = file.isDir ? 'folder' : 'file';
            alert(`You tried to open a ${type}: ${file.base}`);
        }
    };

    thumbGenerator = (file: any) => {
        if (!file.thumbnailUrl) return null;
        return new Promise((resolve: any, reject: any) => {
            const image = new Image();
            image.onload = () => resolve(file.thumbnailUrl);
            image.onerror = (error: any) => reject(error);
            image.src = file.thumbnailUrl;
        })
            .catch((error: any) => console.error(`Failed to load thumbnail: ${error}`));
    };

    render() {
        const {currentFolderId} = this.state;
        const folder = this.fileMap[currentFolderId];

        const folderChain = [];
        let files: Nullable<FileData>[] = [];
        if (folder) {
            let currentFolder: Nullable<FileData> = folder;
            while (currentFolder) {
                folderChain.unshift(currentFolder);
                const parentId: Undefinable<string> = currentFolder.parentId;
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
