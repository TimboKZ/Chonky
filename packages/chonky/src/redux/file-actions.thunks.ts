import { ToolbarDropdownProps } from '../components/external/ToolbarDropdown';
import { FileAction } from '../types/file-actions.types';
import { SortOrder } from '../types/sort.types';
import { ChonkyActions, DefaultFileActions } from '../util/file-actions-definitions';
import { sanitizeInputArray } from './files-transforms';
import { reduxActions } from './reducers';
import {
    AppThunk,
    thunkSortFiles,
    thunkUpdateDisplayFiles,
    thunkUpdateHiddenFiles,
} from './thunks';

export const thunkUpdateRawFileActions = (
    rawFileActions: FileAction[] | any,
    disableDefaultFileActions: boolean
): AppThunk => (dispatch) => {
    const { sanitizedArray, errorMessages } = sanitizeInputArray(
        'fileActions',
        rawFileActions
    );

    let defaultActionsToAdd: FileAction[] = [];
    if (!disableDefaultFileActions) {
        const seenActionIds = new Set<string>();
        sanitizedArray.map((a) => seenActionIds.add(a.id));
        defaultActionsToAdd = DefaultFileActions.filter(
            (a) => !seenActionIds.has(a.id)
        );
    }

    const fileActions = [...sanitizedArray, ...defaultActionsToAdd];
    const optionDefaults = {};
    fileActions.map((a) =>
        a.option ? (optionDefaults[a.option.id] = a.option.defaultValue) : null
    );

    dispatch(reduxActions.setRawFileActions(rawFileActions));
    dispatch(reduxActions.setFileActionsErrorMessages(errorMessages));
    dispatch(reduxActions.setFileActions(fileActions));
    dispatch(reduxActions.setOptionDefaults(optionDefaults));
    dispatch(thunkUpdateToolbarItems(fileActions));
    dispatch(thunkSortFiles());
    dispatch(thunkUpdateHiddenFiles());
    dispatch(thunkUpdateDisplayFiles());
};

export const thunkUpdateToolbarItems = (fileActions: FileAction[]): AppThunk => (
    dispatch
) => {
    const excludedActionIds = new Set<string>([
        // TODO: Move decision to exclude actions somewhere else, as users' custom
        //  components might not give these actions special treatment like Chonky
        //  does.
        ChonkyActions.OpenParentFolder.id,
    ]);

    const toolbarItems: (FileAction | ToolbarDropdownProps)[] = [];
    const seenGroups: { [groupName: string]: ToolbarDropdownProps } = {};
    for (const action of fileActions) {
        if (!action.toolbarButton || excludedActionIds.has(action.id)) continue;
        if (action.toolbarButton.group && action.toolbarButton.dropdown) {
            let group: ToolbarDropdownProps = seenGroups[action.toolbarButton.group];
            if (!group) {
                group = {
                    name: action.toolbarButton.group,
                    fileActionIds: [],
                };
                toolbarItems.push(group);
                seenGroups[action.toolbarButton.group] = group;
            }
            group.fileActionIds.push(action.id);
        } else {
            toolbarItems.push(action);
        }
    }

    dispatch(reduxActions.setToolbarItems(toolbarItems));
};

export const thunkActivateSortAction = (fileActionId: string): AppThunk => (
    dispatch,
    getState
) => {
    const { sortActionId: oldActionId, sortOrder: oldOrder } = getState();

    let order = oldOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
    if (oldActionId !== fileActionId) {
        order = SortOrder.ASC;
    }

    dispatch(reduxActions.setSort({ actionId: fileActionId, order: order }));
    dispatch(thunkSortFiles());
    dispatch(thunkUpdateDisplayFiles());
};

export const thunkToggleOption = (optionId: string): AppThunk => (dispatch) => {
    dispatch(reduxActions.toggleOption(optionId));
    if (optionId === ChonkyActions.ToggleShowFoldersFirst.option.id) {
        dispatch(thunkSortFiles());
        dispatch(thunkUpdateDisplayFiles());
    } else if (optionId === ChonkyActions.ToggleHiddenFiles.option.id) {
        dispatch(thunkUpdateHiddenFiles());
        dispatch(thunkUpdateDisplayFiles());
    }
};
