import React, { useContext, useMemo } from 'react';

import { ChonkyConfig } from 'chonky-engine/dist/types/base.types';
import { GlobalChonkyConfig, mergeChonkyConfigs } from 'chonky-engine/dist/config';
import { Nullable } from 'chonky-engine/dist/types/helpers.types';

export const ChonkyConfigContext = React.createContext<Nullable<ChonkyConfig>>(null);

export interface ChonkyConfigProviderProps {
  config: Nullable<ChonkyConfig>;
}

export const ChonkyConfigProvider = React.memo<ChonkyConfigProviderProps>(function ChonkyConfigProvider({
  config = null,
}) {
  config;
  return null;
});

export function useMergedChonkyConfig(
  baseConfig: Nullable<Partial<ChonkyConfig>>,
  newPartialConfig: Nullable<Partial<ChonkyConfig>>,
) {
  return useMemo(() => mergeChonkyConfigs(baseConfig, newPartialConfig), [baseConfig, newPartialConfig]);
}

export function useChonkyConfig() {
  const contextConfig = useContext(ChonkyConfigContext);
  return useMemo<ChonkyConfig>(() => {
    if (contextConfig) return contextConfig as ChonkyConfig;
    const readOnlyConfigCopy = { ...GlobalChonkyConfig };
    Object.freeze(readOnlyConfigCopy);
    return readOnlyConfigCopy;
  }, [contextConfig]);
}
