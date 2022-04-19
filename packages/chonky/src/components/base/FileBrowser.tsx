import clsx from 'clsx';
import React from 'react';

import Paper from '@mui/material/Paper';

import type { ChonkyConfig } from 'chonky-engine/dist/types/config.types';
import type { Nilable } from 'chonky-engine/dist/types/helpers.types';

import { ChonkyConfigProvider } from './ChonkyConfigContext';
import { useStaticNanoId } from '../../utils/react';

export interface FileBrowserProps {
  instanceId: Nilable<string>;
  config: Nilable<Partial<ChonkyConfig>>;
  children: any;
}

const rootClassName = clsx({
  'chonky-filebrowser-wrapper': true,
});
export const FileBrowser = React.memo(function FileBrowser({
  instanceId: _instanceId,
  config,
  children,
}: FileBrowserProps) {
  const instanceId = useStaticNanoId(_instanceId);
  return (
    <ChonkyConfigProvider config={config || null}>
      <Paper className={rootClassName} data-instanceid={instanceId}>
        {children}
      </Paper>
    </ChonkyConfigProvider>
  );
});
