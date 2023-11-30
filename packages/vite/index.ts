/**
 * MIT License
 *
 * Copyright (c) 2017 Callstack
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { existsSync } from 'node:fs';
import * as path from 'node:path';
import {
  FilterPattern,
  createFilter,
  Plugin,
  ResolvedConfig,
  ViteDevServer,
  optimizeDeps,
  ModuleNode,
} from 'vite';
import { linariaLogger } from '@linaria/logger';
import {
  IFileReporterOptions,
  createPerfMeter,
  getFileIdx,
  slugify,
  syncResolve,
} from '@linaria/utils';
import { preprocessor as noughtPreProcessor } from '@nought/css/preprocessor';
import {
  PluginOptions,
  Preprocessor,
  TransformCacheCollection,
  transform,
} from '@linaria/babel-preset';

export type NoughtOptions = {
  debug?: IFileReporterOptions | false | null;
  exclude?: FilterPattern;
  include?: FilterPattern;
  globalThemeContractPrefix?: string;
  preprocessor?: Preprocessor;
  sourceMap?: boolean;
  packagesToTransform?: string[];
} & Partial<PluginOptions>;

export function nought({
  debug,
  include = [],
  exclude,
  sourceMap,
  preprocessor,
  packagesToTransform = [],
  ...rest
}: NoughtOptions): Plugin {
  const filter = createFilter(include, exclude);
  const { emitter, onDone } = createPerfMeter(debug ?? false);
  const cssLookup = new Map<string, string>();
  const cssFileLookup = new Map<string, string>();
  let config: ResolvedConfig;
  let devServer: ViteDevServer;
  const targets: { dependencies: string[]; id: string }[] = [];
  const cache = new TransformCacheCollection();

  return {
    name: 'nought',
    enforce: 'post',
    buildEnd() {
      onDone(process.cwd());
    },
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    configureServer(srvr) {
      devServer = srvr;
    },
    load(url) {
      const [id] = url.split('?', 1);
      return cssLookup.get(id);
    },
    resolveId(source) {
      const [id] = source.split('?', 1);
      if (cssLookup.has(id)) {
        return id;
      }
      return cssFileLookup.get(id);
    },
    handleHotUpdate(ctx) {
      // it's module, so just transform it
      if (ctx.modules.length) return ctx.modules;

      // Select affected modules of changed dependency
      const affected = targets.filter(
        (x) =>
          // file is dependency of any target
          x.dependencies.some((dep) => dep === ctx.file) ||
          // or changed module is a dependency of any target
          x.dependencies.some((dep) => ctx.modules.some((m) => m.file === dep))
      );
      const deps = affected.flatMap((target) => target.dependencies);

      // eslint-disable-next-line no-restricted-syntax
      for (const depId of deps) {
        cache.invalidateForFile(depId);
      }

      return affected
        .map((target) => devServer.moduleGraph.getModuleById(target.id))
        .concat(ctx.modules)
        .filter((m): m is ModuleNode => !!m);
    },
    async transform(code, url) {
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
      if (!filter(id) || cssLookup.has(id)) {
        return;
      }
      const log = linariaLogger.extend('vite');
      log('Vite transform', getFileIdx(id));
      const asyncResolve = async (
        what: string,
        importer: string,
        stack: string[]
      ) => {
        const resolved = await this.resolve(what, importer);
        if (resolved) {
          if (resolved.external) {
            const resolvedId2 = syncResolve(what, importer, stack);
            log("resolve \u2705 '%s'@'%s -> %O\n%s", what, importer, resolved);
            return resolvedId2;
          }
          log("resolve \u2705 '%s'@'%s -> %O\n%s", what, importer, resolved);
          const resolvedId = resolved.id.split('?', 1)[0];
          if (resolvedId.startsWith('\0')) {
            return null;
          }
          if (!existsSync(resolvedId)) {
            await optimizeDeps(config);
          }
          return resolvedId;
        }
        log("resolve \u274C '%s'@'%s", what, importer);
        throw new Error(`Could not resolve ${what}`);
      };
      let {
        cssText,
        dependencies = [],
        cssSourceMapText,
        code: transformedCode,
        sourceMap: transformedSourceMap,
      } = await transform(
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
      if (!cssText) {
        return;
      }

      const slug = slugify(cssText);
      const cssFilename = path
        .normalize(`${id.replace(/\.[jt]sx?$/, '')}_${slug}.css`)
        .replace(/\\/g, path.posix.sep);

      const cssRelativePath = path
        .relative(config.root, cssFilename)
        .replace(/\\/g, path.posix.sep);

      const cssId = `/${cssRelativePath}`;

      if (sourceMap && cssSourceMapText) {
        const map = Buffer.from(cssSourceMapText).toString('base64');
        cssText += `/*# sourceMappingURL=data:application/json;base64,${map}*/`;
      }
      cssLookup.set(cssFilename, cssText);
      cssFileLookup.set(cssId, cssFilename);
      transformedCode += `\nimport ${JSON.stringify(cssFilename)};\n`;

      if (devServer?.moduleGraph) {
        const module = devServer.moduleGraph.getModuleById(cssId);

        if (module) {
          devServer.moduleGraph.invalidateModule(module);
          module.lastHMRTimestamp =
            module.lastInvalidationTimestamp || Date.now();
        }
      }

      for (let i = 0, end = dependencies.length; i < end; i++) {
        // eslint-disable-next-line no-await-in-loop
        const depModule = await this.resolve(dependencies[i], url, {
          isEntry: false,
        });
        if (depModule) dependencies[i] = depModule.id;
      }
      const target = targets.find((t) => t.id === id);
      if (!target) targets.push({ id, dependencies });
      else target.dependencies = dependencies;
      return { code: transformedCode, map: transformedSourceMap };
    },
  };
}
