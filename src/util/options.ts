import { useEffect, useMemo } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { fileActionsState } from '../recoil/file-actions.recoil';
import { optionMapState, optionState } from '../recoil/options.recoil';
import { FileArray } from '../types/files.types';
import { OptionMap } from '../types/options.types';
import { ChonkyActions } from './file-actions-definitions';

export const useOptions = (files: FileArray) => {
    const fileActions = useRecoilValue(fileActionsState);
    const setOptionMap = useSetRecoilState(optionMapState);
    useEffect(() => {
        const optionMap: OptionMap = {};
        for (const action of fileActions) {
            if (!action.option) continue;
            optionMap[action.option.id] = action.option.defaultValue;
        }
        setOptionMap(optionMap);
    }, [fileActions, setOptionMap]);

    const showHiddenFileState = useRecoilValue(
        optionState(ChonkyActions.ToggleHiddenFiles.option.id)
    );
    return useMemo(() => {
        if (showHiddenFileState !== false) return files;
        return files.filter((file) => !file || !file.isHidden);
    }, [files, showHiddenFileState]);
};
