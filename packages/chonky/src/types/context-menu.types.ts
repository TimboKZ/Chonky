import { Nullable } from 'tsdef';

export interface ContextMenuConfig {
  triggerFileId: Nullable<string>;
  mouseX: number;
  mouseY: number;
}
