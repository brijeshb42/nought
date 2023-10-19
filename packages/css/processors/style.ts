import { ValueCache } from '@linaria/tags';
import { ValueType } from '@linaria/utils';
import { processRules } from './utils/style';
import type { style, globalStyle, ComplexStyleRule } from '../vanilla-extract';
import { BaseProcessor } from './utils/BaseProcessor';

export class StyleProcessor extends BaseProcessor {
  isGlobal = this.tagSource.imported === 'globalStyle';
  private runtimeClasses: string[] = [];

  doEvaltimeReplacement(): void {
    const [firstParam] = this.callParams;
    if (firstParam.kind !== ValueType.CONST && this.isGlobal) {
      throw firstParam.buildCodeFrameError(
        'The first parameter should be a string literal. It cannot be an assigned variable.'
      );
    }
    const selector =
      firstParam.kind === ValueType.CONST &&
      typeof firstParam.value === 'string'
        ? firstParam.value
        : this.className;
    this.replacer(this.astService.stringLiteral(selector), false);
  }

  build(values: ValueCache): void {
    const runtimeClasses: string[] = [];
    const params =
      this.getEvaluatedParams<Parameters<typeof style | typeof globalStyle>>(
        values
      );

    const selector =
      this.isGlobal && typeof params[0] === 'string'
        ? params[0]
        : this.asSelector;
    const styleRule = typeof params[0] === 'string' ? params[1] : params[0];
    const cssText = processRules(styleRule as ComplexStyleRule);

    if (Array.isArray(styleRule)) {
      styleRule.forEach((item) => {
        if (typeof item === 'string') {
          runtimeClasses.push(item);
        }
      });
    }
    runtimeClasses.push(this.className);
    super.build(values, cssText, selector);
    this.runtimeClasses = runtimeClasses;
  }

  doRuntimeReplacement() {
    const classNames = Array.from(new Set(this.runtimeClasses));
    this.replacer(
      this.astService.stringLiteral(this.isGlobal ? '' : classNames.join(' ')),
      false
    );
  }
}
