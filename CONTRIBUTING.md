# Contributing to Chonky

> **(!!!) Note that the setup instructions described below were only tested on
> Ubuntu 20.04 with Node v16.13.1.**

https://discord.gg/4HJaFn9

## Setting up the development environment

1. Clone the repository and bootstrap lerna. This will wire up all Chonky packages 
   to each other:
    ```bash
    git clone git@github.com:TimboKZ/Chonky.git
    cd Chonky
    git checkout 3.x-dev

    yarn install
    lerna bootstrap
    ```

2. In main `chonky/` package, start the TSDX watcher which will transpile TS in real time:
   ```bash
   cd packages/chonky/
   yarn start
   # Keep the script running
   ```

3. Build the `chonky-icon-fontawesome/` package:
   ```bash
   cd packages/chonky-icon-fontawesome/
   yarn build
   ```

4. In a separate shell, start the Storybook server to test the changes. It will
   hot-reload when you change Chonky source code.
   ```bash
   cd packages/website/
   yarn storybook
   # Keep the script running
   ```

## Releasing new documentation versions

To update Chonky's documentation, you can edit the Markdown files in `websites/chonky-docs/` package. `chonky-docs` uses Docusaurus, which supports a lot of cool features including live reloading. Run the following to preview the documentation changes in real time:

```bash
cd websites/chonky-docs/
yarn start
```

Once you are happy with the changes to documentation, you can run:
```
npm run docusaurus docs:version 3.0
```

Replacing `3.0` with the relevant version for your release. Note that we only include major and minor version in the version string, e.g. `3.0` is acceptable, but `3.0.1` is not.

To deploy the docs, you can run the `deploy-3.x-website` GitHub action, which will compile all website artifacts and upload them to S3. 


## Making a PR

All PRs should be created against `2.x-dev` branch.
