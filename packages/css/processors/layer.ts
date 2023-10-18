import { ValueType } from '@linaria/utils';
import { BaseProcessor } from './utils/BaseProcessor';
import { FALLBACK_VAR_EVAL_TO_RUNTIME_MAP } from './utils/BaseVarProcessor';
import { parseAsObjectExpression } from './utils/style';
import { ObjectProperty, isIdentifier, isObjectProperty } from '@babel/types';
import { Params, TailProcessorParams, ValueCache } from '@linaria/tags';

export class LayerProcessor extends BaseProcessor {
  isGlobal = this.tagSource.imported === 'globalLayer';
  layerName = '';

  constructor(params: Params, ...args: TailProcessorParams) {
    super(params, ...args);

    this.generateLayer();
  }

  private generateLayer() {
    let layerName = '';
    const [parentOrBase, maybeBase] = this.callParams;
    if (this.isGlobal) {
      if (
        this.callParams.length === 1 &&
        parentOrBase.kind !== ValueType.CONST
      ) {
        throw parentOrBase.buildCodeFrameError(
          'The layer name passed as the 1st argument should be a static string, intead receive a variable.'
        );
      }
    }
    if (parentOrBase.kind === ValueType.CONST) {
      const baseName = parentOrBase.value as string;
      const key = `${this.context.filename ?? ''}:${this.displayName}:${
        this.isGlobal
      }`;
      const value = this.isGlobal ? baseName : `${baseName}__${this.className}`;
      FALLBACK_VAR_EVAL_TO_RUNTIME_MAP.set(key, value);
      layerName = value;
    } else if (
      parentOrBase.kind === ValueType.LAZY &&
      maybeBase?.kind === ValueType.CONST
    ) {
      try {
        const expression = parseAsObjectExpression(parentOrBase.source);
        const parent = expression.properties.find((item) => {
          if (!isObjectProperty(item)) {
            return false;
          }
          const { key, value } = item;
          if (!isIdentifier(key)) {
            return false;
          }
          if (key.name !== 'parent') {
            return false;
          }
          return true;
        }) as ObjectProperty | undefined;
        if (!parent) {
          throw parentOrBase.buildCodeFrameError(
            'No "parent" property found in the 1st argument object".'
          );
        }
        const { value: parentValue } = parent;
        if (!isIdentifier(parentValue)) {
          throw parentOrBase.buildCodeFrameError(
            'The value of the parent layer should be first created and then passed in the "parent" key.'
          );
        }
        const mapGetKey = `${this.context.filename ?? ''}:${parentValue.name}:${
          this.isGlobal
        }`;
        const parentLayer = FALLBACK_VAR_EVAL_TO_RUNTIME_MAP.get(mapGetKey);
        if (!parentLayer) {
          throw parentOrBase.buildCodeFrameError(
            `The parent layer should be created in the same file and then passed to ${this.tagSource.imported}.`
          );
        }
        const value = this.isGlobal
          ? `${maybeBase.value}.${parentLayer}`
          : `${maybeBase.value}__${this.className}.${parentLayer}`;
        const mapSetKey = `${this.context.filename ?? ''}:${this.displayName}:${
          this.isGlobal
        }`;
        FALLBACK_VAR_EVAL_TO_RUNTIME_MAP.set(mapSetKey, value);
        layerName = value;
      } catch (ex) {
        throw parentOrBase.buildCodeFrameError(
          (ex as Error).message ??
            'Please pass an object with only "parent" key referring to the parent layer in the same file.'
        );
      }
    } else {
      throw parentOrBase.buildCodeFrameError(
        'Nested layers should be created in the same file as in the parent layer.'
      );
    }
    if (!layerName) {
      throw parentOrBase.buildCodeFrameError(
        "Couldn't generate the layer name for the passed arguments."
      );
    }
    this.layerName = layerName;

    if (!this.layerName) {
      throw parentOrBase.buildCodeFrameError(
        "Couldn't generate the layer name for the passed arguments."
      );
    }
  }

  doEvaltimeReplacement() {
    this.replacer(this.astService.stringLiteral(this.layerName), false);
  }

  build(values: ValueCache) {
    const layer = `@layer ${this.layerName} {}`;
    super.build(values, layer, `.nought_runtime_layer-${this.className}`);
  }

  doRuntimeReplacement() {
    this.replacer(this.astService.stringLiteral(this.layerName), false);
  }
}
