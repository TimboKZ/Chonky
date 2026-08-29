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
        // A desktop viewport: the toolbar collapses its primary actions into an
        // overflow menu below `sm`, and the default mobile-sized viewport would
        // silently test that layout instead of the one most users see.
        instances: [{ browser: 'chromium', headless: true }],
        viewport: { width: 1280, height: 800 },
      },
    },
  }),
)
