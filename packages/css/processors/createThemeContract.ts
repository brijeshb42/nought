import { parseSync } from '@babel/core';
import {
  type ObjectExpression,
  isObjectExpression,
  type ArrayExpression,
  isArrayExpression,
} from '@babel/types';
import {
  Expression,
  Params,
  TailProcessorParams,
  ValueCache,
  validateParams,
} from '@linaria/tags';
import { Rules, Replacements } from '@linaria/utils';
import { type Walkable } from '../walkObject';
import { BaseProcessor } from './utils/BaseProcessor';
import {
  createObjectExpression,
  parseAsObjectExpression,
  valueToLiteral,
} from './utils/style';

export class CreateThemeContractProcessor extends BaseProcessor {
  isGlobal = false;
  expression: ObjectExpression | ArrayExpression | null = null;
  evaluatedValue: Walkable | null = null;

  constructor(params: Params, ...args: TailProcessorParams) {
    super(params, ...args);

    validateParams(
      params,
      ['callee', 'call'],
      `Invalid invocation ot ${this.tagSource.imported}`
    );

    const [varsParam] = this.callParams;
    try {
      this.expression = parseAsObjectExpression(varsParam.source);
    } catch (ex) {
      throw varsParam.buildCodeFrameError((ex as Error).message);
    }
  }

  get asSelector(): string {
    return `.${this.className}`;
  }

  get value(): Expression {
    return this.astService.objectExpression([]);
  }

  build(values: ValueCache) {
    const cssText = '/* */';
    const rules: Rules = {
      [this.asSelector]: {
        cssText,
        className: this.className,
        displayName: this.displayName,
        start: this.location?.start,
      },
    };
    const replacement: Replacements = [
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
    this.artifacts.push(['css', [rules, replacement]]);
  }

  doEvaltimeReplacement() {
    if (!this.expression) {
      this.replacer(this.astService.objectExpression([]), true);
      return;
    }
    const evaluatedValue =
      this.evaluatedValue ??
      createObjectExpression(
        this.expression,
        this.isGlobal ? '' : this.className,
        {},
        [],
        (message) => {
          throw this.callParams[0].buildCodeFrameError(message);
        }
      );
    this.replacer(valueToLiteral(evaluatedValue, this.callParams[0]), false);
    this.evaluatedValue = evaluatedValue;
  }
  doRuntimeReplacement() {
    this.doEvaltimeReplacement();
  }
}
