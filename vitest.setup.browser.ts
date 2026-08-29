// Browser Mode only (vitest.browser.config.ts). `vitest-browser-react` can only be
// imported when Vitest is actually running in Browser Mode — importing it from the
// default forks pool crashes every test file before any test runs.
import 'vitest-browser-react'
import './src/styles.css'
