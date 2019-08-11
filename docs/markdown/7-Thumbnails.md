You can add thumbnails to your files by passing a `thumbnailGenerator` function to `FileBrowser`. This function 
should take in a file object and return either thumbnail URL or `null`. Async logic is also supported - this means 
your thumbnail generator can return a promise that resolves into a thumbnail URL or `null`. Formally, the type of 
`thumbnailGenerator` function is defined as follows:

```ts
export type ThumbnailGenerator = (file: FileData) => Nullable<string> | Promise<Nullable<string>>;
```

The thumbnail URL you provide will be put inside the `background-image: url('<your_url>');` CSS rule on the file 
entry component. It is up to you whether the URL your provide includes the domain name. It can also be relative or 
absolute - whatever works for you.

### Example thumbnail generator

The simplest approach would be to add a custom property to your file objects. We'll call it `thumbnailUrl`, and it 
will hold the URL to the thumbnail image. In our `thumbnailGenerator`, we will simply read it from the file object 
and return it to Chonky. See below for an example of how this is done.

```js { "componentPath" : "../components/Thumbnails.js" }
```

### Async logic

It's a good idea to make sure the thumbnail image is fully loaded by the browser before showing it to your users. The
code below asynchronously loads the image and returns a promise that resolves once the image is loaded. 

**Important:** Note the last line with the `.catch(...)` call. It is important that you catch all sync and async 
errors yourself, and handle them in a user-friendly way. If Chonky catches an error that was thrown in the function 
you provided, it will log the error to console and remind you to write your own error handlers.

```javascript
const thumbnailGenerator = (file) => {
    if (!file.thumbnailUrl) return null;
    
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(file.thumbnailUrl);
        image.onerror = () => reject(new Error(`Failed to load thumbnail for "${file.base}".`));
        image.src = file.thumbnailUrl;
    })
        .catch((error) => console.error(error));
};
```
