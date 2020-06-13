import { FileArray } from '../../lib';

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
export const validateFileArray = (
    files: FileArray | any,
    allowNull: boolean = false
): string[] => {
    const validationErrors = [];

    if (!Array.isArray(files)) {
        if (!allowNull || files !== null) {
            validationErrors.push(
                `Expected "files" to be an array, got type "${typeof files}" instead (value: ${files}).`
            );
        }
    } else {
        const seenIds = {};
        const duplicateIdSet = new Set();
        const missingIdIndices = [];
        const missingNameIndices = [];
        const invalidTypeIndices = [];

        for (let i = 0; i < files.length; ++i) {
            const file = files[i];

            const prototypeStr = Object.prototype.toString.call(file);

            if (prototypeStr === '[object Object]') {
                if (file.id && seenIds[file.id]) duplicateIdSet.add(file.id);
                else seenIds[file.id] = true;

                if (!file.name) missingNameIndices.push(i);
                if (!file.id) missingIdIndices.push(i);
            } else if (prototypeStr !== '[object Null]') {
                invalidTypeIndices.push(i);
            }
        }

        if (duplicateIdSet.size > 0) {
            validationErrors.push(
                `Some files have duplicate IDs. These IDs appeared multiple times: ${Array.from(
                    duplicateIdSet
                )}`
            );
        }
        if (missingIdIndices.length > 0) {
            validationErrors.push(
                `Some files are missing the "id" field. Relevant file indices: ${missingIdIndices.join(
                    ', '
                )}`
            );
        }
        if (missingNameIndices.length > 0) {
            validationErrors.push(
                `Some files are missing the "name" field. Relevant file indices: ${missingNameIndices.join(
                    ', '
                )}`
            );
        }
        if (invalidTypeIndices.length > 0) {
            validationErrors.push(
                `Some files have invalid type (they are neither an object nor "null"). Relevant file indices: ${invalidTypeIndices.join(
                    ', '
                )}`
            );
        }
    }

    return validationErrors;
};
