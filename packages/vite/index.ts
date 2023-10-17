import linaria from '@linaria/vite';
import { preprocessor } from '@nought/css/preprocessor';

type LinariaOptions = Parameters<typeof linaria>[0];

export type NoughtOptions = LinariaOptions & {
  globalThemeContractPrefix?: string;
};

export function nought(options: NoughtOptions) {
  return linaria({
    preprocessor,
    ...options,
  });
}
