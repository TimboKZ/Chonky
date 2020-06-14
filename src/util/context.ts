import React from 'react';
import { Nullable } from 'tsdef';

import {
    FileAction,
    InternalFileActionDispatcher,
    FileArray,
    ThumbnailGenerator,
} from '../typedef';

export const ChonkyFilesContext = React.createContext<FileArray>([]);
export const ChonkyFolderChainContext = React.createContext<Nullable<FileArray>>(null);

export const ChonkyFileActionsContext = React.createContext<FileAction[]>([]);
export const ChonkyDispatchActionContext = React.createContext<
    InternalFileActionDispatcher
>((...args: any[]) => null);

export const ChonkyThumbnailGeneratorContext = React.createContext<
    Nullable<ThumbnailGenerator>
>(null);

type ExtractContextType<P> = P extends React.Context<infer T> ? T : never;
interface ContextData<ContextType extends React.Context<any>> {
    context: ContextType;
    value: ExtractContextType<ContextType>;
}
export const validateContextType = <T extends React.Context<any>>(
    contextData: ContextData<T>
) => contextData;
