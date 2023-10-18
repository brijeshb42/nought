import { ValueCache } from '@linaria/tags';
import { syncResolve } from '@linaria/utils';
import { ValueType } from '@linaria/utils';
import { CSSVarFunction } from '../vanilla-extract';
import {
  BaseVarProcessor,
  FALLBACK_VAR_EVAL_TO_RUNTIME_MAP,
} from './utils/BaseVarProcessor';

function getFallbackVar(...values: [string, ...Array<string>]) {
  let finalValue = '';

  values.reverse().forEach((value) => {
    if (finalValue === '') {
      finalValue = String(value);
    } else {
      if (typeof value !== 'string' || !/^var\(--.*\)$/.test(value)) {
        throw new Error(`Invalid variable name: ${value}`);
      }

      finalValue = value.replace(/\)$/, `, ${finalValue})`);
    }
  });

  return finalValue as CSSVarFunction;
}

export class FallbackVarProcessor extends BaseVarProcessor {
  runtimeValue?: string;

  doEvaltimeReplacement() {
    const params = this.callParams.map((item) => {
      if (item.kind === ValueType.CONST) {
        return item.value as string;
      } else {
        const { identifierName = '' } = item.ex.loc ?? {};
        let importedFrom = item.importedFrom?.[0];
        if (!item.importedFrom || item.importedFrom.length === 0) {
          importedFrom = this.context.filename ?? '';
        } else {
          importedFrom = syncResolve(
            importedFrom ?? '',
            this.context.filename ?? '',
            []
          );
        }
        const key = `${importedFrom}:${identifierName}`;
        const maybeVal = FALLBACK_VAR_EVAL_TO_RUNTIME_MAP.get(key);
        return maybeVal;
      }
    });
    const items: string[] = [];
    params.forEach((param, index) => {
      if (typeof param === 'undefined') {
        throw this.callParams[index].buildCodeFrameError(
          '@nought/runtime: fallbackVar: It only works for locally created variables and won\'t work with "createVar()" call in a different file. This is a known limitation.'
        );
      }
      items.push(param);
    });
    this.replacer(
      this.astService.stringLiteral(
        getFallbackVar(items[0], ...items.slice(1))
      ),
      false
    );
  }

  build(values: ValueCache): void {
    const params = this.callParams
      .map((item) => {
        if (item.kind === ValueType.LAZY) {
          return values.get(item.ex.name) as string | number;
        } else if (item.kind === ValueType.CONST) {
          return item.value as string | number;
        }
        return '';
      })
      .filter((str) => !!str);

    this.runtimeValue = getFallbackVar(
      params[0] as string,
      ...(params.slice(1) as string[])
    );
    super.build(values);
  }

  doRuntimeReplacement(): void {
    this.replacer(
      this.astService.stringLiteral(this.runtimeValue ?? ''),
      false
    );
  }
}
