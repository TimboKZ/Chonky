import type { Nilable } from './helpers.types';

export interface BaseChonkyToolbarItem {
  preset: string;
  side: 'left' | 'center' | 'right';
  order?: Nilable<number>;
}

export interface ChonkyToolbarGroup {
  label?: Nilable<string>;
}

export interface ChonkyToolbarDropdown {
  preset: 'dropdown';
  label?: Nilable<string>;
  icon?: Nilable<string>;
  iconOnly?: boolean;
  groups: string[];
}

export interface ChonkyToolbarButtons {
  preset: 'buttons';
  groups: string[];
}

export interface ChonkyToolbarLocation {
  preset: 'location';
}

export interface ChonkyToolbarSearch {
  preset: 'search';
}

export type ChonkyToolbarItem = BaseChonkyToolbarItem &
  (ChonkyToolbarDropdown | ChonkyToolbarButtons | ChonkyToolbarLocation | ChonkyToolbarSearch);
