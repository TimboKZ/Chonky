---
sidebar_position: 1
---

# Introduction

### Description

Chonky is a file browser component for React. It tries to recreate the native
file browsing experience in your browser. This means your users can make
selections, drag & drop files, toggle between List and Grid file views, use
keyboard shortcuts, and much more!

### Available resources

1.  [Landing page](/) - a quick overview and a simple demo of Chonky.
2.  [Documentation](/docs/intro) **(you are here)** - detailed documentation with some code snippets and live examples.
3.  [Storybook](https://chonky.io/storybook/2.x/) - showcase of full-fledged file browsers built using Chonky.

### Live examples

The docs include many live examples of Chonky components. You can edit
their code to update the component in real time. Try it with this button:

```jsx live
() => {
    const showAlert = React.useCallback(() => alert('You clicked a button!'));
    return <button onClick={showAlert}>Click Me!</button>;
}
```

### Philosophy behind Chonky

Please read this section to understand what Chonky is and is not.

---

1. **Chonky is the presentation layer.**

    Chonky takes a list of files and shows them to the user. It does not and should not
    know where the files come from or how file operations are executed.

    That said, when it comes to file browser UI, Chonky tries to cover as many _UI_
    features as possible.

---

2. **Chonky is just the tip of the FS iceberg. You will need to implement many things
   yourself.**

    Chonky saves you _a lot_ of time by providing a pretty file browser UI
    for your users. However, apart from a pretty UI, working with the file system
    requires a lot of custom business logic. **You will have to implement this business
    logic yourself.**

    In the future, Chonky might provide extensions like S3 or FTP
    adapters, but this is not the case today.

---

3. **Developing file browsers is hard. Each use case is unique.**

    While it is not possible for Chonky to address every use case explicitly, it
    provides a very powerful file action framework. This framework lets you customize
    and tweak Chonky's behaviour without having to change the source code directly.

    Unfortunately this power comes from understanding how Chonky works internally, so
    you might still find it necessary to familiarise yourself with Chonky's source code.
    If you're not sure how something can be done, please [create an
    issue](https://github.com/TimboKZ/Chonky/issues) describing your use case. I'll be
    happy to show you some code examples.

---