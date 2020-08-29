You can use the `defaultFileViewActionId` property on the `FileBrowser` component to
specify the default file view - just pass the ID of a relevant built-in or a custom file
action.

For example, you could use `ChonkyActions.EnableListView` to enable the _List_
view by default or `ChonkyActions.EnableGridView` to enable the _Grid_ view. See the
code snippet below for example usage.

```tsx
import { ChonkyActions, FileBrowser, FileList } from 'chonky';

<FileBrowser files={[]} defaultFileViewActionId={ChonkyActions.EnableListView.id}>
    <FileList />
</FileBrowser>;
```
