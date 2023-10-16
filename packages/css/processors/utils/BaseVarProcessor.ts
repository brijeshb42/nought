import { Expression, Params, TailProcessorParams } from '@linaria/tags';
import cssesc from 'cssesc';
import { BaseProcessor } from './BaseProcessor';

export const FALLBACK_VAR_EVAL_TO_RUNTIME_MAP = new Map<string, string>();

export abstract class BaseVarProcessor extends BaseProcessor {
  protected variableName: string;

  constructor(params: Params, ...rest: TailProcessorParams) {
    super(params, ...rest);
    const identifier = cssesc(this.className, {
      isIdentifier: true,
    });
    this.variableName = `var(--${identifier})`;
  }

  get value(): Expression {
    return this.astService.stringLiteral(this.variableName);
  }
}
