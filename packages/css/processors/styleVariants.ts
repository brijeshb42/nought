import { Expression, ValueCache } from '@linaria/tags';
import { Replacements, Rules } from '@linaria/utils';
import { ComplexStyleRule, styleVariants } from '../vanilla-extract';
import { ObjectProperty } from '@babel/types';
import { processRules } from './utils/style';
import { BaseProcessor } from './utils/BaseProcessor';

export class StyleVariantsProcessor extends BaseProcessor {
  runtimeClasses: Record<string, string[] | string> = {};

  build(values: ValueCache): void {
    const [data, mapData] =
      this.getEvaluatedParams<Parameters<typeof styleVariants>>(values);
    Object.entries(data).forEach(([classKey, value]) => {
      let style = value;
      if (typeof mapData === 'function') {
        style = mapData(value, classKey);
      }
      const styleRule = style as ComplexStyleRule;
      const runtimeClasses: string[] = [];
      const variantClass = `${this.className}__${classKey}`;

      if (Array.isArray(styleRule)) {
        styleRule.forEach((item) => {
          if (typeof item === 'string') {
            runtimeClasses.push(item);
          } else {
            runtimeClasses.push(variantClass);
          }
        });
      }
      const cssText = processRules(styleRule);
      const rules: Rules = {
        [`.${variantClass}`]: {
          cssText: cssText ?? '/* */',
          displayName: this.displayName,
          className: variantClass,
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
      this.runtimeClasses[classKey] = runtimeClasses;
      this.artifacts.push(['css', [rules, replacements]]);
    });
  }

  doEvaltimeReplacement(): void {
    this.replacer(this.value, false);
  }

  doRuntimeReplacement(): void {
    const t = this.astService;
    const properties: ObjectProperty[] = Object.entries(
      this.runtimeClasses
    ).map(([key, composedClasses]) => {
      return t.objectProperty(
        t.identifier(key),
        t.stringLiteral(
          typeof composedClasses === 'string'
            ? composedClasses
            : Array.from(new Set(composedClasses)).join(' ')
        )
      );
    });
    this.replacer(this.astService.objectExpression(properties), false);
  }

  get value(): Expression {
    return this.astService.stringLiteral('');
  }
}
