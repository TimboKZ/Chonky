---
title: Installation & usage
sidebar_position: 2
---


# Installation & usage

## Installation

You need to install `chonky` and its default icon component, `chonky-icon-fontawesome`:

```bash
# Using yarn:
yarn add chonky@latest chonky-icon-fontawesome@latest

# Or using npm:
npm install chonky@latest chonky-icon-fontawesome@latest
```

The icon component is packaged separately to decrease the bundle size. You can always
replace it with a custom icon component later.

Note that `@latest` tag is not strictly required, but it's useful to include. It makes
sure you get the most recent bug fixes when you re-install Chonky in an existing
project.

## Basic usage

As the first step, you should tell Chonky which icon component it should use. This is
done using the `setChonkyDefaults` helper method:

```ts
import { setChonkyDefaults } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';

// Somewhere in your `index.ts`:
setChonkyDefaults({ iconComponent: ChonkyIconFA });
```

Then you can use Chonky anywhere in your application:

```tsx
import { FullFileBrowser } from 'chonky';

export const MyFileBrowser = () => {
    const files = [
        { id: 'lht', name: 'Projects', isDir: true },
        {
            id: 'mcd',
            name: 'chonky-sphere-v2.png',
            thumbnailUrl: 'https://chonky.io/chonky-sphere-v2.png',
        },
    ];
    const folderChain = [{ id: 'xcv', name: 'Demo', isDir: true }];

    return (
        <div style={{ height: 300 }}>
            <FullFileBrowser files={files} folderChain={folderChain} />
        </div>
    );
};
```

Example below shows a minimal setup of Chonky. Note that the file browser will fill the
height of its parent container, which in this case is `300px`.


```jsx live
    () => {
        const files = [
            { id: 'lht', name: 'Projects', isDir: true },
            {
                id: 'mcd',
                name: 'chonky-sphere-v2.png',
                thumbnailUrl: '/img/chonky-sphere-v2.png',
            },
        ];
        const folderChain = [{ id: 'xcv', name: 'Demo', isDir: true }];
        return (
            <div style={{ height: 300 }}>
                <FullFileBrowser files={files} folderChain={folderChain} />
            </div>
        );
    }
```

## Usage with Typescript

Chonky was built using Typescript. For your static typing needs, many of the internal
types and generic interfaces are exported.

If you're also using Typescript, you can add Chonky types to your project using
standard ES6 imports:

```ts
// FileArray is a TS type
import { FileArray } from 'chonky';

const myFiles: FileArray = [{ id: 'abD3', name: 'README.txt' }, null];
```

You can see the list of exported types in Chonky's [entrypoint `index.ts` on
GitHub](https://github.com/TimboKZ/Chonky/blob/2.x/packages/chonky/src/index.ts)
(files named `*.types` contain the types). If you need access to types that are not
exported, either [create an issue](https://github.com/TimboKZ/Chonky/issues) or import
them using the full file path:

```ts
import { MouseFileClickPayload } from 'chonky/lib/types/action-payloads.types';

const myPayload: MouseFileClickPayload = {
    /* ... */
};
```

While this is not required, I strongly recommend you use the [`tsdef` library][tsdef] in
your Typescript code. It provides many useful generic types and interfaces to make your
TS code cleaner:

```ts
// Install
npm install -D tsdef

// Use
import {AnyFunction, Nullable} from 'tsdef';

const myFunctionOrNull = Nullable<AnyFunction>;
```

[tsdef]: https://github.com/joonhocho/tsdef