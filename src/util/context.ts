import React from 'react';
import { Nullable } from 'tsdef';

import { DefaultEntrySize } from '../components/external/FileList-virtualization';
import { FileAction, InternalFileActionDispatcher } from '../types/file-actions.types';
import { FileEntrySize } from '../types/file-list-view.types';
import { FileArray, FileSelection } from '../types/files.types';
import { InternalSpecialActionDispatcher } from '../types/special-actions.types';
import { ThumbnailGenerator } from '../types/thumbnails.types';
import { NOOP_FUNCTION } from './constants';
import { SelectionUtil } from './selection';

export const ChonkyInstanceIdContext = React.createContext<string>('no-instance-id');
export const ChonkyFilesContext = React.createContext<FileArray>([]);
export const ChonkyFolderChainContext = React.createContext<Nullable<FileArray>>(null);

// === Selection contexts
export const ChonkySelectionContext = React.createContext<FileSelection>({});
export const ChonkySelectionSizeContext = React.createContext<number>(0);
export const ChonkySelectionUtilContext = React.createContext<SelectionUtil>(
    new SelectionUtil()
);

export const ChonkyFileActionsContext = React.createContext<FileAction[]>([]);
export const ChonkyDispatchFileActionContext = React.createContext<
    InternalFileActionDispatcher
>(NOOP_FUNCTION);
export const ChonkyDispatchSpecialActionContext = React.createContext<
    InternalSpecialActionDispatcher
>(NOOP_FUNCTION);

// === Search contexts
export const ChonkySearchBarEnabledContext = React.createContext<boolean>(false);
export const ChonkySetSearchBarEnabledContext = React.createContext<
    (visible: boolean) => void
>(NOOP_FUNCTION);
export const ChonkySearchBarVisibleContext = React.createContext<boolean>(false);
export const ChonkySetSearchBarVisibleContext = React.createContext<
    (visible: boolean) => void
>(NOOP_FUNCTION);
export const ChonkySearchFilterContext = React.createContext<string>('');
export const ChonkySetSearchFilterContext = React.createContext<
    (searchFilter: string) => void
>(NOOP_FUNCTION);

export const ChonkyThumbnailGeneratorContext = React.createContext<
    Nullable<ThumbnailGenerator>
>(null);

export const ChonkyDoubleClickDelayContext = React.createContext<number>(300);

// === File List appearance & virtualization contexts
export const ChonkyFileEntrySizeContext = React.createContext<FileEntrySize>(
    DefaultEntrySize
);

// === Misc options contexts
export const ChonkyDisableSelectionContext = React.createContext<boolean>(false);
export const ChonkyEnableDragAndDropContext = React.createContext<boolean>(false);

// --- Util types and functions for validation of contexts
type ExtractContextType<P> = P extends React.Context<infer T> ? T : never;
export interface ContextData<ContextType extends React.Context<any>> {
    context: ContextType;
    value: ExtractContextType<ContextType>;
}

/**
 * This function is a no-op, but it's type verifies that the provided `ContextData`
 * value matches the type expected by the context.
 */
export const validateContextType = <T extends React.Context<any>>(
    contextData: ContextData<T>
) => contextData;
