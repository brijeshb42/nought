import { Params, TailProcessorParams } from '@linaria/tags';
import { BaseProcessor } from './utils/BaseProcessor';

export class CreateContainerProcessor extends BaseProcessor {
  constructor(params: Params, ...args: TailProcessorParams) {
    super(params, ...args);
    this.modifiedClassName = `container_${this.className}`;
  }
}
