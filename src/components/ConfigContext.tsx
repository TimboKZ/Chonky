import React from 'react';
import { Icon, icons } from './Icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface ConfigValue { icons: typeof icons; Icon: typeof FontAwesomeIcon };

export const ConfigContext = React.createContext<ConfigValue>({ Icon, icons });