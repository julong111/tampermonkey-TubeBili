import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/__tests__/**/*.test.js'],
    setupFiles: ['src/__tests__/helpers/setup-vitest-env.js'],
  },
})
