import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { Nullable } from 'tsdef';

import { folderChainState } from '../../recoil/files.recoil';
import { dispatchSpecialActionState } from '../../recoil/special-actions.recoil';
import { FileData } from '../../types/files.types';
import { SpecialAction } from '../../types/special-actions.types';
import { FileHelper } from '../../util/file-helper';

export interface FolderChainItem {
    file: Nullable<FileData>;
    disabled: boolean;
    onClick?: () => void;
}

export const useFolderChainItems = (): FolderChainItem[] => {
    const folderChain = useRecoilValue(folderChainState);
    const dispatchSpecialAction = useRecoilValue(dispatchSpecialActionState);

    const folderChainItems = useMemo(() => {
        const items: FolderChainItem[] = [];
        if (!folderChain) return items;

        for (const file of folderChain) {
            items.push({
                file,
                disabled: !file,
                onClick: !FileHelper.isOpenable(file)
                    ? undefined
                    : () => {
                          dispatchSpecialAction({
                              actionId: SpecialAction.OpenFolderChainFolder,
                              file,
                          });
                      },
            });
        }
        return items;
    }, [folderChain, dispatchSpecialAction]);
    return folderChainItems;
};
