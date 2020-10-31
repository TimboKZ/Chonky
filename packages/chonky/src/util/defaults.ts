import { ElementType } from 'react';

import { ChonkyIconPlaceholder } from '../components/internal/ChonkyIconPlaceholder';
import { ChonkyIconProps } from '../types/icons.types';

export interface ChonkyConfig {
    iconComponent: ElementType<ChonkyIconProps>;
}

export const defaultConfig: ChonkyConfig = {
    iconComponent: ChonkyIconPlaceholder,
};

export const setChonkyDefaults = (config: Partial<ChonkyConfig>) => {
    for (const key of Object.keys(config)) {
        defaultConfig[key] = config[key];
    }
};
