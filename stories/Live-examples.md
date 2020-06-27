### A note about live examples...

All live examples are written in Typescript. All components and types are imported
from the `chonky` package, e.g.:

```ts
import 'chonky/style/main.css';
import { FileBrowser, FileToolbar, FileList, FileData } from 'chonky';
```

The only exception is the `showActionNotification()` function, which calls
[the Noty notification library](https://ned.im/noty/) (not packaged with Chonky). To
run the examples locally, you can replace `showActionNotification()` with
`console.log()`.

**Important:** To keep examples simple, the React code snippets on this website
sometimes leave out the use of optimization hooks such as
[React.useMemo](https://reactjs.org/docs/hooks-reference.html#usememo) or
[React.useCallback](https://reactjs.org/docs/hooks-reference.html#usecallback).
Please make sure you use these hooks in your production code where appropriate.
