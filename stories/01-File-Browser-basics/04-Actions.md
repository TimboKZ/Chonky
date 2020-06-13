TODO Explain:

-   Functionality differs.
-   Some controls come built-in.
-   Other controls you have to work for.

Every application using Chonky will be different. Some will require a feature to
upload files, other will need to support cutting & pasting. Bottom line -
requirements will differ! Chonky tries to address this problem using **File Actions**
and **Action Handlers**.

## File actions

**File Actions** define _what_ can happen. These actions can be triggered by some
hotkey, user clicking on a button, or a special event like drag & drop. Here are some
examples of file actions:

-   User deletes some files by making a selection and pressing `Delete`.
-   User initializes a file upload by clicking on "Upload File" button.
-   User moves some files from one folder to another using drag & drop.

Action definitions can be passed to the `FileBrowser` component via the `fileActions`
prop. Each definition should be an object of the following type:

```ts
export interface FileAction {
    name: string;
    metadata?: any;
    requiresSelection?: boolean;

    hotkeys?: string[]; // Hotkeys using `hotkey-js` notation
    toolbarButton?: ToolbarButtonData; // Description below
}

export interface ToolbarButtonData {
    name: string;
    group?: string;
    tooltip?: string;
    icon?: ChonkyIconName | string;
    iconOnly?: boolean;
}

// You can use these types in your Typescript code:
import {FileAction, ToolbarButtonData} from 'chonky';
```

## Action handlers
