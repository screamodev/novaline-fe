import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

// Unit tests for pure server/shared logic (normalisers, cache purge, secret checks).
export default defineConfig({
  resolve: {
    alias: { '#shared': fileURLToPath(new URL('./shared', import.meta.url)) },
  },
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
})
