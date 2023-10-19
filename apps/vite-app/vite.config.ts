import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import { nought } from '@nought/vite';

export default defineConfig((env) => ({
  plugins: [
    nought({
      displayName: env.mode === 'development',
      babelOptions: {
        presets: ['@babel/preset-typescript'],
      },
    }),
    react({
      jsxRuntime: 'automatic',
    }),
    splitVendorChunkPlugin(),
  ],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return;
        }
        warn(warning);
      },
    },
  },
}));
