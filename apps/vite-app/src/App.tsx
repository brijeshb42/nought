import * as React from 'react';
import { useSnackbar } from '@mui/base/useSnackbar';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import {
  createGlobalTheme,
  createGlobalThemeContract,
  globalStyle,
  keyframes,
  style,
} from '@nought/css';
import { blue, grey, theme } from './theme';
import { HStack } from './containers/HStack';

createGlobalTheme(':root', theme, {
  palette: {
    grey,
    blue,
  },
});

globalStyle('[data-theme="dark"]', {
  color: theme.palette.grey[50],
  backgroundColor: theme.palette.grey[900],
});

const snackbarInRight = keyframes({
  from: {
    transform: 'translateX(100%)',
  },
  to: {
    transform: 'translateX(0)',
  },
});

const TBVars = createGlobalThemeContract({
  borderColor: 'string',
  color: 'string',
  hoverBackground: 'string',
  hoverBorderColor: 'string',
  outlineColor: 'string',
});

const triggerButtonStyle = style({
  vars: {
    [TBVars.borderColor]: theme.palette.grey[200],
    [TBVars.color]: theme.palette.blue[500],
    [TBVars.hoverBackground]: theme.palette.grey[100],
    [TBVars.hoverBorderColor]: theme.palette.blue[400],
    [TBVars.outlineColor]: theme.palette.blue[200],
  },
  fontFamily: 'IBM Plex Sans, sans-serif',
  fontSize: '0.875rem',
  fontWeight: '600',
  boxSizing: 'border-box',
  borderRadius: '8px',
  padding: '8px 16px',
  lineHeight: '1.5',
  background: 'transparent',
  cursor: 'pointer',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: TBVars.borderColor,
  color: TBVars.color,

  ':hover': {
    background: TBVars.hoverBackground,
    borderColor: TBVars.hoverBorderColor,
  },

  ':focus-visible': {
    borderColor: TBVars.hoverBorderColor,
    outline: `3px solid ${TBVars.outlineColor}`,
  },

  selectors: {
    ['[data-theme="dark"] &']: {
      vars: {
        [TBVars.borderColor]: theme.palette.grey[800],
        [TBVars.color]: theme.palette.blue[300],
        [TBVars.hoverBackground]: theme.palette.grey[900],
        [TBVars.hoverBorderColor]: theme.palette.blue[200],
        [TBVars.outlineColor]: theme.palette.blue[500],
      },
    },
  },
});

const SnackBarVars = createGlobalThemeContract(
  {
    background: 'string',
    borderColor: 'string',
    color: 'string',
  },
  (_value, paths) => `Snackbar-${paths.join('-')}`
);

const snackBarStyle = style({
  vars: {
    [SnackBarVars.background]: theme.palette.grey[50],
    [SnackBarVars.borderColor]: theme.palette.grey[200],
    [SnackBarVars.color]: theme.palette.blue[700],
  },
  position: 'fixed',
  zIndex: 5,
  display: 'flex',
  right: 16,
  bottom: 16,
  left: 'auto',
  justifyContent: 'start',
  maxWidth: 560,
  minWidth: 300,
  backgroundColor: SnackBarVars.background,
  borderRadius: 8,
  border: `1px solid ${SnackBarVars.borderColor}`,
  boxShadow: '0 4px 8px rgb(0 0 0 / 0.1)',
  padding: '0.75rem',
  color: SnackBarVars.color,
  fontFamily: '"IBM Plex Sans", sans-serif',
  fontWeight: 500,
  animation: `${snackbarInRight} 200ms`,
  transition: 'transform 0.2s ease-out',

  selectors: {
    ['[data-theme="dark"] &']: {
      vars: {
        [SnackBarVars.background]: theme.palette.grey[900],
        [SnackBarVars.borderColor]: theme.palette.grey[700],
        [SnackBarVars.color]: theme.palette.blue[200],
      },
      boxShadow: '0 4px 8px rgb(0 0 0 / 0.7)',
    },
  },
});

export function App() {
  const [isDark, setIsDark] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const { getRootProps, onClickAway } = useSnackbar({
    onClose: handleClose,
    open,
    autoHideDuration: 15000,
  });

  const handleOpen = () => {
    setOpen(true);
  };

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isDark]);

  return (
    <div>
      <HStack gap={5}>
        <button
          className={triggerButtonStyle}
          type="button"
          onClick={() => {
            setIsDark(!isDark);
          }}
        >
          Toggle Theme
        </button>
        <button
          className={triggerButtonStyle}
          type="button"
          onClick={handleOpen}
        >
          Open snackbar
        </button>
      </HStack>
      {open ? (
        <ClickAwayListener onClickAway={onClickAway}>
          <div {...getRootProps()} className={snackBarStyle}>
            Hello World
          </div>
        </ClickAwayListener>
      ) : null}
    </div>
  );
}
