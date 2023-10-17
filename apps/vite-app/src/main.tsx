import { createRoot } from 'react-dom/client';
import { style, createGlobalTheme, globalStyle } from '@nought/css';
import { THEME_CONTRACT } from '@nought/ui';
import { baseLayer, utilsLayer } from './layers';
import { App } from './App';

const defaultStyle = style({
  backgroundColor: THEME_CONTRACT.palette.background.default,
  color: THEME_CONTRACT.palette.primary.main,
  '@layer': {
    [baseLayer]: {
      color: 'red',
    },
    [utilsLayer]: {
      color: 'blue',
    },
  },
});

createGlobalTheme(':root', THEME_CONTRACT, {
  typography: {
    medium: {
      weight: '500',
    },
  },
  palette: {
    primary: {
      main: '#0088cc',
    },
    background: {
      default: '#ffffff',
    },
  },
});

globalStyle('html', {
  margin: 0,
  padding: 0,
});

const el = document.getElementById('root') as HTMLElement;
document.documentElement.classList.add(defaultStyle);

const root = createRoot(el);
root.render(<App />);
