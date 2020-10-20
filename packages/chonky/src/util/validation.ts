import { useMemo } from 'react';
import { AnyObjectWithStringKeys, Nullable } from 'tsdef';

import { FileAction } from '../types/file-actions.types';
import { FileArray } from '../types/files.types';
import { ErrorMessageData } from '../types/validation.types';
import { Logger } from './logger';

export const isPlainObject = (value: any): value is object => {
    return Object.prototype.toString.call(value) === '[object Object]';
};
export const isFunction = (value: any): value is Function => {
    return !!(value && value.constructor && value.call && value.apply);
};

export const isMobileDevice = () => {
    // noinspection JSDeprecatedSymbols
    return (
        typeof window.orientation !== 'undefined' ||
        navigator.userAgent.indexOf('IEMobile') !== -1
    );
};

/**
 * This function validates the user-provided files array. It checks the following
 * criteria:
 * - `files` is not an array
 * - there are duplicate file IDs
 * - some files are missing `id` field
 * - some files are missing `name` field
 * - some files have invalid type (they are neither an object nor `null`)
 */
export const cleanupFileArray = <AllowNull extends boolean>(
    fileArray: AllowNull extends false ? FileArray : Nullable<FileArray>,
    allowNull: AllowNull
): {
    cleanFileArray: AllowNull extends false ? FileArray : Nullable<FileArray>;
    warningMessage: Nullable<string>;
    warningBullets: string[];
} => {
    let cleanFileArray: AllowNull extends false ? FileArray : Nullable<FileArray>;
    let warningMessage: Nullable<string> = null;
    const warningBullets: string[] = [];

    if (!Array.isArray(fileArray)) {
        // @ts-ignore
        cleanFileArray = allowNull ? null : [];
        if (!allowNull || fileArray !== null) {
            warningMessage =
                `Provided value was replaced ` +
                `with ${allowNull ? 'null' : 'empty array'}.`;
            warningBullets.push(
                `Expected "files" to be an array, got type ` +
                    `"${typeof fileArray}" instead (value: ${fileArray}).`
            );
        }
    } else {
        const indicesToBeRemoved = new Set<number>();

        const seenIds = new Set<string>();
        const duplicateIdSet = new Set<string>();
        const missingIdIndices: number[] = [];
        const missingNameIndices: number[] = [];
        const invalidTypeIndices: number[] = [];

        for (let i = 0; i < fileArray.length; ++i) {
            const file = fileArray[i];

            if (isPlainObject(file)) {
                if (file.id && seenIds.has(file.id)) {
                    duplicateIdSet.add(file.id);
                    indicesToBeRemoved.add(i);
                } else {
                    seenIds.add(file.id);
                }

                if (!file.name) {
                    missingNameIndices.push(i);
                    indicesToBeRemoved.add(i);
                }
                if (!file.id) {
                    missingIdIndices.push(i);
                    indicesToBeRemoved.add(i);
                }
            } else if (file !== null) {
                invalidTypeIndices.push(i);
                indicesToBeRemoved.add(i);
            }
        }

        if (duplicateIdSet.size > 0) {
            warningBullets.push(
                `Some files have duplicate IDs. These IDs appeared multiple ` +
                    `times: ${Array.from(duplicateIdSet)}`
            );
        }
        if (missingIdIndices.length > 0) {
            warningBullets.push(
                `Some files are missing the "id" field. ` +
                    `Relevant file indices: ${missingIdIndices.join(', ')}`
            );
        }
        if (missingNameIndices.length > 0) {
            warningBullets.push(
                `Some files are missing the "name" field. ` +
                    `Relevant file indices: ${missingNameIndices.join(', ')}`
            );
        }
        if (invalidTypeIndices.length > 0) {
            warningBullets.push(
                `Some files have invalid type (they are neither a plain object nor "null"). ` +
                    `Relevant file indices: ${invalidTypeIndices.join(', ')}`
            );
        }

        if (indicesToBeRemoved.size > 0) {
            // @ts-ignore
            cleanFileArray = fileArray.filter(
                (value, index) => !indicesToBeRemoved.has(index)
            );
            warningMessage =
                `${indicesToBeRemoved.size} offending ` +
                `file${indicesToBeRemoved.size === 1 ? ' was' : 's were'} ` +
                ` removed from the array.`;
        } else {
            cleanFileArray = fileArray;
        }
    }

    return { cleanFileArray, warningMessage, warningBullets };
};

export const useFileArrayValidation = (
    files: FileArray,
    folderChain: Nullable<FileArray>
): {
    cleanFiles: FileArray;
    cleanFolderChain: Nullable<FileArray>;
    errorMessages: ErrorMessageData[];
} => {
    const { cleanFiles, errorMessages: filesErrorMessages } = useMemo(() => {
        const errorMessages: ErrorMessageData[] = [];

        const cleanFilesResult = cleanupFileArray(files, false);
        if (cleanFilesResult.warningMessage) {
            const errorMessage =
                `The "files" prop passed to FileBrowser did not pass validation. ` +
                `${cleanFilesResult.warningMessage} ` +
                `The following errors were encountered:`;
            Logger.error(
                errorMessage,
                Logger.formatBullets(cleanFilesResult.warningBullets)
            );
            errorMessages.push({
                message: errorMessage,
                bullets: cleanFilesResult.warningBullets,
            });
        }

        return {
            cleanFiles: cleanFilesResult.cleanFileArray,
            errorMessages,
        };
    }, [files]);

    const {
        cleanFolderChain,
        errorMessages: folderChainErrorMessages,
    } = useMemo(() => {
        const errorMessages: ErrorMessageData[] = [];

        const cleanFolderChainResult = cleanupFileArray(folderChain, true);
        if (cleanFolderChainResult.warningMessage) {
            const errorMessage =
                `The "folderChain" prop passed to FileBrowser did not pass validation. ` +
                `${cleanFolderChainResult.warningMessage} ` +
                `The following errors were encountered:`;
            Logger.error(
                errorMessage,
                Logger.formatBullets(cleanFolderChainResult.warningBullets)
            );
            errorMessages.push({
                message: errorMessage,
                bullets: cleanFolderChainResult.warningBullets,
            });
        }

        return {
            cleanFolderChain: cleanFolderChainResult.cleanFileArray,
            errorMessages,
        };
    }, [folderChain]);

    return {
        cleanFiles,
        cleanFolderChain,
        errorMessages: [...filesErrorMessages, ...folderChainErrorMessages],
    };
};

