/**
 * Copied from MIT-licensed https://github.com/joonhocho/tsdef v0.0.14.
 * Copyright (c) 2019 Joon Ho Cho
 */

export type nil = null | undefined;

export type Nilable<T> = T | nil;
export type Nullable<T> = T | null;
export type Undefinable<T> = T | undefined;

export type MaybeNil<T> = T | nil;
export type MaybeNull<T> = T | null;
export type MaybeUndefined<T> = T | undefined;
export type MaybePromise<T> = T | Promise<T>;
export type MaybeArray<T> = T | T[];
export type MaybeAsReturnType<T> = T | ((...args: any) => T);

// removes both null or undefined from T
export type NonNil<T> = T extends nil ? never : T;

// removes null from T
export type NonNull<T> = T extends null ? never : T;

// removes undefined from T
export type NonUndefined<T> = T extends undefined ? never : T;

// return Then if T is not null nor undefined, otherwise return False
// test null and undefined separately to prevent side effect from args distribution
export type IsNonNil<T, True, False = never> = null extends T ? False : undefined extends T ? False : True;

// return Then if T can be null or undefined, otherwise return False
export type IsNilable<T, True, False = never> = null extends T ? True : undefined extends T ? True : False;

// return True if T is not null, otherwise return False
export type IsNonNull<T, True, False = never> = null extends T ? False : True;

// return True if T is nullable, otherwise return False
export type IsNullable<T, True, False = never> = null extends T ? True : False;

// return True if T is not undefined, otherwise return False
export type IsNonUndefined<T, True, False = never> = undefined extends T ? False : True;

// return True if T is undefinedable, otherwise return False
export type IsUndefinedable<T, True, False = never> = undefined extends T ? True : False;

// return True if T is `never`, otherwise return False
// wrap with array to prevent args distributing
export type IsNever<T, True, False = never> = [T] extends [never] ? True : False;

// return True if T is `any`, otherwise return False
export type IsAny<T, True, False = never> = True | False extends (T extends never ? True : False) ? True : False;

// return True if T is `unknown`, otherwise return False
export type IsUnknown<T, True, False = never> = unknown extends T ? IsAny<T, False, True> : False;

// make all properties nilable
export type NilableProps<T> = { [P in keyof T]?: T[P] | nil };

// make all properties nullable
export type NullableProps<T> = { [P in keyof T]: T[P] | null };

// make all properties undefinable
export type UndefinableProps<T> = { [P in keyof T]?: T[P] | undefined };

// make all properties non nilable
export type NonNilProps<T> = { [P in keyof T]-?: NonNil<T[P]> };

// make all properties non null
export type NonNullProps<T> = { [P in keyof T]: NonNull<T[P]> };

// make all properties non undefined
export type NonUndefinedProps<T> = { [P in keyof T]-?: NonUndefined<T[P]> };

// make all properties required
export type RequiredProps<T> = { [P in keyof T]-?: T[P] };

// keys of properties with values that can be undefined
export type UndefinedableKeys<T> = Exclude<{ [K in keyof T]: IsUndefinedable<T[K], K> }[keyof T], undefined>;

// keys of properties with values that can be undefined
export type NullableKeys<T> = Exclude<{ [K in keyof T]: IsNullable<T[K], K> }[keyof T], undefined>;

// keys of properties with values that can be undefined
export type NilableKeys<T> = Exclude<{ [K in keyof T]: IsNilable<T[K], K> }[keyof T], undefined>;

// make all nilable properties to optional nilable: nil? -> nil?
export type NilableToNilableProps<T> = Omit<{ [P in keyof T]: T[P] }, NilableKeys<T>> &
  Pick<{ [P in keyof T]?: T[P] | nil }, NilableKeys<T>>;

// make all nilable properties to non-optional nullable: nil? -> null-?
export type NilableToNullableProps<T> = Omit<{ [P in keyof T]: T[P] }, NilableKeys<T>> &
  Pick<{ [P in keyof T]: NonUndefined<T[P]> | null }, NilableKeys<T>>;

// make all nilable properties to optional undefindeable: nil? -> undefined?
export type NilableToOptionalProps<T> = Omit<{ [P in keyof T]: T[P] }, NilableKeys<T>> &
  Pick<{ [P in keyof T]?: NonNull<T[P]> | undefined }, NilableKeys<T>>;

// make all properties non readonly
export type WritableProps<T> = { -readonly [P in keyof T]: T[P] };

// string | number | symbol
export type AnyKey = keyof any;

// matches any functions
export type AnyFunction = (...args: any) => any;

// matches any constructors
export type AnyConstructor = new (...args: any) => any;

// matches classes
export interface AnyClass {
  prototype: any;
  new (...args: any): any;
}

// matches prototypes
export interface AnyPrototype {
  constructor: any;
}

// matches any objects
export interface AnyObject {
  [key: string]: any;
  [key: number]: any;
}

// matches objects with string keys
export interface AnyObjectWithStringKeys {
  [key: string]: any;
}

// matches objects with number keys
export interface AnyObjectWithNumberKeys {
  [key: number]: any;
}

// without some keys
export type ExcludeKeys<T, K extends AnyKey> = Omit<T, K>;

// values of object
export type ValueOf<T> = T[keyof T];

// get a property
export type Property<T, K> = K extends keyof T ? T[K] : never;

