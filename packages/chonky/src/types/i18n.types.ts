import { IntlConfig, IntlShape } from 'react-intl';
import { Nullable } from 'tsdef';

import { FileData } from './file.types';

export interface I18nConfig extends Partial<IntlConfig> {
  formatters?: Partial<ChonkyFormatters>;
}

export interface ChonkyFormatters {
  formatFileModDate: (intl: IntlShape, file: Nullable<FileData>) => Nullable<string>;
  formatFileSize: (intl: IntlShape, file: Nullable<FileData>) => Nullable<string>;
}
