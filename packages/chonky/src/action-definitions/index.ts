import { DefaultActions } from './default';
import { EssentialActions } from './essential';
import { ExtraActions } from './other';

export const ChonkyActions = {
    ...EssentialActions,
    ...DefaultActions,
    ...ExtraActions,
};

export const EssentialFileActions = [
    ChonkyActions.MouseClickFile,
    ChonkyActions.KeyboardClickFile,
    ChonkyActions.StartDragNDrop,
    ChonkyActions.EndDragNDrop,
    ChonkyActions.MoveFiles,
    ChonkyActions.ChangeSelection,
    ChonkyActions.OpenFiles,
    ChonkyActions.OpenParentFolder,
    ChonkyActions.OpenFileContextMenu,
];

export const DefaultFileActions = [
    ChonkyActions.OpenSelection,
    ChonkyActions.SelectAllFiles,
    ChonkyActions.ClearSelection,
    ChonkyActions.EnableListView,
    ChonkyActions.EnableGridView,
    ChonkyActions.SortFilesByName,
    ChonkyActions.SortFilesBySize,
    ChonkyActions.SortFilesByDate,
    ChonkyActions.ToggleHiddenFiles,
    ChonkyActions.ToggleShowFoldersFirst,
];
