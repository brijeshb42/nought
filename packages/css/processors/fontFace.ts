import { ValueCache } from '@linaria/tags';
import { BaseProcessor } from './utils/BaseProcessor';
import { fontFace } from '../vanilla-extract';
import { emotion } from './utils/style';

export class FontFaceProcessor extends BaseProcessor {
  isGlobal = false;

  build(values: ValueCache): void {
    const [fontFaceRule] = this.getEvaluatedParams(values) as Parameters<
      typeof fontFace
    >;
    const rules = Array.isArray(fontFaceRule) ? fontFaceRule : [fontFaceRule];
    const fontFaces = rules.map((item) => ({
      ...item,
      fontFamily: this.className,
    }));
    fontFaces.forEach((item, index) => {
      const cls = emotion.css({
        '@font-face': item,
      });
      const cssText = emotion.cache.registered[cls];
      super.build(values, cssText, `${this.className}__${index}`);
    });
  }
}
