import { NewChonkyActions } from './file-actons/definitions';
import { GenericFileActionHandler } from './file-actons/handler.types';

export type ChonkyActionUnion =
    | typeof NewChonkyActions.MouseClickFile
    | typeof NewChonkyActions.KeyboardClickFile
    | typeof NewChonkyActions.StartDragNDrop
    | typeof NewChonkyActions.EndDragNDrop
    | typeof NewChonkyActions.OpenFiles;

export const myHandler: GenericFileActionHandler<ChonkyActionUnion> = (data) => {
    if (data.id === NewChonkyActions.OpenFiles.id) {
        data.payload.files;
    } else if (data.id === NewChonkyActions.MouseClickFile.id) {
        data.payload.fileDisplayIndex;
    }
};
