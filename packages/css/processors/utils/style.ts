import createInstance, { CSSInterpolation } from '@emotion/css/create-instance';
import mergeWith from 'lodash.mergewith';
import get from 'lodash.get';
import cssesc from 'cssesc';
import { ClassNames, ComplexStyleRule, StyleRule } from '../../vanilla-extract';
import { SimplePseudos, simplePseudoLookup } from './simplePseudos';
import { Primitive, Walkable, walkObject } from '../../walkObject';
import { ExpressionValue, isSerializable } from '@linaria/utils';
import {
  BooleanLiteral,
  Expression,
  Literal,
  NumericLiteral,
  ObjectExpression,
  StringLiteral,
  isArrayExpression,
  isIdentifier,
  isLiteral,
  isNullLiteral,
  isObjectExpression,
  isObjectProperty,
  isRegExpLiteral,
  isTemplateLiteral,
} from '@babel/types';
import { parseSync } from '@babel/core';

type MappingFn = (value: string | null, paths: string[]) => string;

export const emotion = createInstance({
  key: 'e',
  stylisPlugins: [],
});

function getVarName(variable: string) {
  const matches = variable.match(/^var\((.*)\)$/);

  if (matches) {
    return matches[1];
  }

  return variable;
}

function arrayChecker(srcObj: unknown, newObj: unknown) {
  if (Array.isArray(newObj) && Array.isArray(srcObj)) {
    return newObj;
  }
}

function iterateCssRule(rule: StyleRule, throwWhen?: string): object {
  const {
    ['@media']: mediaRules,
    ['@supports']: supportsRules,
    ['@container']: containerRules,
    ['@layer']: layerRules,
    selectors,
    vars,
    ...baseStyle
  } = rule;

  if (throwWhen === '@media' && mediaRules) {
    throw new Error('@media rules not allowed inside this style');
  }
  if (throwWhen === '@supports' && supportsRules) {
    throw new Error('@supports rules not allowed inside this style');
  }
  if (throwWhen === '@container' && containerRules) {
    throw new Error('@container rules not allowed inside this style');
  }
  if (throwWhen === '@layer' && layerRules) {
    throw new Error('@layer rules not allowed inside this style');
  }
  if (throwWhen === 'selectors' && selectors) {
    throw new Error('selectors not allowed inside this style');
  }
  let accumulator: Record<string, object | string> = {};

  if (layerRules) {
    const layers = Object.entries(layerRules).reduce((acc, [key, value]) => {
      acc[`@layer ${key}`] = iterateCssRule(value);
      return acc;
    }, {} as typeof accumulator);
    accumulator = {
      ...accumulator,
      ...layers,
    };
  }
  if (supportsRules) {
    const supports = Object.entries(supportsRules).reduce(
      (acc, [key, value]) => {
        acc[`@supports ${key}`] = iterateCssRule(value, '@supports');
        return acc;
      },
      {} as typeof accumulator
    );
    accumulator = {
      ...accumulator,
      ...supports,
    };
  }
  if (containerRules) {
    const containers = Object.entries(containerRules).reduce(
      (acc, [key, value]) => {
        acc[`@container ${key}`] = iterateCssRule(value, '@container');
        return acc;
      },
      {} as typeof accumulator
    );
    accumulator = {
      ...accumulator,
      ...containers,
    };
  }

  Object.keys(baseStyle).forEach((key) => {
    if (simplePseudoLookup[key]) {
      const value = baseStyle[key as SimplePseudos];
      if (value) {
        accumulator[`&${key}`] = value;
      }
      delete baseStyle[key as SimplePseudos];
    }
  });

  if (selectors) {
    const newSelectors = Object.entries(selectors).reduce(
      (acc, [key, value]) => {
        acc[key] = iterateCssRule(value, 'selectors');
        return acc;
      },
      {} as typeof accumulator
    );
    accumulator = {
      ...accumulator,
      ...newSelectors,
    };
  }

  let finalCss = {
    ...Object.entries(vars ?? {}).reduce((acc, [key, value]) => {
      acc[getVarName(key)] = value;
      return acc;
    }, {} as Record<string, string>),
    ...baseStyle,
    ...accumulator,
  };

  if (mediaRules) {
    const media = Object.entries(mediaRules).reduce((acc, [key, value]) => {
      acc[`@media ${key}`] = iterateCssRule(value, '@media');
      return acc;
    }, {} as typeof accumulator);
    finalCss = {
      ...finalCss,
      ...media,
    };
  }

  return finalCss;
}

