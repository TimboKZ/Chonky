import clsx from 'clsx';
import React from 'react';

import { useChonkyConfig } from '../base/ChonkyConfigContext';

export interface FileGridProps {
  toolbarItems?: any[];
}

export const FileGrid = React.memo(function FileGrid({}: FileGridProps) {
  const config = useChonkyConfig();

  const rootClassName = clsx({
    'chonky-filegrid-wrapper': true,
  });
  return (
    <div className={rootClassName}>
      <h3>Config:</h3>
      <pre>{JSON.stringify(config, null, 2)}</pre>
    </div>
  );
});
