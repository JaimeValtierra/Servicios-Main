import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: 'react',
      babel: {
        plugins: [],
      },
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173, // Puerto por defecto de Vite
    strictPort: true,
    open: false,
    host: true,
    cors: true,
  },
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'public/index.html'),
      },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
    },
  },
  preview: {
    port: 5173,
    strictPort: true,
  },
});
