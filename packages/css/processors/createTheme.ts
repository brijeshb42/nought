import {
  ArrayExpression,
  ObjectExpression,
  isObjectExpression,
} from '@babel/types';
import {
  Params,
  TailProcessorParams,
  ValueCache,
  validateParams,
} from '@linaria/tags';
import { BaseProcessor } from './utils/BaseProcessor';
import { type createTheme } from '../vanilla-extract';
import {
  createObjectExpression,
  createThemeCss,
  parseAsObjectExpression,
  valueToLiteral,
} from './utils/style';
import { parseSync } from '@babel/core';
import { Walkable } from '../walkObject';

export class CreateThemeProcessor extends BaseProcessor {
  isGlobal = false;
  isContract = false;
  expression: ObjectExpression | ArrayExpression | null = null;
  evaluatedValue: Walkable | null = null;

  constructor(params: Params, ...args: TailProcessorParams) {
    super(params, ...args);
    validateParams(
      params,
      ['callee', 'call'],
      `Invalid invocation ot ${this.tagSource.imported}`
    );
    this.isContract = this.callParams.length === 2;
    if (this.isContract) {
      return;
    }
    const [varsParam] = this.callParams;
    try {
      this.expression = parseAsObjectExpression(varsParam.source);
    } catch (ex) {
      throw varsParam.buildCodeFrameError((ex as Error).message);
    }
  }

  doEvaltimeReplacement() {
    if (!this.expression) {
      super.doEvaltimeReplacement();
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
    const t = this.astService;
    this.replacer(
      t.arrayExpression([
        t.stringLiteral(this.className),
        valueToLiteral(evaluatedValue, this.callParams[0]),
      ]),
      false
    );
    this.evaluatedValue = evaluatedValue;
  }

  build(values: ValueCache) {
    const [contract, tokens] =
      this.getEvaluatedParams<Parameters<typeof createTheme>>(values);
    const cssText = createThemeCss(contract, tokens, this.className);
    super.build(values, cssText);
  }

  doRuntimeReplacement() {
    this.doEvaltimeReplacement();
  }
}
