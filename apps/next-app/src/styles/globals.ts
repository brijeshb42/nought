import { createGlobalTheme, globalStyle } from '@nought/css';
import { globalTheme } from './theme';

createGlobalTheme(':root ', globalTheme, {
  size: {
    maxWidth: '1100px',
  },
  borderRadius: '12px',
  font: {
    mono: "ui-monospace, Menlo, Monaco, 'Cascadia Mono', 'Segoe UI Mono', 'Roboto Mono', 'Oxygen Mono', 'Ubuntu Monospace', 'Source Code Pro', 'Fira Mono', 'Droid Sans Mono', 'Courier New', monospace",
  },
  palette: {
    primary: {
      main: '#3399FF',
    },
    foregroundRgb: '0, 0, 0',
    background: {
      default: '#141a1f',
      startRgb: '214, 219, 220',
      endRgb: '255, 255, 255',
    },
    glow: {
      primary: `conic-gradient(
        from 180deg at 50% 50%,
        #16abff33 0deg,
        #0885ff33 55deg,
        #54d6ff33 120deg,
        #0071ff33 160deg,
        transparent 360deg
      )`,
      secondary: `radial-gradient(
        rgba(255, 255, 255, 1),
        rgba(255, 255, 255, 0)
      )`,
    },
    tile: {
      startRgb: '239, 245, 249',
      endRgb: '228, 232, 233',
      border: `conic-gradient(
        #00000080,
        #00000040,
        #00000030,
        #00000020,
        #00000010,
        #00000010,
        #00000080
      )`,
    },
    callout: {
      baseRgb: '238, 240, 241',
      borderRgb: '172, 175, 176',
    },
    card: {
      baseRgb: '180, 185, 188',
      borderRgb: '131, 134, 135',
    },
  },
  typography: {
    medium: {
      weight: '500',
    },
  },
});

globalStyle(':root', {
  '@media': {
    '(prefers-color-scheme: dark)': {
      vars: {
        [globalTheme.palette.foregroundRgb]: '255, 255, 255',
        [globalTheme.palette.background.startRgb]: '0, 0, 0',
        [globalTheme.palette.background.endRgb]: '0, 0, 0',
        [globalTheme.palette.glow.primary]:
          'radial-gradient(rgba(1, 65, 255, 0.4), rgba(1, 65, 255, 0))',
        [globalTheme.palette.glow.secondary]: `linear-gradient(
          to bottom right,
          rgba(1, 65, 255, 0),
          rgba(1, 65, 255, 0),
          rgba(1, 65, 255, 0.3)
        )`,
        [globalTheme.palette.tile.startRgb]: '2, 13, 46',
        [globalTheme.palette.tile.endRgb]: '2, 5, 19',
        [globalTheme.palette.tile.border]: `conic-gradient(
          #ffffff80,
          #ffffff40,
          #ffffff30,
          #ffffff20,
          #ffffff10,
          #ffffff10,
          #ffffff80
        )`,
        [globalTheme.palette.callout.baseRgb]: '20, 20, 20',
        [globalTheme.palette.callout.borderRgb]: '108, 108, 108',
        [globalTheme.palette.card.baseRgb]: '100, 100, 100',
        [globalTheme.palette.card.borderRgb]: '200, 200, 200',
      },
    },
  },
});

globalStyle('html, body', {
  maxWidth: '100vw',
  overflowX: 'hidden',
});

globalStyle('*', {
  boxSizing: 'border-box',
  padding: 0,
  margin: 0,
});

globalStyle('a', {
  color: 'inherit',
  textDecoration: 'none',
});

globalStyle('html', {
  '@media': {
    '(prefers-color-scheme: dark)': {
      colorScheme: 'dark',
    },
  },
});

globalStyle('body', {
  color: `rgb(${globalTheme.palette.foregroundRgb})`,
  background: `linear-gradient(to bottom, transparent, rgb(${globalTheme.palette.background.endRgb})) rgb(${globalTheme.palette.background.startRgb})`,
});
