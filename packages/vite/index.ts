import linaria from '@linaria/vite';
import { preprocessor } from '@nought/css/preprocessor';

export type NoughtOptions = Parameters<typeof linaria>[0];

export function nought(options: NoughtOptions) {
  return linaria({
    preprocessor,
    ...options,
  });
}
