import filesize from 'filesize';
import { createContext, useContext, useMemo } from 'react';
import { IntlShape, useIntl } from 'react-intl';
import { Nullable, Undefinable } from 'tsdef';

import { FileAction } from '../types/action.types';
import { FileData } from '../types/file.types';
import { ChonkyFormatters } from '../types/i18n.types';
import { FileHelper } from './file-helper';

export enum I18nNamespace {
    Toolbar = 'toolbar',
    FileList = 'fileList',
    FileEntry = 'fileEntry',
    FileContextMenu = 'contextMenu',

    FileActions = 'actions',
    FileActionGroups = 'actionGroups',
}

export const getI18nId = (namespace: I18nNamespace, stringId: string): string =>
    `chonky.${namespace}.${stringId}`;

export const getActionI18nId = (actionId: string, stringId: string): string =>
    `chonky.${I18nNamespace.FileActions}.${actionId}.${stringId}`;

export const useLocalizedFileActionGroup = (groupName: string) => {
    const intl = useIntl();
    return useMemo(() => {
        return intl.formatMessage({
            id: getI18nId(I18nNamespace.FileActionGroups, groupName),
            defaultMessage: groupName,
        });
    }, [groupName, intl]);
};

export const useLocalizedFileActionStrings = (action: Nullable<FileAction>) => {
    const intl = useIntl();
    return useMemo(() => {
        if (!action) {
            return {
                buttonName: '',
                buttonTooltip: undefined,
            };
        }

        const buttonName = intl.formatMessage({
            id: getActionI18nId(action.id, 'button.name'),
            defaultMessage: action.button?.name,
        });

        let buttonTooltip: Undefinable<string> = undefined;
        if (action.button?.tooltip) {
            // We only translate the tooltip if the original action has a tooltip.
            buttonTooltip = intl.formatMessage({
                id: getActionI18nId(action.id, 'button.tooltip'),
                defaultMessage: action.button?.tooltip,
            });
        }

        return {
            buttonName,
            buttonTooltip,
        };
    }, [action, intl]);
};

export const useLocalizedFileEntryStrings = (file: Nullable<FileData>) => {
    const intl = useIntl();
    const formatters = useContext(ChonkyFormattersContext);
    return useMemo(() => {
        return {
            fileModDateString: formatters.formatFileModDate(intl, file),
            fileSizeString: formatters.formatFileSize(intl, file),
        };
    }, [file, formatters, intl]);
};

export const defaultFormatters: ChonkyFormatters = {
    formatFileModDate: (
        intl: IntlShape,
        file: Nullable<FileData>
    ): Nullable<string> => {
        const safeModDate = FileHelper.getModDate(file);
        if (safeModDate) {
            return intl.formatDate(safeModDate, {
                dateStyle: 'medium',
                timeStyle: 'short',
            });
        } else {
            return null;
        }
    },
    formatFileSize: (intl: IntlShape, file: Nullable<FileData>): Nullable<string> => {
        if (!file || typeof file.size !== 'number') return null;

        const size = file.size;
        const sizeData = filesize(size, { bits: false, output: 'object' }) as any;
        if (sizeData.symbol === 'B') {
            return `${Math.round(sizeData.value / 10) / 100.0} KB`;
        } else if (sizeData.symbol === 'KB') {
            return `${Math.round(sizeData.value)} ${sizeData.symbol}`;
        }
        return `${sizeData.value} ${sizeData.symbol}`;
    },
};

export const ChonkyFormattersContext = createContext(defaultFormatters);
