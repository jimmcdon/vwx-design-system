import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
    },
    rollupOptions: {
      external: [/^lit/],
    },
  },
  resolve: {
    alias: {
      '@vwx/tokens': '/packages/tokens/src',
      '@vwx/components': '/packages/components/src',
      '@vwx/themes': '/packages/themes/src',
      '@vwx/utils': '/packages/utils/src',
    },
  },
});
