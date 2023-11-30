import type { NextConfig } from 'next';
import { findPagesDir } from 'next/dist/lib/find-pages-dir';
import { type NoughtOptions, noughtPlugin } from './unplugin';

type Context = {
  async: () => (err: Error | null, source: string) => void;
  resourceQuery: string;
};

export const nextJsLoader = function virtualFileLoader(this: Context) {
  const callback = this.async();
  const resourceQuery = this.resourceQuery.slice(1);
  const { source } = JSON.parse(decodeURIComponent(resourceQuery));
  return callback(null, source);
};

export function withNought(
  nextConfig: NextConfig,
  noughtOptions: NoughtOptions = {}
) {
  const { babelOptions, ...rest } = noughtOptions;
  const webpack: Exclude<NextConfig['webpack'], undefined> = (
    config,
    context
  ) => {
    const { dir, dev, isServer, config: resolvedNextConfig } = context;

    const findPagesDirResult = findPagesDir(
      dir,
      // @ts-expect-error next.js v12 accepts 2 arguments, while v13 only accepts 1
      resolvedNextConfig.experimental?.appDir ?? false
    );

    let hasAppDir = false;

    if ('appDir' in resolvedNextConfig.experimental) {
      hasAppDir =
        !!resolvedNextConfig.experimental.appDir &&
        !!(findPagesDirResult && findPagesDirResult.appDir);
    } else {
      hasAppDir = !!(findPagesDirResult && findPagesDirResult.appDir);
    }

    config.module.rules.unshift({
      enforce: 'pre',
      test: (filename: string) => filename.endsWith('zero-virtual.css'),
      use: require.resolve('../next-loader'),
    });
    config.plugins.push(
      noughtPlugin.webpack({
        ...rest,
        asyncResolve(what) {
          if (what === 'next/image') {
            return require.resolve('../next-image');
          } else if (what.startsWith('next/font')) {
            return require.resolve('../next-font');
          }
          return null;
        },
        babelOptions: {
          ...babelOptions,
          presets: [...(babelOptions?.presets ?? []), 'next/babel'],
        },
      })
    );

    if (typeof nextConfig.webpack === 'function') {
      return nextConfig.webpack(config, context);
    }
    return config;
  };
  return {
    ...nextConfig,
    webpack,
  };
}
