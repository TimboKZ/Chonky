export interface FileActionGroup {
    name: string;
    fileActionIds: string[];
}

export type FileActionMenuItem = string | FileActionGroup;
