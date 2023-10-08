// eslint-disable-next-line import/no-unresolved
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // We'll use the `jsdom` environment to run tests that depend on the
    // browser DOM
    environment: 'jsdom',
  },
})