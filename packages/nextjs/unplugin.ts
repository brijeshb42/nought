import * as path from 'node:path';
import { createUnplugin } from 'unplugin';
import { linariaLogger } from '@linaria/logger';
import type {
  PluginOptions as LinariaPluginOptions,
  Preprocessor,
} from '@linaria/babel-preset';
import { TransformCacheCollection, transform } from '@linaria/babel-preset';
import {
  createPerfMeter,
  asyncResolveFallback,
  slugify,
  getFileIdx,
} from '@linaria/utils';
import { preprocessor as noughtPreProcessor } from '@nought/css/preprocessor';

import { type IFileReporterOptions } from '@linaria/utils';
import { createFilter, type FilterPattern } from '@rollup/pluginutils';

export type NoughtOptions = {
  debug?: IFileReporterOptions | false | null;
  exclude?: FilterPattern;
  include?: FilterPattern;
  globalThemeContractPrefix?: string;
  preprocessor?: Preprocessor;
  sourceMap?: boolean;
  packagesToTransform?: string[];
} & Partial<LinariaPluginOptions>;

const extractionFile = path.join(
  path.dirname(require.resolve('../package.json')),
  'zero-virtual.css'
);

export const noughtPlugin = createUnplugin<
  NoughtOptions & {
    asyncResolve?: (what: string) => string | null;
  }
>((options = {}) => {
  const {
    debug = false,
    include = [],
    exclude,
    sourceMap,
    preprocessor,
    packagesToTransform = [],
    asyncResolve: asyncResolveOpt,
    ...rest
  } = options;

  const filter = createFilter(include, exclude);
  const cache = new TransformCacheCollection();
  const { emitter, onDone } = createPerfMeter(debug ?? false);

  return [
    {
      name: 'nought',
      enforce: 'post',
      buildEnd() {
        onDone(process.cwd());
      },
      async transform(code, url) {
        if (!url) {
          return null;
        }
        const [id] = url.split('?', 1);
        // modification starts
        let shouldProcess = true;
        if (url.includes('node_modules')) {
          if (
            packagesToTransform.length &&
            packagesToTransform.some((item) => url.includes(item))
          ) {
            shouldProcess = true;
          } else {
            shouldProcess = false;
          }
        }
        if (!shouldProcess) {
          return;
        }
        // modification ends
        if (!filter(id)) {
          return;
        }
        const log = linariaLogger.extend('vite');
        log('Unplugin transform', getFileIdx(id));
        const asyncResolve: typeof asyncResolveFallback = async (
          what,
          importer,
          stack
        ) => {
          const result = asyncResolveOpt?.(what);
          if (typeof result === 'string') {
            return result;
          }
          return await asyncResolveFallback(what, importer, stack);
        };
        const result = await transform(
          {
            options: {
              filename: id,
              root: process.cwd(),
              preprocessor: preprocessor ?? noughtPreProcessor,
              pluginOptions: rest,
            },
            cache,
            eventEmitter: emitter,
          },
          code,
          asyncResolve
        );
        if (!result.cssText) {
          return null;
        }

        let { cssText } = result;

        const slug = slugify(cssText);
        const cssFilename = `${slug}.zero.css`;

        const data = `${extractionFile}?${encodeURIComponent(
          JSON.stringify({
            filename: cssFilename,
            source: cssText,
          })
        )}`;
        return {
          code: `import ${JSON.stringify(data)};\n${result.code}`,
          map: result.sourceMap,
        };
      },
    },
  ];
});
