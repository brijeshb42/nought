import { defineConfig } from 'tsup';

import baseConfig from '../../tsup.config';

const processors = [
  'preprocessor',
  'createVar',
  'fallbackVar',
  'style',
  'styleVariants',
  'createThemeContract',
  'createTheme',
  'createGlobalTheme',
  'assignVars',
  'fontFace',
  'keyframes',
  'createContainer',
  'layer',
];

export default defineConfig([
  {
    ...baseConfig,
    dts: false,
  },
  {
    ...baseConfig,
    format: ['cjs', 'esm'],
    entry: processors.map((file) => `processors/${file}.ts`),
    outDir: 'dist/processors',
    dts: false,
    cjsInterop: true,
    treeshake: true,
    platform: 'node',
  },
]);
