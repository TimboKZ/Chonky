import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FullFileBrowser } from '../.';

const App = () => {
  return (
    <div style={{ height: 400 }}>
      <FullFileBrowser />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
