import { Expression, Params, TailProcessorParams } from '@linaria/tags';
import { BaseProcessor } from './utils/BaseProcessor';
import {
  ArrayExpression,
  ObjectExpression,
  ObjectProperty,
  isIdentifier,
  isMemberExpression,
  isObjectExpression,
} from '@babel/types';
import { Walkable, walkObject } from '../walkObject';
import {
  createObjectExpression,
  parseAsObjectExpression,
  parseExpression,
} from './utils/style';
import get from 'lodash.get';

function getObjectExpression(
  expression: Expression,
  paths: string[]
): [ObjectExpression, string[]] {
  if (!isMemberExpression(expression) && !isObjectExpression(expression)) {
    throw new Error(
      'You can only pass objects or dotted notation to an object.'
    );
  }
  if (isObjectExpression(expression)) {
    return [expression, paths];
  } else if (isMemberExpression(expression)) {
    const identifier = expression.property;
    if (!isIdentifier(identifier)) {
      throw new Error(
        `The identifier can only be a static propery. Found ${identifier.type}`
      );
    }
    return getObjectExpression(expression.object, [...paths, identifier.name]);
  }
  throw new Error("Couldn't find relevant object or member expression");
}

export class AssignVarsProcessor extends BaseProcessor {
  private expression: ObjectExpression | null = null;
  private valuesExpression: ObjectExpression | ArrayExpression | null = null;
  private keys: string[] = [];

  constructor(params: Params, ...args: TailProcessorParams) {
    super(params, ...args);
    const [varsParam, tokensParam] = this.callParams;

    try {
      const expression = parseExpression(varsParam.source);
      const [objectExpression, keys] = getObjectExpression(expression, []);
      this.expression = objectExpression;
      this.keys = keys;
    } catch (ex) {
      throw varsParam.buildCodeFrameError((ex as Error).message);
    }
    try {
      const expression = parseAsObjectExpression(tokensParam.source);
      this.valuesExpression = expression;
    } catch (ex) {
      throw tokensParam.buildCodeFrameError((ex as Error).message);
    }
  }

  doEvaltimeReplacement() {
    if (!this.expression || !this.valuesExpression) {
      this.replacer(this.astService.objectExpression([]), false);
      return;
    }
    const t = this.astService;
    const varTokens = createObjectExpression({
      astNode: this.expression,
      accumulator: {},
      throwError: (message) => {
        throw this.callParams[0].buildCodeFrameError(message);
      },
      useValue: true,
    });
    const actualObj = this.keys.length
      ? (get(varTokens, this.keys) as Walkable)
      : varTokens;
    const valuesObj = createObjectExpression({
      astNode: this.valuesExpression,
      accumulator: {},
      throwError: (message) => {
        throw this.callParams[0].buildCodeFrameError(message);
      },
      useValue: true,
    });
    const properties: ObjectProperty[] = [];
    walkObject(actualObj, (value, path) => {
      const toSetValue = get(valuesObj, path);
      const toSetLiteral = (() => {
        if (toSetValue === null) {
          return t.nullLiteral();
        } else if (typeof toSetValue === 'undefined') {
          return t.identifier('undefined');
        } else if (typeof toSetValue === 'string') {
          return t.stringLiteral(toSetValue);
        } else if (typeof toSetValue === 'number') {
          return t.numericLiteral(toSetValue);
        }
        return t.nullLiteral();
      })();
      properties.push(
        t.objectProperty(t.stringLiteral(value as string), toSetLiteral)
      );
    });
    this.replacer(this.astService.objectExpression(properties), false);
  }

  build() {}

  doRuntimeReplacement(): void {
    this.doEvaltimeReplacement();
  }
}
