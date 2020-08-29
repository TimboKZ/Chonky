import React from 'react';
import { Nullable } from 'tsdef';

import { FileData } from '../../types/files.types';
import { DnDProps } from './DnDFileEntry';

export interface FileEntryProps extends DnDProps {
    file: Nullable<FileData>;
    displayIndex: number; // Index at which this file appears in the file list
    selected: boolean;
    focused?: boolean;
    isGridView: boolean;
    style?: React.CSSProperties;
}
