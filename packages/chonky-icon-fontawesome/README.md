# `chonky-icon-fontawesome`

This package contains the icon component for [Chonky][chonky], a file browser
component for React. Please refer to [the official documentation][docs] for
usage instructions.

## Usage

```shell
yarn add chonky@latest chonky-icon-fontawesome@latest
```

```ts
import { setChonkyDefaults } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
// Somewhere in your `index.ts`:
setChonkyDefaults({ iconComponent: ChonkyIconFA });
```

[chonky]: https://github.com/TimboKZ/Chonky
[docs]: https://chonky.io/docs/3.x/
