// Import React as usual
import React from 'react';

// Import Chonky
import 'chonky/style/main.css';
import { FileBrowser, FileView } from 'chonky';

export default class FileActionsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      singleClickCount: 0,
      doubleClickCount: 0,
    };
  }

  handleSingleClick = (file, event) => {
    this.setState(prevState => ({
      singleClickCount: prevState.singleClickCount + 1,
    }));

    // Return `true` to cancel default behaviour
    return true;
  };

  handleDoubleClick = (file, event) => {
    this.setState(prevState => ({
      doubleClickCount: prevState.doubleClickCount + 1,
    }));

    // Return `true` to cancel default behaviour
    return true;
  };

  render() {
    const { singleClickCount, doubleClickCount } = this.state;
    const file = {
      id: 'qwerty123456',
      name: `Single: ${singleClickCount} | Double: ${doubleClickCount}`,
    };

    return (
      <FileBrowser
        files={[file]}
        onFileSingleClick={this.handleSingleClick}
        onFileDoubleClick={this.handleDoubleClick}
        view={FileView.SmallThumbs}
      />
    );
  }
}
