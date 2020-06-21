import { useContext, useMemo } from 'react';
import { Undefinable } from 'tsdef';

import { FileAction } from '../../types/file-actions.types';
import { FileData } from '../../types/files.types';
import {
    ChonkyDispatchFileActionContext,
    ChonkyFilesContext,
    ChonkyFolderChainContext,
    ChonkySearchBarVisibleContext,
    ChonkySelectionContext,
    ChonkySelectionSizeContext,
} from '../../util/context';
import { ChonkyActions } from '../../util/file-actions';
import { SelectionHelper } from '../../util/selection';

export const useSmartToolbarButtonProps = (action: FileAction) => {
    const files = useContext(ChonkyFilesContext);
    const folderChain = useContext(ChonkyFolderChainContext);
    const selection = useContext(ChonkySelectionContext);
    const selectionSize = useContext(ChonkySelectionSizeContext);
    const searchBarVisible = useContext(ChonkySearchBarVisibleContext);
    const dispatchChonkyAction = useContext(ChonkyDispatchFileActionContext);

    const parentFolder =
        folderChain && folderChain.length > 1
            ? folderChain[folderChain?.length - 2]
            : null;

    const deps = [
        action,
        files,
        selection,
        selectionSize,
        dispatchChonkyAction,
        parentFolder,
    ];
    return useMemo(() => {
        let actionSelectionSize: Undefinable<number> = undefined;
        let actionFiles: Undefinable<ReadonlyArray<FileData>> = undefined;
        if (action.requiresSelection) {
            if (action.fileFilter) {
                actionSelectionSize = SelectionHelper.getSelectionSize(
                    files,
                    selection,
                    action.fileFilter
                );
                actionFiles = SelectionHelper.getSelectedFiles(
                    files,
                    selection,
                    action.fileFilter
                );
            } else {
                actionSelectionSize = selectionSize;
                actionFiles = SelectionHelper.getSelectedFiles(files, selection);
            }
        }

        const active = action.id === ChonkyActions.ToggleSearch.id && searchBarVisible;

        const disabled =
            (action.requiresSelection && actionSelectionSize === 0) ||
            (action.requiresParentFolder && !parentFolder);

        const actionTarget =
            action.requiresParentFolder && parentFolder ? parentFolder : undefined;
        const onClick = () =>
            dispatchChonkyAction({
                actionId: action.id,
                target: actionTarget,
                files: actionFiles,
            });

        return { active, onClick, disabled };
    }, deps);
};
