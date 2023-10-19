import { type ObjectExpression, type ArrayExpression } from '@babel/types';
import {
  Expression,
  Params,
  TailProcessorParams,
  validateParams,
  IOptions as ILinariaOptions,
} from '@linaria/tags';
import { type Walkable } from '../walkObject';
import { BaseProcessor } from './utils/BaseProcessor';
import {
  createObjectExpression,
  parseAsObjectExpression,
  valueToLiteral,
} from './utils/style';

type IOptions = ILinariaOptions & {
  globalThemeContractPrefix?: string;
};

export class CreateThemeContractProcessor extends BaseProcessor {
  isGlobal = this.tagSource.imported === 'createGlobalThemeContract';
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

  doEvaltimeReplacement() {
    if (!this.expression) {
      this.replacer(this.value, true);
      return;
    }
    const [, mapFnParam] = this.callParams;
    let mapFn: (value: string | null, path: Array<string>) => string;

    try {
      mapFn =
        this.isGlobal && mapFnParam?.source ? eval(mapFnParam.source) : null;
    } catch (ex) {
      throw mapFnParam.buildCodeFrameError(
        "The mapping function should be a pure arrow function. It should only use the arguments it is passed because when it actually runs, it won't have the same context as where it was authored. " +
          (ex as Error).message
      );
    }

    const { globalThemeContractPrefix = '' } = this.options as IOptions;
    const evaluatedValue =
      this.evaluatedValue ??
      createObjectExpression({
        astNode: this.expression,
        slug: this.isGlobal ? '' : this.className,
        accumulator: {},
        paths:
          this.isGlobal && globalThemeContractPrefix && !mapFn
            ? [globalThemeContractPrefix]
            : [],
        throwError: (message) => {
          throw this.callParams[0].buildCodeFrameError(message);
        },
        useValue: false,
        mappingFn: mapFn,
      });
    const expression = valueToLiteral(evaluatedValue, this.callParams[0]);
    this.replacer(expression, false);
    this.evaluatedValue = evaluatedValue;
  }

  doRuntimeReplacement() {
    this.doEvaltimeReplacement();
  }
}
