There are two ways you can add thumbnails to your files. The _easy way_ and the
_hard way_.

## The easy way

The easiest way to add a thumbnail to a file in Chonky is to specify the
`thumbnailUrl` field in the file object:

```tsx
const files = [
    {
        id: 'xsQwe',
        name: 'Lenna.png',
        thumbnailUrl: 'https://example.com/Lenna.png', // <----
    },
];
```

This is useful when you know the URLs for all thumbnails beforehand. Chonky will
automatically load the image from `thumbnailUrl` and display it as the thumbnail.

## The hard way

However, there are situations where thumbnails will not be available beforehand. For
example, you could have a system that generates thumbnails on demand, in a lazy-loading
fashion. In this case, you can pass a custom `thumbnailGenerator` prop to the
`FileBrowser` component:

```tsx
const files = [
    {
        id: 'xsQwe',
        name: 'Lenna.png',
    },
];

const thumbnailGenerator = (file) => {
    return Promise.resolve()
        .then(() => ajaxRequestThumbnailGeneration(file))
        .then((thumbnailUrl) => {
            // Do some additional processing of the thumbnail url
            return thumbnailUrl;
        });
};

<FileBrowser files={files} thumbnailGenerator={thumbnailGenerator}>
    <FileToolbar />
    <FileSearch />
    <FileList />
</FileBrowser>;
```

Your thumbnail generator can be a sync or an async function, and it should return
either the thumbnail URL string or a `null`. Formal type of the thumbnail generator is:

```ts
type MaybeThumbnail = Nullable<string>;
type ThumbnailGenerator = (file: FileData) => MaybeThumbnail | Promise<MaybeThumbnail>;
```

You'll be happy to find out your thumbnail generator will always be called in a
lazy-loading fashion. That is, the thumbnail will only be requested when your file
actually appears on your user's screen. This feature comes very handy when you need
to display many files (>10,000), but don't want to generate 10,000 thumbnails at the
same time.

## Example with arbitrary loading delay

The _Live Example_ below demonstrates how thumbnail loading can be carried out in
async fashion. Click `Show code` button to see the source code.
