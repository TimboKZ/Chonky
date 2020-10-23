import { selectParentFolder } from '../redux/selectors';
import { thunkDispatchFileAction } from '../redux/thunks/file-action-dispatchers.thunks';
import { FileActionEffect } from '../types/file-actions.types';
import { ChonkyActions } from './file-actions-definitions';
import { FileHelper } from './file-helper';
import { Logger } from './logger';

export const openParentFolderEffect: FileActionEffect = ({ dispatch, getState }) => {
    const parentFolder = selectParentFolder(getState());
    if (FileHelper.isOpenable(parentFolder)) {
        dispatch(
            thunkDispatchFileAction({
                actionId: ChonkyActions.OpenFiles.id,
                target: parentFolder,
                files: [parentFolder],
            })
        );
    } else {
        Logger.warn(
            'Open parent folder effect was triggered  even though the parent folder' +
                ' is not openable. This indicates a bug in presentation components.'
        );
    }
    return false;
};
