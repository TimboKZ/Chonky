An **Action Handler** is a function that is called every time a file action is
dispatched. You can pass your handler to `FileBrowser` via the `onFileAction` prop:

```tsx
export const ActionsExample = () => {
    const handleFileAction = React.useCallback(
        (action: FileAction, data: FileActionData) => {
            console.log('Action definition:', action);
            console.log('Action data:', data);
        },
        []
    );

    return (
        <div className="live-example" style={{ height: 500 }}>
            <FileBrowser files={[]} onFileAction={handleFileAction}>
                <FileToolbar />
                <FileList />
            </FileBrowser>
        </div>
    );
};
```

**All** of the file actions will be sent to your action handler. It is normal to
ignore most of the actions and only handle the ones you're interested in.

As you can see from the example, your action handler will get 2 parameters - a
`FileAction` object and a `FileActionData` object. The first object, `FileAction`, is
just the action definition. You can read sections _Using file actions_ and
_Custom file actions_ to find out more. The second object, `FileActionData`, contains
information about the files related to the action dispatch. The formal type is:

```ts
interface FileActionData {
    actionId: string;
    target?: Readonly<FileData>;
    files?: ReadonlyArray<Readonly<FileData>>;
}
```

`actionId` will always be set, but `target` and `files` might not be present,
depending on the action. You can play around with the default actions to understand
when each field is provided and when it is not.

## Ignoring actions

Ignoring actions is very simple - you just create an `if-else` or `switch` clause and
conditionally only catch actions you're interested in. For example, if you only want
to handle "Open Files" action, you would do.

```ts
import { FileAction, FileActionData, ChonkyActions } from 'chonky';

const handleFileAction = (action: FileAction, data: FileActionData) => {
    if (action.id === ChonkyActions.OpenFiles.id) {
        console.log('The following files were opened:', action.files);
    } else {
        // Do nothing.
    }
};
```
