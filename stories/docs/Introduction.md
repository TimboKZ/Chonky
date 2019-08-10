<p align="center">
  <img src="./Chonky_clear.png" alt="Chonky logo" style="width: 500px; background: transparent !important">
  <br/>
  <img alt="NPM package" src="https://img.shields.io/npm/v/chonky.svg">
  <img alt="NPM downloads" src="https://img.shields.io/npm/dt/chonky">
</p>

# Introduction

Chonky is a file browser component for React. It tries to recreate the native file browsing experience in your web 
browser. This means your users can make selections, drag & drop files, toggle file view between "large thumbnails" 
and "detailed list", enter folders, and so on.

## Quick demo

<!-- STORY -->

## Philosophy

Chonky tries to stay **unopinionated** when it comes to interactions with the file system (FS) or basic user input. To
be precise, Chonky doesn't make any assumptions about where the files come from. You pass a list of files to Chonky 
through component props, and as long as the description of each file matches the expected format, everything will be 
displayed correctly.

How you handle different FS operations is up to you. For example, Chonky lets you pass in an `onFileOpen` handler. 
This handler is called every time a user double clicks a file or a folder. Let's say our user decided to open folder 
**Pictures** . Usually, you'd want to fetch the contents of the **Pictures** folder from the server and update Chonky
props to display new files, but you don't have to! Instead, you could redirect the user to a new page, or start a 
download of the archive called `Pictures.zip`. You don't even have to make requests to the server - you could just 
maintain some FS abstraction in browser memory.

For similar reasons, Chonky only handles a small subset of possible user input. For example, a single click on a file
would automatically add it to the current selection, but pressing `Ctrl+A` on your keyboard (common *Select All* 
shortcut) will not do anything by default. This is done to avoid conflicts with existing shortcuts in your React 
application, and make Chonky more flexible. You can easily implement this logic yourself using the `setSelection` 
method exposed by Chonky (see [relevant example](./?path=/story/file-browser-examples--custom-keyboard-shortcuts)).

## Chonky features:

* Lets users choose between 3 views: Details, medium thumbnails, large thumbnails.
* Supports file selection and drag & drop.
* Is file system agnostic - file data can come from any source as long as it follows the required format.
* Supports callbacks for entering folders and opening, deleting or moving multiple files.
* Supports async FS logic - via lazy loading and loading placeholders.
* Supports file sorting and text search.
* Supports [windowing](https://reactjs.org/docs/optimizing-performance.html#virtualize-long-lists) (a.k.a.
virtualization) for long file lists.
* Supports common keyboard shortcuts.
* Supports file thumbnails (e.g. generated from videos or images).
* Detects common file types, showing appropriate icons.

## Notes

* It's a good idea to ask your users for confirmation before doing any FS manipulations in file operation handlers. 
For example, you could show a confirm dialog asking "Are you sure?" before moving or deleting files.

## License

MIT © [Tim Kuzhagaliyev](https://github.com/TimboKZ), 2019
