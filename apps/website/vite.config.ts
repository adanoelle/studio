import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        visualization: resolve(__dirname, 'visualization-demo.html'),
        dithering: resolve(__dirname, 'dithering-demo.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: '/visualization-demo.html',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
