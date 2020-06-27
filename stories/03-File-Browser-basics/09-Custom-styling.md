As explained in _Installation_ section, you need to use a separate import statement
to import Chonky's styles:

```ts
import 'chonky/style/main.css'; // <----
import { FileBrowser } from 'chonky';

// ... Use them in your code
```

There are 3 main ways to customise the styles, all of which are described below.

This approach is not recommended since it increases the chance of your custom styles breaking once a new version
of Chonky is released.

## Method #1 (_recommended_):

You can add your own `style.css` import that overrides or extends Chonky's stylesheet,
and import it **after** after Chonky's `main.css`:

```ts
import 'chonky/style/main.css';
import './styles.css';
import { FileBrowser } from 'chonky';
```

## Method #2 (_recommended_):

The original [SASS](https://sass-lang.com/) source for Chonky styles can also be
found in the `./node_modules/chonky/styles/` directory. The file called `_util.sass`
defines some styling variables and their default values. You can override these
defaults by including Chonky's styles in your custom `style.sass`. For example, on
could change the selection colour from light blue to orange using:

```scss
// `style.scss`
$fg-active: #f90;
$bg-active: #f90;
@import '~chonky/style/main.scss';
```

Given you have a [SASS loader](https://github.com/webpack-contrib/sass-loader#imports)
configured, you can then import your custom `style.sass` as shown below. Chonky
styles will be included automatically.

```js
import './my_styles/style.scss';
import { FileBrowser, FolderView } from 'chonky';
```

## Method #3 (_Not recommended_):

You can create a copy of `./node_modules/chonky/styles/main.css` and place it somewhere
in your project directory. You can then make necessary changes to the styles, and
import your custom `main.css` **in place** of Chonky's version:

```ts
import './my_styles/custom_main.css';
import { FileBrowser, FolderView } from 'chonky';
```
