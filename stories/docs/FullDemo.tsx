import React from 'react';
import Promise from 'bluebird';
import {Undefinable, Nullable} from 'tsdef';

import '../../style/main.css';
import {FileData} from '../../src/typedef';
import {FileBrowser, FolderView} from '../../src';
import {getMainDemoFsData} from '../util/StoriesUtil';
import {isArray, isNil, isObject} from '../../src/Util';

export default class FullDemo extends React.Component<any, any> {

    private readonly fileMap: { [id: string]: FileData };

    public constructor(props: any) {
        super(props);

        const {fileMap, rootFolderId} = getMainDemoFsData();
        this.fileMap = fileMap;
        this.state = {currentFolderId: rootFolderId};
    }

    private handleFileOpen = (file: FileData) => {
        if (file.isDir) {
            this.setState({currentFolderId: file.id});
        } else {
            const type = file.isDir ? 'folder' : 'file';
            alert(`You tried to open a ${type}: ${file.name}`);
        }
    };

    private thumbGenerator = (file: any) => {
        if (isNil(file.thumbnailUrl)) return null;
        return new Promise((resolve: any, reject: any) => {
            const image = new Image();
            image.onload = () => resolve(file.thumbnailUrl);
            image.onerror = (error: any) => reject(error);
            image.src = file.thumbnailUrl;
        })
            .catch((error: any) => console.error(`Failed to load thumbnail: ${error}`));
    };

    public render() {
        const {currentFolderId} = this.state;
        const folder = this.fileMap[currentFolderId];

        const folderChain = [];
        let files: Nullable<FileData>[] = [];
        if (isObject(folder)) {
            let currentFolder: Nullable<FileData> = folder;
            while (isObject(currentFolder)) {
                folderChain.unshift(currentFolder);
                const parentId: Undefinable<string> = currentFolder.parentId;
                currentFolder = !isNil(parentId) ? this.fileMap[parentId] : null;
            }
            if (isArray(folder.childrenIds)) {
                files = folder.childrenIds.map(id => this.fileMap[id]);
            }
        }

        return <FileBrowser files={files} folderChain={folderChain} view={FolderView.SmallThumbs}
                            onFileOpen={this.handleFileOpen} thumbnailGenerator={this.thumbGenerator}/>;
    }

}
