As you might remember from the _Installation & usage_ section, Chonky requires CSS styles to be imported into the
project for the `FileBrowser` component to be displayed correctly. You import Chonky's `main.css` similar to how you
import JS modules:

```js
// Import CSS styles
import 'chonky/style/main.css';

// Import relevant components
import { FileBrowser, FolderView } from 'chonky';

// ... Use them in your code
```

There is no way to specify custom classes for the `FileBrowser` component, but you can overwrite CSS rules from
`main.css`. There are several ways you can do it:

1. (**Not recommended**) You can create a copy of `./node_modules/chonky/styles/main.css` and place it somewhere in
   your project directory. You can then make necessary changes to the styles, and import your custom `main.css` **in
   place** of Chonky's version:

   ```js
   import './my_styles/custom_main.css';
   import { FileBrowser, FolderView } from 'chonky';
   ```

   This approach is not recommended since it increases the chance of your custom styles breaking once a new version
   of Chonky is released.

2. (**Recommended**) You can write your own `style.css` that overrides and/or extends Chonky's stylesheet, and import
   it **after** after Chonky's `main.css`:

   ```js
   import 'chonky/style/main.css';
   import './style.css';
   import { FileBrowser, FolderView } from 'chonky';
   ```

3. (**Recommended**) The original [SASS](https://sass-lang.com/) source for Chonky styles can also be found in the
   `./node_modules/chonky/styles/` directory. The file called `_util.sass` defines some styling variables and their
   default values. You can override these defaults by including Chonky's styles in your custom `style.sass`. For
   example, on could change the selection colour from light blue to orange using:

   ```scss
   // `style.scss`
   $fg-active: #f90;
   $bg-active: #f90;
   @import '~chonky/style/main.sass';
   ```

   Given you have a [SASS loader](https://github.com/webpack-contrib/sass-loader#imports) configured, you can then
   import your custom `style.sass` as shown below. Chonky styles will be included automatically.

   ```js
   import './my_styles/style.scss';
   import { FileBrowser, FolderView } from 'chonky';
   ```
