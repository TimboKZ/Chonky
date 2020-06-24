Chonky includes several major components - `FileBrowser`, `FileList`, `FileToolbar`,
and some others.

`FileBrowser` is the most important component. In your code, it should wrap
all other Chonky components:

```tsx
<FileBrowser files={[]}>
    <FileToolbar />
    <FileSearch />
    <FileList />
</FileBrowser>
```

This is because `FileBrowser` is responsible for providing the configuration and
relevant React contexts to all the children Chonky components. It also the component
that you will be passing all of your props too.

`FileBrowser` is also the only required component - all others, such as `FileList`,
are optional. For example, if you're only interested in displaying files, but don't
need to the toolbar, you could use the following hierarchy:

```tsx
<FileBrowser files={[]}>
    <FileList />
</FileBrowser>
```

Or, if you're a power user, and you want to use a custom implementation of the file
list by consuming Chonky's [Recoil atoms](https://recoiljs.org/) directly, you could
use something like:

```tsx
<FileBrowser files={[]}>
    <FileToolbar />
    <FileSearch />
    <MyCustomFileList />
</FileBrowser>
```
