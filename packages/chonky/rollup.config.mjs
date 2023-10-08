import { defineConfig } from 'rollup'

// We'll use this plugin to generate the .d.ts files
import dts from 'rollup-plugin-dts'

// We'll use this plugin to transpile our TypeScript code
import pluginTs from '@rollup/plugin-typescript'

// We'll use this plugin to minify our code
import terser from '@rollup/plugin-terser'

// Some constants that we'll use later
const input = 'src/main.ts'
const external = ['react', 'react-dom', 'react/jsx-runtime']
const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'react/jsx-runtime': 'jsxRuntime',
}

export default defineConfig([
  {
    input,
    output: [
      // We tell Rollup to generate a CommonJS bundle
      {
        // The .cjs extension is not strictly necessary, but it helps
        file: 'dist/chonky.cjs',
        format: 'cjs',
        globals, // We tell Rollup how to map the external dependencies
        sourcemap: true, // We want sourcemaps for debugging purposes
      },
      // We tell Rollup to generate an ESM bundle
      {
        // The .mjs extension is not strictly necessary, but it helps
        file: 'dist/chonky.mjs',
        format: 'es',
        globals, // We tell Rollup how to map the external dependencies
        sourcemap: true, // We want sourcemaps for debugging purposes
      },
      // We tell Rollup to generate an IIFE bundle
      // (for browser environments)
      // TODO(tkuzh, 20230810): Enable IIFE/UMD builds at a feature date if the need for them arises.
      // {
      //   name: 'Chonky', // The global name given to the "bundle"
      //   file: 'dist/chonky.iife.js',
      //   format: 'iife',
      //   globals, // We tell Rollup how to map the external dependencies
      //   sourcemap: true, // We want sourcemaps for debugging purposes
      // },
      // // We tell Rollup to generate an UMD bundle
      // // (as a sort of "universal" default)
      // {
      //   name: 'Chonky', // The global name given to the "bundle"
      //   file: 'dist/chonky.umd.js',
      //   format: 'umd',
      //   globals, // We tell Rollup how to map the external dependencies
      //   sourcemap: true, // We want sourcemaps for debugging purposes
      // },
    ],
    // We tell Rollup to treat the following dependencies as external
    // (see the "external" constant above)
    external,
    plugins: [pluginTs()],
  },
  // We have another set of output files that uses a slightly different
  // configuration: We want to minify the code, so we use `terser` as a plugin,
  // and add the `min` infix to the output filenames.
  {
    input,
    output: [
      {
        file: 'dist/chonky.min.cjs',
        format: 'cjs',
        globals,
        sourcemap: true,
      },
      {
        file: 'dist/chonky.min.mjs',
        format: 'es',
        globals,
        sourcemap: true,
      },
      // {
      //   name: 'Chonky',
      //   file: 'dist/chonky.min.iife.js',
      //   format: 'iife',
      //   globals,
      //   sourcemap: true,
      // },
      // {
      //   name: 'Chonky',
      //   file: 'dist/chonky.min.umd.js',
      //   format: 'umd',
      //   globals,
      //   sourcemap: true,
      // },
    ],
    external,
    plugins: [pluginTs(), terser()],
  },
  // We also want to generate type definitions for our library:
  {
    input,
    output: [
      // Both files will be equal, but we need to generate them separately
      // to deal with some edge cases related to how TypeScript loads types.
      // An interesting thread on the topic (sadly, in Xitter):
      // https://twitter.com/AndaristRake/status/1695549037556949344
      { format: 'cjs', file: 'dist/chonky.d.cts' },
      { format: 'es', file: 'dist/chonky.d.mts' },
    ],
    external,
    plugins: [dts()],
  },
])