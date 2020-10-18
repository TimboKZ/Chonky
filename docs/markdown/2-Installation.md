First, add Chonky to your npm project:

```bash
npm install --save chonky@0
```

> **(!!!)** Note that `@0` suffix is required because there are newer versions of
> Chonky. Remember that you should only use the `v0.x` version if your project
> does not support React Hooks. If your project does support Hooks (i.e. it
> uses React v16.8+), please use a newer version of Chonky from here:
> https://github.com/TimboKZ/Chonky
  
 You should now be able to use Chonky components by importing them from the
`chonky` package. You will also need to import the CSS file to style the
component. In the end, your imports would look similar to this:

```js
import 'chonky/style/main.css';
import { FileBrowser, FileView } from 'chonky';
```

You can see a basic usage example below. Take a look at its source code by
pressing "View Code" below the example.

```js { "componentPath": "../components/Installation.js" }
```
