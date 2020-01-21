The goal of this section is to show you how you can generate file descriptions. What you actually end up doing is
completely up to you - you can fetch JSON data from the server, make requests to
[Google Drive API](https://developers.google.com/drive/api/v3/about-sdk) or manage an in-memory FS in your browser.

One possible approach is to use Node.js to generate file objects. We'll use
[`path` module](https://nodejs.org/api/path.html) to [`crypto` module](https://nodejs.org/api/crypto.html) to generate
IDs, and [`fs` module](https://nodejs.org/api/fs.html) to fetch information about the file:

```js { "filePath" : "../components/Generate-description.js" }
```

When this script is executed, the resulting `file.json` reads:

```js { "filePath" : "../components/file.json" }
```

Note that `JSON.stringify` automatically converted `modDate` into a string. Since Chonky expects `modDate` to be a
`Date` object, you will need to convert it back into `Date` after loading the JSON:

```js
const fileJson = fs.readFileSync('./file.json', 'utf8');
const file = JSON.parse(fileJson);
file.modDate = new Date(file.modDate);
```
