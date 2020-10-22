import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useRecoilValue } from 'recoil';

import { dispatchFileActionState } from '../recoil/file-actions.recoil';
import { selectFileMap, selectSelectedFileIds } from '../redux/selectors';
import { ChonkyActions } from './file-actions-definitions';
import { useInstanceVariable } from './hooks-helpers';

export const useSelection = () => {
    const dispatchFileAction = useRecoilValue(dispatchFileActionState);

    const fileMapRef = useInstanceVariable(useSelector(selectFileMap));
    const selectedFileIds = useSelector(selectSelectedFileIds);

    // Dispatch an action every time selection changes.
    const lastSelectionSizeForAction = useRef(0);
    useEffect(() => {
        const selectedFiles = selectedFileIds.map((id) => fileMapRef.current[id]);

        // We want to solve two problems here - first, we don't want to dispatch a
        // selection action when Chonky is first initialized. We also don't want to
        // dispatch an action if the current selection and the previous selection
        // are empty (this can happen because Recoil can sometimes trigger updates
        // even if object reference did not change).
        if (
            lastSelectionSizeForAction.current === selectedFiles.length &&
            selectedFiles.length === 0
        ) {
            return;
        }
        lastSelectionSizeForAction.current = selectedFiles.length;

        dispatchFileAction({
            actionId: ChonkyActions.ChangeSelection.id,
            files: selectedFiles,
        });
    }, [dispatchFileAction, fileMapRef, selectedFileIds]);
};
