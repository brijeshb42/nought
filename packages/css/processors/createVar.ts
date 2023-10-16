import {
  BaseVarProcessor,
  FALLBACK_VAR_EVAL_TO_RUNTIME_MAP,
} from './utils/BaseVarProcessor';

export class CreateVarProcessor extends BaseVarProcessor {
  doEvaltimeReplacement() {
    super.doEvaltimeReplacement();
    if (this.tagSource.imported !== 'createVar') {
      return;
    }
    const key = `${this.context.filename ?? ''}:${this.displayName}`;
    FALLBACK_VAR_EVAL_TO_RUNTIME_MAP.set(key, this.variableName);
  }
}
