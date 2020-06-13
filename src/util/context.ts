import React from 'react';
import { Nullable } from 'tsdef';

import { FileArray } from '../typedef';

export const ChonkyFilesContext = React.createContext<Nullable<FileArray>>(null);
export const ChonkyFolderChainContext = React.createContext<Nullable<FileArray>>(null);
