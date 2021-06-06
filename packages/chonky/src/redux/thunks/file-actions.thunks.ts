import { Nilable } from 'tsdef';

import { ChonkyActions, DefaultFileActions, EssentialFileActions } from '../../action-definitions/index';
import { FileActionGroup, FileActionMenuItem } from '../../types/action-menus.types';
import { FileAction } from '../../types/action.types';
import { ChonkyThunk } from '../../types/redux.types';
import { SortOrder } from '../../types/sort.types';
import { sanitizeInputArray } from '../files-transforms';
import { reduxActions } from '../reducers';
import { selectCleanFileIds, selectFileMap, selectHiddenFileIdMap, selectSelectionMap } from '../selectors';

/**
 * Merges multiple file action arrays into one while removing duplicates
 */
const mergeFileActionsArrays = (...fileActionArrays: FileAction[][]): FileAction[] => {
    const seenActionIds = new Set<string>();
    const addToSeen = (a: FileAction) => !!seenActionIds.add(a.id);
    const wasNotSeen = (a: FileAction) => !seenActionIds.has(a.id);

    const duplicateFreeArrays = fileActionArrays.map(arr => {
        const duplicateFreeArray = arr.filter(wasNotSeen);
        duplicateFreeArray.map(addToSeen);
        return duplicateFreeArray;
    });
    return new Array<FileAction>().concat(...duplicateFreeArrays);
};

export const thunkUpdateRawFileActions = (
    rawFileActions: FileAction[] | any,
    disableDefaultFileActions: Nilable<boolean | string[]>
): ChonkyThunk => dispatch => {
    const { sanitizedArray, errorMessages } = sanitizeInputArray('fileActions', rawFileActions);

    // Add default actions unless user disabled them
    let defaultActionsToAdd: FileAction[];
    if (Array.isArray(disableDefaultFileActions)) {
        const disabledActionIds = new Set(disableDefaultFileActions);
        defaultActionsToAdd = DefaultFileActions.filter(action => !disabledActionIds.has(action.id));
    } else if (disableDefaultFileActions) {
        defaultActionsToAdd = [];
    } else {
        defaultActionsToAdd = DefaultFileActions;
    }

    const fileActions = mergeFileActionsArrays(sanitizedArray, EssentialFileActions, defaultActionsToAdd);
    const optionDefaults: any = {};
    fileActions.map(a => (a.option ? (optionDefaults[a.option.id] = a.option.defaultValue) : null));

    dispatch(reduxActions.setRawFileActions(rawFileActions));
    dispatch(reduxActions.setFileActionsErrorMessages(errorMessages));
    dispatch(reduxActions.setFileActions(fileActions));
    dispatch(reduxActions.setOptionDefaults(optionDefaults));
    dispatch(thunkUpdateToolbarNContextMenuItems(fileActions));
};

export const thunkUpdateToolbarNContextMenuItems = (fileActions: FileAction[]): ChonkyThunk => dispatch => {
    const excludedToolbarFileActionIds = new Set<string>([
        // TODO: Move decision to exclude actions somewhere else, as users' custom
        //  components might not give these actions special treatment like Chonky does.
        ChonkyActions.OpenParentFolder.id,
    ]);

    type SeenGroupMap = { [groupName: string]: FileActionGroup };

    const toolbarItems: FileActionMenuItem[] = [];
    const seenToolbarGroups: SeenGroupMap = {};

    const contextMenuItems: FileActionMenuItem[] = [];
    const seenContextMenuGroups: SeenGroupMap = {};

    const getGroup = (itemArray: FileActionMenuItem[], seenMap: SeenGroupMap, groupName: string): FileActionGroup => {
        if (seenMap[groupName]) return seenMap[groupName];
        const group: FileActionGroup = { name: groupName, fileActionIds: [] };
        itemArray.push(group);
        seenMap[groupName] = group;
        return group;
    };

    for (const action of fileActions) {
        const button = action.button;
        if (!button) continue;

        if (button.toolbar && !excludedToolbarFileActionIds.has(action.id)) {
            if (button.group) {
                const group = getGroup(toolbarItems, seenToolbarGroups, button.group);
                group.fileActionIds.push(action.id);
            } else {
                toolbarItems.push(action.id);
            }
        }

        if (button.contextMenu) {
            if (button.group) {
                const group = getGroup(contextMenuItems, seenContextMenuGroups, button.group);
                group.fileActionIds.push(action.id);
            } else {
                contextMenuItems.push(action.id);
            }
        }
    }

    dispatch(reduxActions.updateFileActionMenuItems([toolbarItems, contextMenuItems]));
};

export const thunkUpdateDefaultFileViewActionId = (fileActionId: Nilable<string>): ChonkyThunk => (
    dispatch,
    getState
) => {
    const { fileActionMap } = getState();
    const action = fileActionId ? fileActionMap[fileActionId] : null;
    if (action && action.fileViewConfig) {
        dispatch(reduxActions.setFileViewConfig(action.fileViewConfig));
    }
};

export const thunkActivateSortAction = (fileActionId: Nilable<string>): ChonkyThunk => (dispatch, getState) => {
    if (!fileActionId) return;

    const { sortActionId: oldActionId, sortOrder: oldOrder, fileActionMap } = getState();
    const action = fileActionMap[fileActionId];
    if (!action || !action.sortKeySelector) return;

    let order = oldOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
    if (oldActionId !== fileActionId) {
        order = SortOrder.ASC;
    }

    dispatch(reduxActions.setSort({ actionId: fileActionId, order: order }));
};

export const thunkApplySelectionTransform = (action: FileAction): ChonkyThunk => (dispatch, getState) => {
    const selectionTransform = action.selectionTransform;
    if (!selectionTransform) return;

    const state = getState();
    const prevSelection = new Set<string>(Object.keys(selectSelectionMap(state)));
    const hiddenFileIds = new Set<string>(Object.keys(selectHiddenFileIdMap(state)));

    const newSelection = selectionTransform({
        prevSelection,
        fileIds: selectCleanFileIds(state),
        fileMap: selectFileMap(state),
        hiddenFileIds,
    });
    if (!newSelection) return;

    if (newSelection.size === 0) {
        dispatch(reduxActions.clearSelection());
    } else {
        dispatch(reduxActions.selectFiles({ fileIds: Array.from(newSelection), reset: true }));
    }
};
