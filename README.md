<p align="center">
  <img src="https://timbokz.github.io/Chonky/Chonky_clear.png" alt="Chonky logo">
  <br/>
  <a href="https://www.npmjs.com/package/chonky">
    <img alt="NPM package" src="https://img.shields.io/npm/v/chonky.svg">
  </a>
  <a href="https://tldrlegal.com/license/mit-license">
    <img alt="MIT license" src="https://img.shields.io/npm/l/chonky">
  </a>
  <a href="https://www.npmjs.com/package/chonky">
    <img alt="NPM downloads" src="https://img.shields.io/npm/dt/chonky">
  </a>
  <a href="https://github.com/TimboKZ/Chonky">
    <img alt="GitHub stars" src="https://img.shields.io/github/stars/TimboKZ/Chonky">
  </a>
  <a href="https://discord.gg/4HJaFn9">
    <img alt="Chat on Discord" src="https://img.shields.io/discord/696033621986770957?label=Chat%20on%20Discord" />
  </a>
</p>

# Introduction

> Chonky is constantly changing. Please [create an issue](https://github.com/TimboKZ/Chonky/issues)
> if you have a problem or want to request a feature.

Chonky is a file browser component for React. It tries to recreate the native file browsing experience in your browser.
This means your users can make selections, drag & drop files, toggle file view between "large thumbnails" and "detailed
list", use keyboard shortcuts, and much more!

### [Click here for documentation and examples.](https://timbokz.github.io/Chonky/)

<br />

## Features

-   [x] Backend-agnostic - files can come from any source (remote server, S3, virtual FS).
-   [x] Supports file sorting.
-   [x] Supports text search.
-   [x] Supports drag & drop.
-   [x] Mobile-friendly design.
-   [x] Supports image thumbnails.
-   [x] Supports keyboard shortcuts.
-   [x] Supports common and custom file actions.
-   [x] Provides unique icons for each file extension.
-   [ ] **(WIP)** Supports _detailed list_ and _thumbnails_ views.
-   [x] Supports file selections (excluding drag selection, _for now_).
-   [x] Supports loading animations and async thumbnail generation.
-   [x] Performs well with large file collections thanks to
        [virtualization](https://github.com/bvaughn/react-virtualized).

## Quick usage

Add Chonky to your project:

```shell
npm install chonky
```

Use it in your React app:

```tsx
import 'chonky/style/main.css';
import { FileBrowser, FileList, FileSearch, FileToolbar } from 'chonky';

export const ChonkyDemo = () => {
    const folderChain = React.useMemo(
        () => [
            { id: 'xXre', name: 'My Documents' },
            { id: 'BtrE', name: 'Websites' },
        ],
        []
    );

    const files = React.useMemo(
        () => [
            { id: '1eBr', name: 'index.html' },
            { id: 'xmFe', name: 'styles.css' },
            { id: 'vEgS', name: 'scripts.js' },
            { id: 'BVwA', name: 'favicon.ico' },
            { id: 'VsdE', name: 'robots.txt' },
        ],
        []
    );

    return (
        <FileBrowser files={files} folderChain={folderChain}>
            <FileToolbar />
            <FileSearch />
            <FileList />
        </FileBrowser>
    );
};
```

## Preview

<p align="center">
  <img src="https://timbokz.github.io/Chonky/1.x/Chonky_preview.gif" alt="Chonky preview">
</p>

## License

MIT © [Tim Kuzhagaliyev](https://github.com/TimboKZ) 2020
