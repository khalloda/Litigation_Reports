import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    base: '/',
    root: '.',
    publicDir: 'public',
    build: {
      outDir: './dist',
      emptyOutDir: true,
      assetsDir: 'assets',
      sourcemap: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html')
        },
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: ['react-bootstrap', 'bootstrap'],
            forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
            utils: ['axios', 'date-fns', 'clsx'],
          },
        },
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3005,
      allowedHosts: ['lit.local', 'localhost', '127.0.0.1'],
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@pages': resolve(__dirname, 'src/pages'),
        '@hooks': resolve(__dirname, 'src/hooks'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@types': resolve(__dirname, 'src/types'),
        '@styles': resolve(__dirname, 'src/styles'),
        '@assets': resolve(__dirname, 'src/assets'),
        '@i18n': resolve(__dirname, 'src/i18n'),
        '@services': resolve(__dirname, 'src/services'),
        '@contexts': resolve(__dirname, 'src/contexts'),
        '@store': resolve(__dirname, 'src/store'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import "@styles/variables.scss";
            @import "@styles/mixins.scss";
          `,
          silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin', 'color-functions'],
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      css: true,
    },
  };
});
