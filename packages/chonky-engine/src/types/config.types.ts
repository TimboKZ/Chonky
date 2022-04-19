import { AnyObject, Nilable, Nullable } from './helpers.types';

export interface ChonkyComponentDef {
  component: Nullable<any>; // TODO: Ideally this should be a react type.
  defaultProps?: Nilable<AnyObject>;
}

export interface ChonkyConfig {
  components: {
    [componentName: string]: ChonkyComponentDef;
  };
}
