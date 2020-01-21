// Import React as usual
import React from 'react';

// Import Chonky
import 'chonky/style/main.css';
import { FileBrowser, FileView } from 'chonky';

const sizeStyle = { fontSize: '1.2rem' };

export default class FileActionsComponent extends React.Component {
  constructor(props) {
    super(props);

    const files = [];
    const extensions = [
      'ini',
      'csv',
      'license',
      'swf',
      'sh',
      'cpp',
      'ipynb',
      'php',
      'psd',
    ];
    for (let i = 0; i < 9; ++i) {
      files.push({
        id: `file-${i}`,
        name: `File ${i + 1}.${extensions[i]}`,
      });
    }

    this.state = {
      files,
      selectionSize: 0,
    };

    this.chonkyRef = React.createRef();
  }

  selectionRandomFiles = () => {
    const { files } = this.state;
    if (!this.chonkyRef.current) return;

    const selection = {};
    for (const file of files) {
      if (Math.random() > 0.3) continue;
      selection[file.id] = true;
    }

    this.chonkyRef.current.setSelection(selection);
  };

  handleSelectionChange = selection => {
    let count = 0;
    for (const id in selection) {
      if (selection[id] !== true) continue;
      count++;
    }
    this.setState({ selectionSize: count });
  };

  render() {
    const { files, selectionSize } = this.state;

    return (
      <div>
        <div style={sizeStyle}>
          <button style={sizeStyle} onClick={this.selectionRandomFiles}>
            Select random files
          </button>
          &nbsp;
          <span>Number of selected files: {selectionSize}</span>
        </div>
        <br />

        <FileBrowser
          ref={this.chonkyRef}
          files={files}
          view={FileView.SmallThumbs}
          onSelectionChange={this.handleSelectionChange}
        />
      </div>
    );
  }
}
