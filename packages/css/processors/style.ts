import { ValueCache } from '@linaria/tags';
import { Replacements, Rules } from '@linaria/utils';
import { processRules } from './utils/style';
import { ComplexStyleRule, style } from '../vanilla-extract';
import { BaseProcessor } from './utils/BaseProcessor';

export class StyleProcessor extends BaseProcessor {
  private runtimeClasses: string[] = [];

  build(values: ValueCache): void {
    const runtimeClasses: string[] = [];
    const paramValues =
      this.getEvaluatedParams<Parameters<typeof style>>(values);
    const styleRule = paramValues[0] as ComplexStyleRule;
    const cssText = processRules(paramValues[0] as ComplexStyleRule);

    if (Array.isArray(styleRule)) {
      styleRule.forEach((item) => {
        if (typeof item === 'string') {
          runtimeClasses.push(item);
        }
      });
    }
    runtimeClasses.push(this.className);

    const rules: Rules = {
      [this.asSelector]: {
        cssText,
        displayName: this.displayName,
        className: this.className,
        start: this.location?.start,
      },
    };
    const replacements: Replacements = [
      {
        length: cssText.length,
        original: {
          start: {
            column: this.location?.start.column ?? 0,
            line: this.location?.start.line ?? 0,
          },
          end: {
            column: this.location?.end.column ?? 0,
            line: this.location?.end.line ?? 0,
          },
        },
      },
    ];
    this.artifacts.push(['css', [rules, replacements]]);
    this.runtimeClasses = runtimeClasses;
  }

  doEvaltimeReplacement(): void {
    this.replacer(this.astService.stringLiteral(this.className), false);
  }

  doRuntimeReplacement(): void {
    this.replacer(
      this.astService.stringLiteral(
        this.runtimeClasses.length
          ? this.runtimeClasses.join(' ')
          : this.className
      ),
      false
    );
  }
}
