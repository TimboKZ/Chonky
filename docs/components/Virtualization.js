// Import React as usual
import React from 'react';

// Import Chonky
import 'chonky/style/main.css';
import {FileBrowser, FileView} from 'chonky';

const randomIntInRange = (min, max) => Math.round(Math.random() * (max - min) + min);

export default class VirtualizationComponent extends React.Component {
    constructor(props) {
        super(props);

        const files = [];
        const extensions = ['ini', 'csv', 'license', 'swf', 'zip', 'cpp', 'ipynb', 'php', 'psd'];
        for (let i = 0; i < 10000; ++i) {
            files.push({
                id: `file-${i}`,
                name: `File ${i + 1}.${extensions[randomIntInRange(0, extensions.length)]}`,
            });
        }

        this.state = {files};
    }

    render() {
        const {files} = this.state;

        return <div style={{height: 540}}>
            <FileBrowser files={files} view={FileView.SmallThumbs}
                         onSelectionChange={this.handleSelectionChange}
                         fillParentContainer={true}/>
        </div>;
    }
}
