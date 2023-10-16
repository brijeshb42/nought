import type { Element } from 'stylis';
import { serialize, compile, stringify, middleware } from 'stylis';

function globalSelector(element: Element) {
  switch (element.type) {
    case 'rule':
      element.props = (element.props as string[]).map((value: any) => {
        if (value.match(/(:where|:is)\(/)) {
          value = value.replace(/\.[^:]+(:where|:is)/, '$1');
          return value;
        }
        return value;
      });
      break;
    default:
      break;
  }
}

const serializer = middleware([globalSelector, stringify]);

const stylis = (css: string) => serialize(compile(css), serializer);

export function preprocessor(selector: string, cssText: string) {
  if (selector.startsWith('.nought_runtime_layer')) {
    return cssText.replace(' {}', ';').replace('{}', ';');
  }
  if (cssText.startsWith('@keyframes')) {
    if (cssText.includes('nought_global_')) {
      return stylis(cssText.replace('nought_global_', ''));
    }
    return stylis(cssText.replace('@keyframes', `@keyframes ${selector}`));
  }
  return stylis(`${selector}{${cssText}}`);
}
