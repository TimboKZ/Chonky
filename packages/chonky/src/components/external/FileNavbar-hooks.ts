import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Nullable } from 'tsdef';

import { selectFolderChain } from '../../redux/selectors';
import { thunkDispatchFileAction } from '../../redux/thunks/file-action-dispatchers.thunks';
import { FileData } from '../../types/files.types';
import { ChonkyActions } from '../../util/file-actions-definitions';
import { FileHelper } from '../../util/file-helper';

export interface FolderChainItem {
    file: Nullable<FileData>;
    disabled: boolean;
    onClick?: () => void;
}

export const useFolderChainItems = (): FolderChainItem[] => {
    const folderChain = useSelector(selectFolderChain);
    const dispatch = useDispatch();

    const folderChainItems = useMemo(() => {
        const items: FolderChainItem[] = [];
        if (!folderChain) return items;

        for (let i = 0; i < folderChain.length; ++i) {
            const file = folderChain[i];
            items.push({
                file,
                disabled: !file,
                onClick:
                    !FileHelper.isOpenable(file) || i === folderChain.length - 1
                        ? undefined
                        : () =>
                              dispatch(
                                  thunkDispatchFileAction({
                                      actionId: ChonkyActions.OpenFiles.id,
                                      target: file,
                                      files: [file],
                                  })
                              ),
            });
        }
        return items;
    }, [dispatch, folderChain]);
    return folderChainItems;
};
