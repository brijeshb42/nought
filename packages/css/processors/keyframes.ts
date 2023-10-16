import { Params, TailProcessorParams, ValueCache } from '@linaria/tags';
import { BaseProcessor } from './utils/BaseProcessor';
import {
  keyframes as vanillaKeyframes,
  globalKeyframes as vanillaGlobalKeyframes,
} from '../vanilla-extract';
import { emotion } from './utils/style';
import { ValueType } from '@linaria/utils';

export class KeyframesProcessor extends BaseProcessor {
  isGlobal = this.tagSource.imported === 'globalKeyframes';
  keyframe: string = '';

  constructor(params: Params, ...args: TailProcessorParams) {
    super(params, ...args);

    if (this.isGlobal) {
      const [keyframeName] = this.callParams;
      if (keyframeName.kind !== ValueType.CONST) {
        throw keyframeName.buildCodeFrameError(
          'First argument should always be a static string. Variable provided instead.'
        );
      }
      this.keyframe = keyframeName.value as string;
    }
  }

  get asSelector(): string {
    return this.className;
  }

  doEvaltimeReplacement() {
    if (!this.isGlobal) {
      super.doEvaltimeReplacement();
    } else {
      this.replacer(this.astService.stringLiteral(this.keyframe), false);
    }
  }

  doRuntimeReplacement(): void {
    this.doEvaltimeReplacement();
  }

  build(values: ValueCache): void {
    const evaluatedParams = this.getEvaluatedParams(values) as Parameters<
      typeof vanillaKeyframes | typeof vanillaGlobalKeyframes
    >;

    if (typeof evaluatedParams[0] === 'string') {
      const [name, rules] = evaluatedParams as Parameters<
        typeof vanillaGlobalKeyframes
      >;
      const cssCls = emotion.css({
        [`@keyframes nought_global_${name}`]: rules,
      } as any);
      const cssText = emotion.cache.registered[cssCls];
      super.build(values, cssText);
    } else {
      const [rules] = evaluatedParams as Parameters<typeof vanillaKeyframes>;
      const cssCls = emotion.css({
        '@keyframes': rules,
      } as any);
      super.build(values, emotion.cache.registered[cssCls]);
    }
  }
}
