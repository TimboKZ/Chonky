import React from 'react';

import { NOOP_FUNCTION } from './constants';

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
