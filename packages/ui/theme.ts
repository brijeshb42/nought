import { createGlobalThemeContract } from '@nought/css';

export const THEME_CONTRACT = createGlobalThemeContract({
  typography: {
    medium: {
      weight: 'string',
    },
  },
  palette: {
    primary: {
      main: 'string',
    },
    background: {
      default: 'string',
    },
  },
});
