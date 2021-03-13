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
2. Start the TSDX watcher which will transpile TS in real time:
   ```bash
   cd packages/chonky/
   yarn start
   # Keep the script running
   ```
3. In a separate shell, start the Storybook server to test the changes. It will
   hot-reload when you change Chonky source code.
   ```bash
   cd packages/storybook/
   yarn start
   # Keep the script running
   ```

## Making a PR

All PRs should be created against `2.x-dev` branch.
