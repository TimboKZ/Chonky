import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useRecoilValue } from 'recoil';
import { Nullable } from 'tsdef';

import { dispatchSpecialActionState } from '../../recoil/special-actions.recoil';
import { selectFolderChain } from '../../redux/selectors';
import { FileData } from '../../types/files.types';
import { SpecialAction } from '../../types/special-actions.types';
import { FileHelper } from '../../util/file-helper';

export interface FolderChainItem {
    file: Nullable<FileData>;
    disabled: boolean;
    onClick?: () => void;
}

export const useFolderChainItems = (): FolderChainItem[] => {
    const folderChain = useSelector(selectFolderChain);
    const dispatchSpecialAction = useRecoilValue(dispatchSpecialActionState);

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
