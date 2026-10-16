
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/tests/setup.js',
    clearMocks: true,
    include: ['src/tests/**/*.test.{js,jsx,ts,tsx}'],
    exclude: [
      'node_modules/**',
      'src/tests/vendedor.test.jsx',
    ],
  },
});
