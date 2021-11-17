# Contributing to Chonky

https://discord.gg/4HJaFn9

## Setting up the development environment

1. Clone the repository and bootstrap lerna. This will wire up all Chonky packages 
   to each other:
    ```bash
    git clone git@github.com:TimboKZ/Chonky.git
    cd Chonky
    git checkout 2.x-dev

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

## Making a PR

All PRs should be created against `2.x-dev` branch.
