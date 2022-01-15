import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/**/*'],
  keepNames: true,
  minify: true,
  sourcemap: true,
  tsconfig: './tsconfig.json',
});
