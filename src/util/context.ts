import React from 'react';
import { Nullable } from 'tsdef';

import {
    FileAction,
    FileArray,
    FileSelection,
    InternalFileActionDispatcher,
    InternalSpecialActionDispatcher,
    ThumbnailGenerator,
} from '../typedef';

export const ChonkyFilesContext = React.createContext<FileArray>([]);
export const ChonkyFolderChainContext = React.createContext<Nullable<FileArray>>(null);
export const ChonkySelectionContext = React.createContext<FileSelection>({});

export const ChonkyFileActionsContext = React.createContext<FileAction[]>([]);
export const ChonkyDispatchFileActionContext = React.createContext<
    InternalFileActionDispatcher
>((...args: any[]) => null);
export const ChonkyDispatchSpecialActionContext = React.createContext<
    InternalSpecialActionDispatcher
>((...args: any[]) => null);

export const ChonkyThumbnailGeneratorContext = React.createContext<
    Nullable<ThumbnailGenerator>
>(null);

export const ChonkyDisableDragNDropContext = React.createContext<boolean>(false);

type ExtractContextType<P> = P extends React.Context<infer T> ? T : never;
interface ContextData<ContextType extends React.Context<any>> {
    context: ContextType;
    value: ExtractContextType<ContextType>;
}
export const validateContextType = <T extends React.Context<any>>(
    contextData: ContextData<T>
) => contextData;
