import { ChonkyConfig, ChonkyComponentDef } from './types/config.types';
import { Nullable } from './types/helpers.types';

export const DefaultChonkyConfig: ChonkyConfig = {
  components: {},
};

export let _GlobalChonkyConfig: ChonkyConfig = { ...DefaultChonkyConfig };

export function setupChonky(config: Partial<ChonkyConfig>) {
  _GlobalChonkyConfig = mergeChonkyConfigs(_GlobalChonkyConfig, config) as ChonkyConfig;
}

export function getGlobalChonkyConfig() {
  return _GlobalChonkyConfig
}

export const DefaultShallowMergeFields = ['components'];

/**
 * Helper method to merge Chonky configs. It should be used in all places where
 * configs are merged to ensure merging logic is consistent everywhere.
 *
 * @param baseConfig
 * @param newPartialConfig
 * @param shallowMergeFields Object fields that will be merged instead of being
 * overwrite. If this is `null`, default value will be used.
 * @returns Merged config.
 */
export function mergeChonkyConfigs(
  baseConfig: Nullable<Partial<ChonkyConfig>>,
  newPartialConfig: Nullable<Partial<ChonkyConfig>>,
  shallowMergeFields: Nullable<string[]> = null,
) {
  const shallowMergeSet = new Set(shallowMergeFields || DefaultShallowMergeFields);
  const mergedConfig: Partial<ChonkyConfig> = baseConfig ? { ...baseConfig } : {};
  if (newPartialConfig) {
    for (const [key, value] of Object.entries(newPartialConfig)) {
      if (value !== undefined) {
        if (shallowMergeSet.has(key)) {
          mergedConfig[key] = { ...mergedConfig[key], ...value };
        } else {
          mergedConfig[key] = value;
        }
      }
    }
  }
  return mergedConfig;
}

export function getComponentFromConfig(config: ChonkyConfig, componentName: string): Nullable<ChonkyComponentDef> {
    if (!config || !config.components) return null;
    return config.components[componentName] || null;
}