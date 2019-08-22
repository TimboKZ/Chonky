// Import React as usual
import React from 'react';

// Import Chonky
import 'chonky/style/main.css';
import {FileBrowser, FileView} from 'chonky';

const sizeStyle = {fontSize: '1.2rem'};

export default class FileActionsComponent extends React.Component {
    constructor(props) {
        super(props);

        const files = [];
        const extensions = ['ini', 'csv', 'license', 'swf', 'sh', 'cpp', 'ipynb', 'php', 'psd'];
        for (let i = 0; i < 9; ++i) {
            files.push({
                id: `file-${i}`,
                name: `File ${i + 1}.${extensions[i]}`,
            });
        }

        this.state = {
            files,
            mainOpenedFileName: null,
            totalOpenedFileCount: 0,
        };
    }

    handleFileOpen = (file) => {
        this.setState({mainOpenedFileName: file.name});
    };

    handleOpenFiles = (files) => {
        this.setState({totalOpenedFileCount: files.length});
    };

    render() {
        const {files, mainOpenedFileName, totalOpenedFileCount} = this.state;

        return <div>
            <div style={sizeStyle}>
                <span>Main opened file: {mainOpenedFileName ? <strong>{mainOpenedFileName}</strong> : 'None'}</span>
                <br/>
                <span>Number of opened files: <strong>{totalOpenedFileCount}</strong></span>
            </div>
            <br/>

            <FileBrowser files={files} view={FileView.SmallThumbs}
                         onFileOpen={this.handleFileOpen}
                         onOpenFiles={this.handleOpenFiles}/>
        </div>;
    }
}
