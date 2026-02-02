/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

// Get all TypeScript entry files
function getEntryFiles(dir: string, baseDir: string = dir): Record<string, string> {
  const entries: Record<string, string> = {};
  const files = readdirSync(dir);

  for (const file of files) {
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      Object.assign(entries, getEntryFiles(fullPath, baseDir));
    } else if (file.endsWith('.ts') && !file.endsWith('.test.ts')) {
      const relativePath = fullPath.slice(baseDir.length + 1).replace(/\.ts$/, '');
      entries[relativePath] = fullPath;
    }
  }

  return entries;
}

const srcDir = resolve(__dirname, 'src');
const entryFiles = getEntryFiles(srcDir);

export default defineConfig({
  build: {
    lib: {
      entry: entryFiles,
      formats: ['es']
    },
    rollupOptions: {
      external: ['lit', /^lit\//],
      output: {
        dir: 'dist',
        format: 'es',
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        preserveModules: false,
      }
    },
    sourcemap: true,
    emptyOutDir: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  server: {
    port: 3001
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
    setupFiles: ['./src/test-setup.ts'],
  }
});
