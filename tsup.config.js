import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['index.ts'],
  splitting: true,
  sourcemap: true,
  clean: true,
  format: ['cjs', 'esm'],
  treeshake: true,
  cjsInterop: true,
  metafile: true,
  dts: true,
  silent: true,
});
