import { defineConfig } from 'vitest/config'
import { builtinModules } from 'node:module'

export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      entry: ['src/index.ts'],
      formats: ['es'],
    },
    minify: false,
    outDir: 'dist',
    rollupOptions: {
      external: [
        ...builtinModules,
        ...builtinModules.map(m => `node:${m}`),
      ],
    },
    sourcemap: true,
    target: 'node24',
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.(spec|test).ts'],
  },
})
