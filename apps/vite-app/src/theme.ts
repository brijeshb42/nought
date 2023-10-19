import { createGlobalThemeContract } from '@nought/css';

export const theme = createGlobalThemeContract({
  palette: {
    grey: {
      50: 'string',
      100: 'string',
      200: 'string',
      300: 'string',
      400: 'string',
      500: 'string',
      600: 'string',
      700: 'string',
      800: 'string',
      900: 'string',
    },
    blue: {
      50: 'string',
      100: 'string',
      200: 'string',
      300: 'string',
      400: 'string',
      500: 'string',
      600: 'string',
      700: 'string',
      800: 'string',
      900: 'string',
    },
  },
});

export const grey = {
  50: '#f6f8fa',
  100: '#eaeef2',
  200: '#d0d7de',
  300: '#afb8c1',
  400: '#8c959f',
  500: '#6e7781',
  600: '#57606a',
  700: '#424a53',
  800: '#32383f',
  900: '#24292f',
} as const;
export const blue = {
  50: '#F0F7FF',
  100: '#C2E0FF',
  200: '#99CCF3',
  300: '#66B2FF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
  800: '#004C99',
  900: '#003A75',
} as const;