export const useFileActionsValidation = (
    fileActions: FileAction[],
    defaultFileActions: FileAction[],
    includeDefaultFileActions: boolean
): {
    cleanFileActions: FileAction[];
    errorMessages: ErrorMessageData[];
} => {
    // === Merge user-provided and default file actions (if default actions are enabled)
    const extendedFileActions = useMemo(() => {
        if (!includeDefaultFileActions) return fileActions;

        // Add default file actions if no actions with the same IDs are present
        const seenFileActionIds: AnyObjectWithStringKeys = {};
        fileActions.map((action) => {
            if (action && action.id) seenFileActionIds[action.id] = true;
        });
        const extendedFileActions: FileAction[] = [...fileActions];
        for (const action of defaultFileActions) {
            if (seenFileActionIds[action.id]) continue;
            extendedFileActions.push(action);
        }
        return extendedFileActions;
    }, [fileActions, defaultFileActions, includeDefaultFileActions]);

    // === Validate the extended file action array
    const { cleanFileActions, errorMessages: filesErrorMessages } = useMemo(() => {
        const errorMessages: ErrorMessageData[] = [];

        const cleanFilesResult = cleanupFileActions(extendedFileActions);
        if (cleanFilesResult.warningMessage) {
            const errorMessage =
                `The "fileActions" prop passed to FileBrowser did not pass ` +
                `validation. ${cleanFilesResult.warningMessage} ` +
                `The following errors were encountered:`;
            Logger.error(
                errorMessage,
                Logger.formatBullets(cleanFilesResult.warningBullets)
            );
            errorMessages.push({
                message: errorMessage,
                bullets: cleanFilesResult.warningBullets,
            });
        }

        return {
            cleanFileActions: cleanFilesResult.cleanFileActions,
            errorMessages,
        };
    }, [extendedFileActions]);

    return {
        cleanFileActions,
        errorMessages: filesErrorMessages,
    };
};

/**
 * This function validates the user-provided file actions array. It checks the following
 * criteria:
 * - `files` is not an array
 * - there are duplicate file action IDs
 * - some file actions are missing `id` field
 * - some files have invalid type (they are not objects)
 */
export const cleanupFileActions = (
    fileActions: FileAction[]
): {
    cleanFileActions: FileAction[];
    warningMessage: Nullable<string>;
    warningBullets: string[];
} => {
    let cleanFileActions: FileAction[];
    let warningMessage: Nullable<string> = null;
    const warningBullets: string[] = [];

    if (!Array.isArray(fileActions)) {
        cleanFileActions = [];
        warningMessage = `Provided value was replaced ` + `with an empty array.`;
        warningBullets.push(
            `Expected "fileActions" to be an array, got type ` +
                `"${typeof fileActions}" instead (value: ${fileActions}).`
        );
    } else {
        const indicesToBeRemoved = new Set<number>();

        const seenIds = new Set<string>();
        const duplicateIdSet = new Set<string>();
        const missingIdIndices: number[] = [];
        const invalidTypeIndices: number[] = [];

        for (let i = 0; i < fileActions.length; ++i) {
            const fileAction = fileActions[i];

            if (isPlainObject(fileAction)) {
                if (fileAction.id && seenIds.has(fileAction.id)) {
                    duplicateIdSet.add(fileAction.id);
                    indicesToBeRemoved.add(i);
                } else {
                    seenIds.add(fileAction.id);
                }

                if (!fileAction.id) {
                    missingIdIndices.push(i);
                    indicesToBeRemoved.add(i);
                }
            } else {
                invalidTypeIndices.push(i);
                indicesToBeRemoved.add(i);
            }
        }

        if (duplicateIdSet.size > 0) {
            warningBullets.push(
                `Some file actions have duplicate IDs. These IDs appeared multiple ` +
                    `times: ${Array.from(duplicateIdSet)}`
            );
        }
        if (missingIdIndices.length > 0) {
            warningBullets.push(
                `Some file actions are missing the "id" field. ` +
                    `Relevant file indices: ${missingIdIndices.join(', ')}`
            );
        }
        if (invalidTypeIndices.length > 0) {
            warningBullets.push(
                `Some files actions have invalid type (they are not plain object). ` +
                    `Relevant file indices: ${invalidTypeIndices.join(', ')}`
            );
        }

        if (indicesToBeRemoved.size > 0) {
            // @ts-ignore
            cleanFileActions = fileActions.filter(
                (value, index) => !indicesToBeRemoved.has(index)
            );
            warningMessage =
                `${indicesToBeRemoved.size} offending ` +
                `file action${indicesToBeRemoved.size === 1 ? ' was' : 's were'} ` +
                ` removed from the array.`;
        } else {
            cleanFileActions = fileActions;
        }
    }

    return { cleanFileActions, warningMessage, warningBullets };
};
