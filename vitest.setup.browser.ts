// Browser Mode only (vitest.browser.config.ts). `vitest-browser-react` can only be
// imported when Vitest is actually running in Browser Mode — importing it from the
// default forks pool crashes every test file before any test runs.
import 'vitest-browser-react'

// The design system this package is built out of. Without it the gui-bytes
// primitives render with no tokens and no base styles, so any assertion about
// real geometry (dialog widths, tooltip proportions) measures the wrong thing.
import './.storybook/storybook-tokens.css'
import './src/styles.css'
