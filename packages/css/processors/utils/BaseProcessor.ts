import {
  Expression,
  BaseProcessor as LinariaBaseProcessor,
  Params,
  Rules,
  TailProcessorParams,
  ValueCache,
} from '@linaria/tags';
import { ExpressionValue, Replacements, ValueType } from '@linaria/utils';

export class BaseProcessor extends LinariaBaseProcessor {
  modifiedClassName = this.className;
  callParams: ExpressionValue[] = [];

  constructor(params: Params, ...args: TailProcessorParams) {
    super(params, ...args);
    const [, call] = params;

    if (call[0] === 'call') {
      const [, ...callParams] = call;
      this.callParams = callParams;
      this.callParams.forEach((item) => {
        if (item.kind !== ValueType.CONST) {
          this.dependencies.push(item);
        }
      });
    }
  }

  protected getEvaluatedParams<T>(values: ValueCache) {
    const paramValues = this.callParams.map((item) => {
      if (item.kind === ValueType.LAZY || item.kind === ValueType.FUNCTION) {
        const val = values.get(item.ex.name);
        if (typeof val === 'function') {
          return val();
        }
        return val;
      } else {
        return item.value;
      }
    }) as T;
    return paramValues;
  }

  get asSelector(): string {
    return `.${this.modifiedClassName}`;
  }

  get value(): Expression {
    return this.astService.stringLiteral(this.modifiedClassName);
  }

  build(values: ValueCache, cssText = '/* */', selector = ''): void {
    const rules: Rules = {
      [selector || this.asSelector]: {
        cssText,
        className: this.modifiedClassName,
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

  doEvaltimeReplacement(): void {
    this.replacer(this.value, false);
  }

  doRuntimeReplacement(): void {
    this.replacer(this.value, false);
  }
}