function processCssObject(rules: Array<StyleRule | ClassNames>): string {
  const onlyStyleRules: StyleRule[] = [];

  rules.forEach((item) => {
    if (typeof item === 'string') {
      return;
    }
    if (Array.isArray(item)) {
      return;
    }
    onlyStyleRules.push(item);
  });
  const final = onlyStyleRules.reduce(
    (acc, rule) => mergeWith(acc, rule, arrayChecker),
    {} as StyleRule
  );
  const cssObj = iterateCssRule(final);
  const emotionClass = emotion.css(cssObj as unknown as CSSInterpolation);
  return emotion.cache.registered[emotionClass];
}

export function processRules(rule: ComplexStyleRule) {
  if (Array.isArray(rule)) {
    return processCssObject(rule);
  } else {
    return processCssObject([rule]);
  }
}

export function createThemeCss(vars: Walkable, tokens: Walkable, slug: string) {
  const acc: Record<string, Primitive> = {};
  walkObject(tokens ? tokens : vars, (value, path) => {
    const basePath = path.join('-');
    const identifier = cssesc(slug ? `${basePath}__${slug}` : basePath, {
      isIdentifier: true,
    });
    acc[tokens ? getVarName(get(vars, path)) : `--${identifier}`] = value;
  });
  const emotionClass = emotion.css(acc as unknown as CSSInterpolation);
  return emotion.cache.registered[emotionClass];
}

type SetLiteralParams = {
  accumulator: Walkable;
  nextKey: string;
  value: Literal;
  paths: string[];
  slug: string;
  useValue: boolean;
  mappingFn: MappingFn | null;
};

function setLiteral({
  accumulator,
  nextKey,
  value,
  paths,
  slug,
  useValue,
  mappingFn = null,
}: SetLiteralParams) {
  if (useValue) {
    accumulator[nextKey] =
      isNullLiteral(value) || isRegExpLiteral(value) || isTemplateLiteral(value)
        ? null
        : value.value;
  } else {
    const nextKeys = [...paths, nextKey];
    const keyFromMappingFn = !mappingFn
      ? null
      : (() => {
          try {
            const val = value as
              | StringLiteral
              | NumericLiteral
              | BooleanLiteral;
            return mappingFn(
              isNullLiteral(value) ? null : `${val.value}`,
              nextKeys
            );
          } catch (ex) {
            console.warn(
              'mapping function passed as second argument did not return a value.',
              (ex as Error).message
            );
            return null;
          }
        })();
    const basePath = keyFromMappingFn ? keyFromMappingFn : nextKeys.join('-');
    const cssVarName = cssesc(slug ? `${basePath}__${slug}` : basePath, {
      isIdentifier: true,
    });
    accumulator[nextKey] = `var(--${cssVarName})`;
  }
}

type CreateObjectExpressionParams<Node extends Expression> = {
  astNode: Node;
  slug?: string;
  accumulator: Walkable;
  paths?: string[];
  throwError?: (message: string) => void;
  useValue?: boolean;
  mappingFn?: MappingFn | null;
};

