import { ArrayExpression, ObjectExpression } from '@babel/types';
import {
  Params,
  TailProcessorParams,
  ValueCache,
  validateParams,
} from '@linaria/tags';
import { BaseProcessor } from './utils/BaseProcessor';
import { createGlobalTheme, type createTheme } from '../vanilla-extract';
import {
  createObjectExpression,
  createThemeCss,
  parseAsObjectExpression,
  valueToLiteral,
} from './utils/style';
import { Walkable } from '../walkObject';

export class CreateGlobalThemeProcessor extends BaseProcessor {
  hasContract = false;
  expression: ObjectExpression | ArrayExpression | null = null;
  evaluatedValue: Walkable | null = null;

  constructor(params: Params, ...args: TailProcessorParams) {
    super(params, ...args);
    validateParams(
      params,
      ['callee', 'call'],
      `Invalid invocation ot ${this.tagSource.imported}`
    );
    this.hasContract = this.callParams.length === 3;
    if (this.hasContract) {
      return;
    }
    const [, contractOrVarsParam, varsParam] = this.callParams;
    try {
      this.expression = parseAsObjectExpression(
        this.hasContract ? varsParam.source : contractOrVarsParam.source
      );
    } catch (ex) {
      throw varsParam.buildCodeFrameError((ex as Error).message);
    }
  }

  doEvaltimeReplacement() {
    if (this.hasContract || !this.expression) {
      this.replacer(this.astService.stringLiteral(''), false);
      return;
    }

    const evaluatedValue =
      this.evaluatedValue ??
      createObjectExpression({
        astNode: this.expression,
        slug: '',
        accumulator: {},
        paths: [],
        throwError: (message) => {
          throw this.callParams[0].buildCodeFrameError(message);
        },
      });
    this.replacer(valueToLiteral(evaluatedValue, this.callParams[0]), false);
    this.evaluatedValue = evaluatedValue;
  }

  build(values: ValueCache) {
    const [selector, contractOrVars, vars] =
      this.getEvaluatedParams<Parameters<typeof createGlobalTheme>>(values);
    const cssText = createThemeCss(contractOrVars, vars, '');
    super.build(values, cssText, selector);
  }

  doRuntimeReplacement() {
    this.doEvaltimeReplacement();
  }
}
