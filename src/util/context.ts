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
import { NOOP_FUNCTION } from './constants';
import { SelectionUtil } from './selection';

export const ChonkyFilesContext = React.createContext<FileArray>([]);
export const ChonkyFolderChainContext = React.createContext<Nullable<FileArray>>(null);
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

export const ChonkySearchFilterContext = React.createContext<string>('');
export const ChonkySetSearchFilterContext = React.createContext<
    (searchFilter: string) => void
>(NOOP_FUNCTION);

export const ChonkyThumbnailGeneratorContext = React.createContext<
    Nullable<ThumbnailGenerator>
>(null);

export const ChonkyDoubleClickDelayContext = React.createContext<number>(300);

export const ChonkyDisableSelectionContext = React.createContext<boolean>(false);
export const ChonkyEnableDragAndDropContext = React.createContext<boolean>(false);

type ExtractContextType<P> = P extends React.Context<infer T> ? T : never;
interface ContextData<ContextType extends React.Context<any>> {
    context: ContextType;
    value: ExtractContextType<ContextType>;
}
export const validateContextType = <T extends React.Context<any>>(
    contextData: ContextData<T>
) => contextData;
