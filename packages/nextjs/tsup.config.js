import { defineConfig } from 'tsup';

import baseConfig from '../../tsup.config';

export default defineConfig([
  {
    ...baseConfig,
    entry: ['./index.ts', './unplugin.ts'],
  },
]);
