import clsx from 'clsx';
import React, { useMemo } from 'react';

import type { Nilable } from 'chonky-engine/dist/types/helpers.types';
import type { ChonkyToolbarItem } from 'chonky-engine/dist/types/toolbar.types';

import { useChonkyConfig } from '../base/ChonkyConfigContext';
import { useStaticNanoId } from '../../utils/react';

export interface FileToolbarProps {
  toolbarId?: Nilable<string>;
  toolbarItems?: ChonkyToolbarItem[];
}

export const FileToolbar = React.memo(function FileToolbar({
  toolbarId: _toolbarId,
  toolbarItems: _toolbarItems,
}: FileToolbarProps) {
  const toolbarId = useStaticNanoId(_toolbarId);
  const toolbarItems = useMemo(() => _toolbarItems || [], [_toolbarItems]);

  const rootClassName = clsx({
    'chonky-filetoolbar-wrapper': true,
  });
  return (
    <div className={rootClassName} data-toolbarid={toolbarId}>
      <h3>toolbarItems:</h3>
      <pre>{JSON.stringify(toolbarItems, null, 2)}</pre>
    </div>
  );
});
