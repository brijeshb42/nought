import { ValueCache } from '@linaria/tags';
import { BaseProcessor } from './utils/BaseProcessor';
import { fontFace, globalFontFace } from '../vanilla-extract';
import { emotion } from './utils/style';

export class FontFaceProcessor extends BaseProcessor {
  isGlobal = this.tagSource.imported === 'globalFontFace';

  doEvaltimeReplacement(): void {
    if (this.isGlobal) {
      this.replacer(this.astService.stringLiteral(''), false);
    } else {
      super.doEvaltimeReplacement();
    }
  }

  doRuntimeReplacement(): void {
    this.doEvaltimeReplacement();
  }

  buildRules(
    values: ValueCache,
    rule: Parameters<typeof fontFace>[0],
    fontFamily?: string
  ) {
    const rules = Array.isArray(rule) ? rule : [rule];
    const fontFaces = rules.map((item) => ({
      ...item,
      fontFamily: fontFamily ?? this.className,
    }));
    fontFaces.forEach((item, index) => {
      const cls = emotion.css({
        '@font-face': item,
      });
      const cssText = emotion.cache.registered[cls];
      super.build(values, cssText, `${this.className}__${index}`);
    });
  }

  build(values: ValueCache): void {
    const params = this.getEvaluatedParams(values) as Parameters<
      typeof fontFace | typeof globalFontFace
    >;

    if (typeof params[0] === 'string') {
      const [globalFontFamily, globalRules] = params as Parameters<
        typeof globalFontFace
      >;
      this.buildRules(values, globalRules, globalFontFamily);
    } else {
      const [fontFaceRule] = params as Parameters<typeof fontFace>;
      this.buildRules(values, fontFaceRule);
    }
  }
}
