import { defineConfig, mergeConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

// Node (forks pool) config — `pnpm test`. Browser Mode specs live in
// `*.browser.test.*` and are excluded here; they run under
// vitest.browser.config.ts, which needs a real DOM and a real Playwright page.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'node',
      exclude: [...configDefaults.exclude, '**/*.browser.test.{ts,tsx}'],
    },
  }),
)
