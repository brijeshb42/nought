import { createGlobalThemeContract } from '@nought/css';

export const globalTheme = createGlobalThemeContract({
  size: {
    maxWidth: 'string',
  },
  borderRadius: 'string',
  font: {
    mono: 'string',
  },
  palette: {
    primary: {
      main: 'string',
    },
    foregroundRgb: 'string',
    background: {
      default: 'string',
      startRgb: 'string',
      endRgb: 'string',
    },
    glow: {
      primary: 'string',
      secondary: 'string',
    },
    tile: {
      startRgb: 'string',
      endRgb: 'string',
      border: 'string',
    },
    callout: {
      baseRgb: 'string',
      borderRgb: 'string',
    },
    card: {
      baseRgb: 'string',
      borderRgb: 'string',
    },
  },
  typography: {
    medium: {
      weight: 'string',
    },
  },
});
