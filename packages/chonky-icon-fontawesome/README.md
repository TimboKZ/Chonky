# `chonky-icon-fontawesome`

This package contains the icon component for [Chonky][chonky], a file browser component
for React. Please refer to [the official documentation][docs] for usage instructions.

## Usage

```shell
npm install chonky@latest chonky-icon-fontawesome@latest
```

```ts
import { setChonkyDefaults } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
// Somewhere in your `index.ts`:
setChonkyDefaults({ iconComponent: ChonkyIconFA });
```

[chonky]: https://chonky.io/
[docs]: https://chonky.io/docs/2.x/installation-usage
