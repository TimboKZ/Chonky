As discussed in the _Using file actions_ section, Chonky specifies some default file
actions, such as "Open selection" and "Go up a directory" actions/buttons. If you
want to disable all default functionality and only use custom function, you can pass
the `disableDefaultFileActions` prop to `FileBrowser`.

For example, imagine we want to disable all Chonky file actions except for one -
`open_files`. And even for `open_files`, we want to hide the menu button so that you
can only open files by double clicking them. We do this by disabling all file actions,
and re-enabling a customised version of `open_files`:

```tsx
export const DisableExample = () => {
    const fileActions: FileAction[] = [
        {
            id: ChonkyActions.OpenFiles.id,
        },
    ];

    return (
        <FileBrowser disableDefaultFileActions={true} fileActions={fileActions}>
            <FileToolbar />
            <FileSearch />
            <FileList />
        </FileBrowser>
    );
};
```

You can see the outcome in the _Live Example_ below. Note that there are no buttons
in the toolbar, unlike all other examples in the documentation. Also, note that,
because we re-enabled `open_files` manually, you can still open files, but now
without the button in the menu.
