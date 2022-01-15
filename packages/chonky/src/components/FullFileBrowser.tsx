import React, { useContext } from 'react';
import type { FileBrowserProps } from 'chonky-engine/dist/types/base.types';

import { ChonkyConfigContext } from './ChonkyConfigContext';

export const FullFileBrowser = function FullFileBrowser(props: FileBrowserProps) {
  const config = useContext(ChonkyConfigContext);
  return (
    <div>
      <h3>Props:</h3>
      <pre>{JSON.stringify(props, null, 4)}</pre>
      <h3>Config:</h3>
      <pre>{JSON.stringify(config, null, 4)}</pre>
    </div>
  );
};
