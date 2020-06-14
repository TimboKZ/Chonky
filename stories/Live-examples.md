### A note about live examples...

All live examples are written in Typescript. All components and types are imported
from the `chonky` package, e.g.:

```ts
import 'chonky/style/main.css';
import { FileBrowser, FileToolbar, FileList, FileData } from 'chonky';
```

The only exception is the `showNotification()` function, which calls
[the Noty notification library](https://ned.im/noty/) (not packaged with Chonky). To
 run the examples locally, you can replace `showNotification()` with `alert()`.
