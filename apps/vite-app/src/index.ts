import {
  createVar,
  fallbackVar,
  style,
  styleVariants,
  createThemeContract,
  createTheme,
  createGlobalThemeContract,
  assignVars,
  fontFace,
  keyframes,
  createContainer,
  layer,
  globalLayer,
  globalKeyframes,
} from '@nought/css';

const globalBaseLayer = globalLayer('base');
const baseLayer = layer('base');
const frameworkLayer = layer('framework');
const typography = layer({ parent: frameworkLayer }, 'typography');

const rotate = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});
const globalRotate = globalKeyframes('rotate', {
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

console.log({
  globalRotate,
  globalBaseLayer,
  baseLayer,
  frameworkLayer,
  typography,
});

const containerName = createContainer();

const spin = style({
  animationName: [rotate, globalRotate],
  animationDuration: '3s',
  containerName,
  '@layer': {
    [baseLayer]: {
      color: 'red',
    },
  },
});

const vars = createGlobalThemeContract({
  color: {
    brand: '',
  },
  font: {
    body: '',
  },
  spacing: {
    zero: '',
    one: '',
    large: {
      zero: '',
    },
  },
});

const themeA = createTheme(vars, {
  color: {
    brand: 'red',
  },
  font: {
    body: '1rem',
  },
  spacing: {
    zero: '0px',
    one: '4px',
    large: {
      zero: '20',
    },
  },
});
const themeB = createTheme({
  color: {
    brand: 'red',
  },
});
const [themeBClass, vars2] = themeB;

const fontFamily = fontFace([
  {
    src: 'local("Gentium")',
    fontWeight: 'normal',
  },
  {
    src: 'local("Gentium Bold")',
    fontWeight: 'bold',
  },
]);
// console.log({ fontFamily });

const primaryColorVar = createVar();
const secondaryColorVar = createVar();
const var2 = fallbackVar(primaryColorVar, secondaryColorVar, 'blue');

const colorVar = createVar();

const colorClass = style({
  color: fallbackVar(colorVar, secondaryColorVar, 'blue'),
  fontFamily,
});

const base = style({
  padding: 10,
  color: var2,
});

const composed = style([
  base,
  {
    background: ['red', 'linear-gradient(#e66465, #9198e5)'],
    vars: {
      [primaryColorVar]: 'blue',
      [secondaryColorVar]: 'red',
    },
    ':hover': {
      color: 'red',
    },
    selectors: {
      '&:hover:not(:active)': {
        border: '2px solid aquamarine',
      },
      'nav li > &': {
        textDecoration: 'underline',
      },
    },
    '@layer': {
      '@layer': {},
    },
    '@media': {
      '(min-width: 1024px)': {
        color: 'red',

        selectors: {
          '&:hover:not(:active)': {
            color: 'red',
            border: '2px solid aquamarine',
          },
          'nav li > &': {
            textDecoration: 'underline',
          },
        },
      },
    },
  },
  {
    '@media': {
      '(min-width: 1024px)': {
        color: 'blue',

        selectors: {
          '&:hover:not(:active)': {
            border: '1px solid aquamarine',
          },
          'nav li > &': {
            textDecoration: 'none',
          },
        },
      },
    },
  },
]);

const variants = styleVariants({
  primary: [
    base,
    composed,
    {
      color: 'blue',
    },
  ],
  secondary: [
    base,
    {
      color: 'red',
    },
  ],
});

const brandText = style({
  color: vars.color.brand,
  fontFamily: vars.font.body,
});

const themeVars = createThemeContract({
  color: {
    brand: {
      main: 'string',
      mainDark: 'string',
    },
  },
});
const themeC = createTheme(themeVars, {
  color: {
    brand: {
      main: 'red',
      mainDark: 'maroon',
    },
  },
});

const responsiveTheme = style({
  vars: assignVars(vars.color, {
    brand: 'red',
  }),
  '@media': {
    'screen and (min-width: 1024px)': {
      vars: assignVars(vars.color, {
        brand: 'blue',
      }),
    },
  },
});

// console.log(
//   spin,
//   colorClass,
//   vars,
//   themeA,
//   themeBClass,
//   vars2,
//   brandText,
//   themeC,
//   responsiveTheme
// );
