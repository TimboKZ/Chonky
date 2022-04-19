import React, { useContext, useMemo } from 'react';

import { ChonkyConfig } from 'chonky-engine/dist/types/config.types';
import { getGlobalChonkyConfig, mergeChonkyConfigs } from 'chonky-engine/dist/config';
import { Nullable } from 'chonky-engine/dist/types/helpers.types';

export const ChonkyConfigContext = React.createContext<Nullable<ChonkyConfig>>(null);

export interface ChonkyConfigProviderProps {
  config: Nullable<Partial<ChonkyConfig>>;
  children: any;
}

export const ChonkyConfigProvider = React.memo<ChonkyConfigProviderProps>(function ChonkyConfigProvider({
  config = null,
  children,
}) {
  const configFromParentContext = useContext(ChonkyConfigContext);
  const mergedConfig = useMergedChonkyConfig(configFromParentContext, config);
  return <ChonkyConfigContext.Provider value={mergedConfig as ChonkyConfig}>{children}</ChonkyConfigContext.Provider>;
});

export function useMergedChonkyConfig(
  baseConfig: Nullable<Partial<ChonkyConfig>>,
  newPartialConfig: Nullable<Partial<ChonkyConfig>>,
) {
  return useMemo(() => mergeChonkyConfigs(baseConfig, newPartialConfig), [baseConfig, newPartialConfig]);
}

/**
 * To be used by user code that just wants the final view of the config.
 */
export function useChonkyConfig(): ChonkyConfig {
  const contextConfig = useContext(ChonkyConfigContext);
  return useMemo<ChonkyConfig>(() => {
    let readOnlyConfigCopy;
    if (contextConfig) readOnlyConfigCopy = {...contextConfig} as ChonkyConfig;
    else  readOnlyConfigCopy = { ...getGlobalChonkyConfig() };
    Object.freeze(readOnlyConfigCopy);
    return readOnlyConfigCopy;
  }, [contextConfig]);
}
