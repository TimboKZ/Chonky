import {
    ClearSelection,
    EnableGridView,
    EnableListView,
    OpenSelection,
    SelectAllFiles,
    SortFilesByDate,
    SortFilesByName,
    SortFilesBySize,
    ToggleHiddenFiles,
    ToggleShowFoldersFirst,
} from './default';
import {
    ChangeSelection,
    EndDragNDrop,
    KeyboardClickFile,
    MouseClickFile,
    MoveFiles,
    OpenFiles,
    OpenParentFolder,
    StartDragNDrop,
} from './essential';

export const ChonkyActions = {
    MouseClickFile,
    KeyboardClickFile,
    StartDragNDrop,
    EndDragNDrop,
    MoveFiles,
    ChangeSelection,
    OpenFiles,
    OpenParentFolder,

    OpenSelection,
    SelectAllFiles,
    ClearSelection,
    EnableListView,
    EnableGridView,
    SortFilesByName,
    SortFilesBySize,
    SortFilesByDate,
    ToggleHiddenFiles,
    ToggleShowFoldersFirst,
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
