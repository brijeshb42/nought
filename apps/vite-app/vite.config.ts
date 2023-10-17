import { defineConfig, splitVendorChunkPlugin } from 'vite';
import { nought } from '@nought/vite';

export default defineConfig((env) => ({
  plugins: [
    nought({
      displayName: env.mode === 'development',
    }),
    splitVendorChunkPlugin(),
  ],
}));