export function createObjectExpression<Node extends Expression>({
  astNode,
  slug = '',
  accumulator,
  paths = [],
  throwError,
  useValue = false,
  mappingFn = null,
}: CreateObjectExpressionParams<Node>): Walkable {
  if (isObjectExpression(astNode)) {
    astNode.properties.forEach((item) => {
      if (!isObjectProperty(item)) {
        throwError?.(
          `Found ${item.type} in the vars object. It should only container static ObjectProperty.`
        );
        return;
      }
      const { key, value } = item;
      if (!isIdentifier(key)) {
        throwError?.(
          `Found ${key.type} in the vars object key which is not supported. It should be static value.`
        );
        return;
      }
      if (isLiteral(value)) {
        setLiteral({
          accumulator,
          nextKey: key.name,
          value,
          paths,
          slug,
          useValue,
          mappingFn,
        });
      } else if (isObjectExpression(value) || isArrayExpression(value)) {
        const acc: Walkable = {};
        accumulator[key.name] = createObjectExpression({
          astNode: value,
          slug,
          accumulator: acc,
          paths: [...paths, key.name],
          throwError,
          useValue,
          mappingFn,
        });
      }
    });
  } else if (isArrayExpression(astNode)) {
    astNode.elements.forEach((item, index) => {
      if (isLiteral(item)) {
        setLiteral({
          accumulator,
          nextKey: `${index}`,
          value: item,
          paths,
          slug,
          useValue,
          mappingFn,
        });
      } else if (isObjectExpression(item) || isArrayExpression(item)) {
        const acc: Walkable = {};
        accumulator[index] = createObjectExpression({
          astNode: item,
          slug,
          accumulator: acc,
          paths: [...paths, `${index}`],
          throwError,
          useValue,
          mappingFn,
        });
      } else {
        throwError?.(
          `Found element of type: ${item?.type} in array which could not be parsed. Please provide only static values.`
        );
      }
    });
  }

  return accumulator;
}

export function valueToLiteral(
  value: unknown,
  ex: ExpressionValue
): Expression {
  if (value === undefined) {
    return {
      type: 'Identifier',
      name: 'undefined',
    };
  }

  if (isSerializable(value)) {
    if (value === null) {
      return {
        type: 'NullLiteral',
      };
    }

    if (typeof value === 'string') {
      return {
        type: 'StringLiteral',
        value,
      };
    }

    if (typeof value === 'number') {
      return {
        type: 'NumericLiteral',
        value,
      };
    }

    if (typeof value === 'boolean') {
      return {
        type: 'BooleanLiteral',
        value,
      };
    }

    if (Array.isArray(value)) {
      return {
        type: 'ArrayExpression',
        elements: value.map((v) => valueToLiteral(v, ex)),
      };
    }

    return {
      type: 'ObjectExpression',
      properties: Object.entries(value).map(([key, v]) => ({
        type: 'ObjectProperty',
        key: key.match(/^[a-zA-Z]\w*$/)
          ? {
              type: 'Identifier',
              name: key,
            }
          : {
              type: 'StringLiteral',
              value: key,
            },
        value: valueToLiteral(v, ex),
        computed: false,
        shorthand: false,
      })),
    };
  }

  throw ex.buildCodeFrameError(
    `The expression evaluated to '${value}', which is probably a mistake. If you want it to be inserted into CSS, explicitly cast or transform the value to a string, e.g. - 'String("value")'.`
  );
}

export function parseExpression<T extends Expression>(source: string): T {
  const varsObj = parseSync(`const vars = ${source}`, {
    configFile: false,
    babelrc: false,
  });
  if (!varsObj) {
    throw new Error(
      'Could not parse the vars object. Please make sure that you are only passing static values.'
    );
  }
  const firstStatement = varsObj.program.body[0];
  if (firstStatement.type === 'VariableDeclaration') {
    const expression = firstStatement.declarations[0].init;
    if (expression) {
      return expression as T;
    }
  }
  throw new Error('No expression found');
}

export function parseAsObjectExpression<T = ObjectExpression>(
  source: string
): T {
  const expression = parseExpression(source);
  if (!isObjectExpression(expression) && !isArrayExpression(expression)) {
    throw new Error(
      'Error with the parsed block. Object or Array not found in the first parameter.'
    );
  }
  return expression as T;
}
