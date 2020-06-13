Where possible, Chonky tries to report errors when they arise. For example,
`FileBrowser` component expects its `files` prop to be an array. If you pass some
invalid value instead, e.g. `null`, you will see an error component being rendered
instead of the file browser. Same error will also be logged to console.