// get keys with values of given type
export type KeyOfType<T, U> = {
  [P in keyof T]-?: T[P] extends U ? P : never;
}[keyof T];

// get keys with values of given sub type
// For some reason, this works and KeyOfType doesn't when U = undefined
export type KeyOfSubType<T, U> = {
  [P in keyof T]-?: U extends T[P] ? P : never;
}[keyof T];

// make some keys optional
export type WithOptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// make some keys nilable
export type WithNilableKeys<T, K extends keyof T> = Omit<T, K> & NilableProps<Pick<T, K>>;

// make some keys nullable
export type WithNullableKeys<T, K extends keyof T> = Omit<T, K> & NullableProps<Pick<T, K>>;

// make some keys undefinable
export type WithUndefinableKeys<T, K extends keyof T> = Omit<T, K> & UndefinableProps<Pick<T, K>>;

// make some keys non nil
export type WithNonNilKeys<T, K extends keyof T> = Omit<T, K> & NonNilProps<Pick<T, K>>;

// make some keys non null
export type WithNonNullKeys<T, K extends keyof T> = Omit<T, K> & NonNullProps<Pick<T, K>>;

// make some keys non undefined
export type WithNonUndefinedKeys<T, K extends keyof T> = Omit<T, K> & NonUndefinedProps<Pick<T, K>>;

// make all properties optional recursively including nested objects.
// keep in mind that this should be used on json / plain objects only.
// otherwise, it will make class methods optional as well.
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer I> ? Array<DeepPartial<I>> : DeepPartial<T[P]>;
};

// first object properties excluding common keys with second object
export type DiffObjects<T, U> = Omit<T, keyof U>;

// union of two objects
export type UnionObjects<T extends AnyObject, U extends AnyObject> = DiffObjects<T, U> & {
  [P in keyof T & keyof U]: T[P] | U[P];
} & DiffObjects<U, T>;

// similar to Object.assign
export type OverwriteProps<T, U> = U & DiffObjects<T, U>;

// get arguments type
export type Arguments<T extends AnyFunction> = Parameters<T>;

// get arguments type
export type FirstArgument<T extends AnyFunction> = T extends (arg: infer A, ...args: any) => any ? A : never;

// get return value type
export type Return<T extends AnyFunction> = ReturnType<T>;

// get return type if a function, otherwise return itself
export type MaybeReturnType<T> = T extends (...args: any[]) => infer R ? R : T;

// get instance type of class
export type InstanceOf<T extends AnyConstructor> = InstanceType<T>;

// get promise return type
// PromisedType<Promise<T>> = T
export type PromisedType<T extends Promise<any>> = T extends Promise<infer R> ? R : never;

// get promise return type if promise, otherwise return itself
// MaybePromisedType<T | Promise<T>> = T
export type MaybePromisedType<T> = T extends Promise<infer R> ? R : T;

// get promise return type
export type MaybeAsyncReturnType<T extends AnyFunction> = MaybePromisedType<ReturnType<T>>;

// get array item type
export type ItemType<T extends any[]> = T extends Array<infer I> ? I : never;

// get thunk for type
export type Thunk<T> = () => T;

// get thunk or self
export type MaybeThunk<T> = T | Thunk<T>;

// get return type of thunk
export type Unthunk<T extends Thunk<any>> = T extends Thunk<infer R> ? R : never;

// get return type if thunk, otherwise get self
export type MaybeUnthunk<T> = T extends Thunk<infer R> ? R : T;

// get inferred type of array item or return value or promised value
export type Unpack<T> = T extends Array<infer I>
  ? I
  : T extends (...args: any) => infer R
  ? R
  : T extends Promise<infer P>
  ? P
  : T;

// InheritClass<C1, C2>: class C1 extends C2 {}
export type InheritClass<C1 extends AnyClass, C2 extends AnyClass> = {
  prototype: OverwriteProps<C2['prototype'], C1['prototype']>;
  new (...args: ConstructorParameters<AnyClass>): OverwriteProps<C2['prototype'], C1['prototype']>;
} & OverwriteProps<C2, C1>;

// return True if T strictly includes U, otherwise return False
export type StrictlyIncludes<T, U, True, False = never> = Exclude<U, T> extends never
  ? IsAny<T, 1, 0> extends 1
    ? True
    : IsAny<U, 1, 0> extends 1
    ? False
    : IsUnknown<T, 1, 0> extends 1
    ? IsUnknown<U, True, False>
    : True
  : False;

// tests and returns True if they are equal, False otherwise.
// wrap with array and do both ways to prevent args distrubition
export type AreStrictlyEqual<T, U, True, False = never> = StrictlyIncludes<T, U, 1, 0> extends 1
  ? StrictlyIncludes<U, T, True, False>
  : False;

// tests and returns True if both objects have same keys, False otherwise.
export type HaveSameKeys<T, U, True, False = never> =
  | Exclude<keyof T, keyof U>
  | Exclude<keyof U, keyof T> extends never
  ? True
  : False;

// https://github.com/Microsoft/TypeScript/issues/26051
export type Exact<T, X extends T> = T & { [K in keyof X]: K extends keyof T ? X[K] : never };
// U extends Exact<{ [K in keyof T]-?: (v: T[K]) => any }, U>
