// We allow `FileAction` to be `string` to let our users specify custom actions.
// `ChonkyAction` enum holds the list of actions supported out of the box.
export type FileAction = ChonkyAction | string;
export enum ChonkyAction {
    Open = 'open',
    CreateFolder = 'open',
    Upload = 'open',
    Download = 'open',

    Move = 'move',

    Copy = 'copy',
    Cut = 'cut',
    Paste = 'paste',
}
