import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { defineConfig } from 'vite';
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      src: resolve(__dirname, './src'),
      '@core': resolve(__dirname, './src/core'),
      '@ui': resolve(__dirname, './src/ui'),
      '@routes': resolve(__dirname, './src/routes'),
    },
  },
  plugins: [react()],
});
