import { ChonkyConfig } from './types/base.types';
import { Nullable } from './types/helpers.types';

export const GlobalChonkyConfig: ChonkyConfig = {};

export function setupChonky(config: Partial<ChonkyConfig>) {}

export function mergeChonkyConfigs(
  baseConfig: Nullable<Partial<ChonkyConfig>>,
  newPartialConfig: Nullable<Partial<ChonkyConfig>>,
) {
  const mergedConfig: Partial<ChonkyConfig> = baseConfig ? { ...baseConfig } : {};
  if (newPartialConfig) {
    for (const [key, value] of Object.entries(newPartialConfig)) {
      if (value !== undefined) mergedConfig[key] = value;
    }
  }
  return mergedConfig;
}
