import { FileAction } from './actions.types';

export interface ToolbarItemGroup {
    name: string;
    fileActionIds: string[];
}

export type ToolbarItemArray = (FileAction | ToolbarItemGroup)[];
