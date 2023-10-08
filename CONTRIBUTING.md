# Contributing to Chonky

This document is meant for those wishing to contribute directly to the Chonky
repository. If you are just planning to use Chonky in your project and modify
its source code, this document is not for you.

## Background

The development for Chonky usually happens in bursts, with periods of inactivity
sometimes spanning several years. The rest of the world moves on of course -
React keeps updating, sometimes with breaking changes, libraries that Chonky
depends on release new versions, old build tools become obsolete and new build
tools become mainstream.

Depending on how much time has passed since *Last Update* date listed below, you
might find that instructions in this document no longer work as advertised. To
make things work, you might need to install a newer version of some package here
or make a small config change there. Feel free to create PRs updating this file
as needed.

##  Overview

> **Last Update: October 2023**

The last major overhaul of the build system used by Chonky 2.x was in October
2023.  I threw away pretty much all old build tools and replaced them with what
I identified as "modern alternatives" (based on a short survey I conducted). I
also took this opportunity to update all Chonky dependencies to recent versions,
incl. upgrading React peer dependency to v18+.

The current build system is largely based on the article by Andrés Correa
Casablanca, [*How to create a React components ESM+CJS library*](component-library)
(also a [Wayback Machine link](component-library-wayback) for posterity). The
gist is that Chonky now uses `pnpm` as the package & monorepo manager, Rollup to
create the CommonJS and ESM bundle, and `vitest` as the test runner. 

[component-library]: https://dev.to/castarco/create-a-react-components-esmcjs-library-2ig0
[component-library-wayback]: https://web.archive.org/web/20231008003051/https://dev.to/castarco/create-a-react-components-esmcjs-library-2ig0

## Buidlng & testing `chonky` package

```bash
cd packages/chonky/
pnpm install

# To format and lint:
<TODO>

# To test:
pnpm vitest run

# To build:
pnpm build

# To publish:
<TODO>
```