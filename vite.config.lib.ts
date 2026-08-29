import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import { resolve } from 'path'

// Heavy, optional viewer dependencies. Declared optional peers and reached only
// through dynamic import(), so a consuming app that never opens a .docx or .stl
// neither installs nor downloads them. Externalised here so the bundle keeps the
// dynamic import rather than inlining (or failing to resolve) the dependency.
const OPTIONAL_PEERS = ['@react-three/drei', '@react-three/fiber', 'docx-preview', 'libheif-js', 'three', 'xlsx']

export default defineConfig({
  plugins: [react(), tailwindcss(), libInjectCss()],
  resolve: {
    alias: { '@': resolve(__dirname, './src') },
  },
  build: {
    lib: {
      entry: {
        'index': resolve(__dirname, 'src/index.ts'),
        'adapter/fsg/index': resolve(__dirname, 'src/adapter/fsg/index.ts'),
        'preview/index': resolve(__dirname, 'src/preview/index.ts'),
        'images/index': resolve(__dirname, 'src/images/index.ts'),
        'compat/index': resolve(__dirname, 'src/compat/index.ts'),
        'fsg/index': resolve(__dirname, 'src/fsg/index.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: (id) => {
        // React must be a singleton with the consuming app.
        if (id === 'react' || id.startsWith('react/') || id === 'react-dom' || id.startsWith('react-dom/')) return true
        // lucide-react is a peer shared with @fsg/gui-bytes; bundling it would
        // duplicate the whole icon set in every consumer.
        if (id === 'lucide-react' || id.startsWith('lucide-react/')) return true
        if (id === 'sonner') return true
        // The design system this package is built out of. Bundling it would ship a
        // second copy of every primitive and a second set of React contexts.
        if (id === '@fsg/gui-bytes' || id.startsWith('@fsg/gui-bytes/')) return true
        return OPTIONAL_PEERS.some((pkg) => id === pkg || id.startsWith(pkg + '/'))
      },
    },
    sourcemap: true,
    target: 'esnext',
    minify: false,
    outDir: 'dist',
    emptyOutDir: true,
  },
})
