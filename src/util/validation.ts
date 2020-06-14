import { Nullable } from 'tsdef';
import { useMemo } from 'react';

import { FileArray } from '../../lib';
import { Logger } from './logger';
import { FileBrowser } from 'chonky';

export const isPlainObject = (value: any): value is object => {
    return Object.prototype.toString.call(value) === '[object Object]';
};
export const isFunction = (value: any): value is Function => {
    return !!(value && value.constructor && value.call && value.apply);
};

export const isMobileDevice = () => {
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
export const useCleanFileArray = <AllowNull extends boolean>(
    fileArray: AllowNull extends false ? FileArray : Nullable<FileArray>,
    allowNull: AllowNull
): {
    cleanFileArray: AllowNull extends false ? FileArray : Nullable<FileArray>;
    warningMessage: Nullable<string>;
    warningBullets: string[];
} => {
    let cleanFileArray: AllowNull extends false ? FileArray : Nullable<FileArray>;
    let warningMessage = null;
    const warningBullets = [];

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

        const seenIds = {};
        const duplicateIdSet = new Set<string>();
        const missingIdIndices = [];
        const missingNameIndices = [];
        const invalidTypeIndices = [];

        for (let i = 0; i < fileArray.length; ++i) {
            const file = fileArray[i];

            if (isPlainObject(file)) {
                if (file.id && seenIds[file.id]) {
                    duplicateIdSet.add(file.id);
                    indicesToBeRemoved.add(i);
                } else {
                    seenIds[file.id] = true;
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

export interface ErrorMessageData {
    message: string;
    bullets: string[];
}

export const useFileBrowserValidation = (
    files: FileArray,
    folderChain: Nullable<FileArray>
): {
    cleanFiles: FileArray;
    cleanFolderChain: Nullable<FileArray>;
    errorMessages: ErrorMessageData[];
} => {
    const filesDeps = [files];
    const { cleanFiles, errorMessages: filesErrorMessages } = useMemo(() => {
        const errorMessages: ErrorMessageData[] = [];

        const cleanFilesResult = useCleanFileArray(files, false);
        if (cleanFilesResult.warningMessage) {
            const errorMessage =
                `The "files" prop passed to ${FileBrowser.name} did not pass validation. ` +
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
    }, filesDeps);

    const folderChainDeps = [folderChain];
    const { cleanFolderChain, errorMessages: folderChainErrorMessages } = useMemo(
        () => {
            const errorMessages: ErrorMessageData[] = [];

            const cleanFolderChainResult = useCleanFileArray(folderChain, true);
            if (cleanFolderChainResult.warningMessage) {
                const errorMessage =
                    `The "folderChain" prop passed to ${FileBrowser.name} did not pass validation. ` +
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
        },
        folderChainDeps
    );

    return {
        cleanFiles,
        cleanFolderChain,
        errorMessages: [...filesErrorMessages, ...folderChainErrorMessages],
    };
};
