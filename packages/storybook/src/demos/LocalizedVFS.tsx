/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import {
    ChonkyActions,
    FileData,
    FileHelper,
    I18nConfig,
    setChonkyDefaults,
} from 'chonky';
import { IntlShape } from 'react-intl';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import React, { useCallback, useMemo, useState } from 'react';

import { VFSBrowser } from '../components/VFSBrowser';
import { useStoryLinks } from '../util';

setChonkyDefaults({ iconComponent: ChonkyIconFA });

const russianI18n: I18nConfig = {
    locale: 'ru',
    formatters: {
        formatFileModDate: (intl: IntlShape, file: FileData | null) => {
            const safeModDate = FileHelper.getModDate(file);
            if (safeModDate) {
                return `${intl.formatDate(safeModDate)}, ${intl.formatTime(
                    safeModDate
                )}`;
            } else {
                return null;
            }
        },
        formatFileSize: (intl: IntlShape, file: FileData | null) => {
            if (!file || typeof file.size !== 'number') return null;
            return `Размер: ${file.size}`;
        },
    },
    messages: {
        // Chonky UI translation strings. String IDs hardcoded into Chonky's source code.
        'chonky.toolbar.searchPlaceholder': 'Поиск',
        'chonky.toolbar.visibleFileCount': `{fileCount, plural,
            one {# файл}
            few {# файла}
            many {# файлов}
        }`,
        'chonky.toolbar.selectedFileCount': `{fileCount, plural,
            =0 {}
            one {# выделен}
            other {# выделено}
        }`,
        'chonky.toolbar.hiddenFileCount': `{fileCount, plural,
            =0 {}
            one {# скрыт}
            other {# скрыто}
        }`,
        'chonky.fileList.nothingToShow': 'Здесь пусто!',
        'chonky.contextMenu.browserMenuShortcut': 'Меню браузера: {shortcut}',

        // File action translation strings. These depend on which actions you have
        // enabled in Chonky.
        [`chonky.actionGroups.Actions`]: 'Действия',
        [`chonky.actionGroups.Options`]: 'Опции',
        [`chonky.actions.${ChonkyActions.OpenParentFolder.id}.button.name`]: 'Открыть родительскую папку',
        [`chonky.actions.${ChonkyActions.CreateFolder.id}.button.name`]: 'Новая папка',
        [`chonky.actions.${ChonkyActions.CreateFolder.id}.button.tooltip`]: 'Создать новую папку',
        [`chonky.actions.${ChonkyActions.DeleteFiles.id}.button.name`]: 'Удалить файлы',
        [`chonky.actions.${ChonkyActions.OpenSelection.id}.button.name`]: 'Открыть выделение',
        [`chonky.actions.${ChonkyActions.SelectAllFiles.id}.button.name`]: 'Выделить все',
        [`chonky.actions.${ChonkyActions.ClearSelection.id}.button.name`]: 'Сбросить выделение',
        [`chonky.actions.${ChonkyActions.EnableListView.id}.button.name`]: 'Показать список',
        [`chonky.actions.${ChonkyActions.EnableGridView.id}.button.name`]: 'Показать иконки',
        [`chonky.actions.${ChonkyActions.SortFilesByName.id}.button.name`]: 'Сорт. по имени',
        [`chonky.actions.${ChonkyActions.SortFilesBySize.id}.button.name`]: 'Сорт. по размеру',
        [`chonky.actions.${ChonkyActions.SortFilesByDate.id}.button.name`]: 'Сорт. по дате',
        [`chonky.actions.${ChonkyActions.ToggleHiddenFiles.id}.button.name`]: 'Скрытые файлы',
        [`chonky.actions.${ChonkyActions.ToggleShowFoldersFirst.id}.button.name`]: 'Папки в начале',
    },
};

const storyName = 'Localized VFS';
export const Localization: React.FC = () => {
    const [locale, setLocale] = useState('ru');
    const handleLocaleChange = useCallback(
        (event) => setLocale(event.target.value),
        []
    );
    const i18n = useMemo(() => (locale === 'ru' ? russianI18n : {}), [locale]);

    return (
        <div className="story-wrapper">
            <div className="story-description">
                <h1 className="story-title">
                    {storyName.replace('VFS', 'Virtual File System')}
                </h1>
                <p>
                    This example is the same as <em>Advanced mutable VFS</em>, except it
                    lets you toggle between English and Russian UI (which are the only
                    languages I speak)!
                </p>
                <p>
                    Note that I defined custom date and file size{' '}
                    <code>formatters</code> in this example, just to show how this is
                    done. For most languages, default formatters should just work, so
                    you don't need to specify custom format functions.
                </p>
                <div className="story-links">
                    {useStoryLinks([
                        { gitPath: '2.x_storybook/src/demos/LocalizedVFS.tsx' },
                        {
                            name: 'VFSBrowser component source code',
                            gitPath: '2.x_storybook/src/components/VFSBrowser.tsx',
                        },
                        {
                            name: 'File map JSON',
                            gitPath: '2.x_storybook/src/demos/demo.fs_map.json',
                        },
                    ])}
                </div>
            </div>

            <FormControl component="fieldset" style={{ marginBottom: 15 }}>
                <FormLabel component="legend">Pick a language:</FormLabel>
                <RadioGroup
                    aria-label="locale"
                    name="locale"
                    value={locale}
                    onChange={handleLocaleChange}
                >
                    <FormControlLabel value="ru" control={<Radio />} label="Русский" />
                    <FormControlLabel value="en" control={<Radio />} label="English" />
                </RadioGroup>
            </FormControl>

            <br />

            <VFSBrowser
                i18n={i18n}
                instanceId={storyName}
                defaultFileViewActionId={ChonkyActions.EnableListView.id}
            />
        </div>
    );
};
(Localization as any).storyName = storyName;
