import { defineConfig } from 'vite'
import devServer from '@hono/vite-dev-server'

export default defineConfig({
  plugins: [
    devServer({
      entry: 'src/index.tsx'
    })
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    ssr: true,
    rollupOptions: {
      input: './src/index.tsx',
      output: {
        entryFileNames: '_worker.js',
        format: 'es'
      }
    }
  }
})
