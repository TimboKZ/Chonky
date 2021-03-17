import { ElementType, UIEvent } from 'react';
import { Nullable } from 'tsdef';

import { ChonkyActions } from '../action-definitions/index';
import { GenericFileActionHandler } from './action-handler.types';
import { FileAction } from './action.types';
import { FileArray } from './file.types';
import { I18nConfig } from './i18n.types';
import { ChonkyIconProps } from './icons.types';
import { ThumbnailGenerator } from './thumbnails.types';

/**
 * File browser methods exposed to developers via the `FileBrowser` ref.
 */
export interface FileBrowserHandle {
    /**
     * Method used to get the current file selection.
     * @returns An ES6 Set containing the IDs of the selected files.
     */
    getFileSelection(): Set<string>;

    /**
     * Method used to set the current file selection.
     * @param selection An ES6 Set containing the IDs of files that should be selected.
     * IDs of files that are not present in the `files` array will be ignored.
     * @param [reset=true] Whether to clear the current selection before applying
     * the new selection. When set to `false`, the new selection will be merged with
     * the current selection. Set to `true` by default.
     */
    setFileSelection(selection: Set<string>, reset?: boolean): void;

    /**
     * Method used to programatically trigger file actions in Chonky.
     * @param action A file action definition object
     * @param payload The payload expected by the action. If action does not expect
     * a payload, this should be set to `undefined`.
     */
    requestFileAction<Action extends FileAction>(
        action: Action,
        payload: Action['__payloadType']
    ): Promise<void>;
}

export type ChonkyActionUnion = typeof ChonkyActions[keyof typeof ChonkyActions];

/**
 * Props for the `FileBrowser` component that is exposed to library users.
 */
export interface FileBrowserProps {
    /**
     * An ID used to identify this particular Chonky instance. Useful when there are
     * multiple Chonky instances on the same page, and they need to interact with
     * each other. When no instance ID is provided, a random hash is used in its place.
     * Note that instance ID should remain static. Any changes to "instanceId" after
     * initial FileBrowser mount will be ignored.
     */
    instanceId?: string;

    /**
     * List of files that will be displayed in the main container. The provided value
     * **must** be an array, where each element is either `null` or an object that
     * satisfies the `FileData` type. If an element is `null`, a loading placeholder
     * will be displayed in its place.
     */
    files: FileArray;

    /**
     * The current folder hierarchy. This should be an array of `files`, every
     * element should either be `null` or an object of `FileData` type. The first
     * element should represent the top-level directory, and the last element
     * should be the current folder.
     */
    folderChain?: Nullable<FileArray>;

    /**
     * An array of file actions that will be available to your users at runtime.
     * These actions will be activated in addition to default actions. If you don't
     * want default file actions to be enabled, see `disableDefaultFileActions` prop.
     */
    fileActions?: Nullable<FileAction[]>;

    /**
     * An action handler that will be called every time a file action is dispatched.
     */
    onFileAction?: Nullable<GenericFileActionHandler<ChonkyActionUnion>>;

    /**
     * The function that determines the thumbnail image URL for a file. It gets a file
     * object as the input, and should return a `string` or `null`. It can also
     * return a promise that resolves into a `string` or `null`.
     */
    thumbnailGenerator?: Nullable<ThumbnailGenerator>;

    /**
     * Maximum delay between the two clicks in a double click, in milliseconds.
     */
    doubleClickDelay?: number;

    /**
     * The flag that completely disables file selection functionality. If any handlers
     * depend on file selections, their input will always have empty file selections.
     */
    disableSelection?: boolean;

    /**
     * The value that determines what default file actions will be disabled. You can
     * set this to `true` to disable all default file actions, or explicitly pass an
     * array of default file action IDs that you want to disable.
     */
    disableDefaultFileActions?: boolean | string[];

    /**
     * The flag that completely disables drag & drop functionality for this instance
     * of Chonky.
     */
    disableDragAndDrop?: boolean;

    /**
     * The flag that is used to disable `react-dnd` context provider inside of this
     * instance of Chonky, while keeping other drag & drop functionality in tact.
     * Useful when you want to provide your own `react-dnd` context.
     */
    disableDragAndDropProvider?: boolean;

    /**
     * The ID of the sort-selector-setting action to activate by default. This field can
     * be used to specify the default sort order in Chonky.
     */
    defaultSortActionId?: Nullable<string>;

    /**
     * The ID of the file-view-setting action to activate by default. This field can
     * be used to specify the default file view in Chonky.
     */
    defaultFileViewActionId?: string;

    /**
     * Determines whether the file selection should be cleared when user clicks
     * anywhere outside of Chonky. By default, selection is cleared on outside click
     * unless the click target is a button.
     */
    clearSelectionOnOutsideClick?: boolean;

    /**
     * Icon component that will be used in this instance of Chonky. Note that this
     * will only affect the current instance of Chonky. If you wanna set the icon
     * component for all Chonky instances, use the global config.
     */
    iconComponent?: ElementType<ChonkyIconProps>;

    /**
     * Enables dark mode theme.
     */
    darkMode?: boolean;

    /**
     * Configuration for the `react-intl` i18n library. Chonky provides some default
     * values, e.g. `locale` and `defaultLocale` are set to `en`. Any settings you
     * specify here will override the defaults.
     * @see https://formatjs.io/docs/react-intl/components
     */
    i18n?: I18nConfig;

    /**
     * Define listener for on scroll events on file lists
     */
    onScroll?: (e: UIEvent<HTMLDivElement>) => void;
}
