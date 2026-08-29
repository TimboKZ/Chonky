import { defineConfig, mergeConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import react from '@vitejs/plugin-react'
import viteConfig from './vite.config'

// Browser Mode config — `pnpm test:browser`. Builds on vite.config.ts rather than
// vitest.config.ts so it doesn't inherit that config's `**/*.browser.test.*`
// exclude: vitest's mergeConfig concatenates array fields, which would exclude the
// very files `include` below targets.
export default mergeConfig(
  viteConfig,
  defineConfig({
    plugins: [react()],
    test: {
      setupFiles: ['./vitest.setup.browser.ts'],
      include: ['**/*.browser.test.{ts,tsx}'],
      browser: {
        enabled: true,
        provider: playwright(),
        instances: [{ browser: 'chromium', headless: true }],
      },
    },
  }),
)
