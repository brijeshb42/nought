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

const TriggerButtonContract = createGlobalThemeContract({
  borderColor: 'string',
  color: 'string',
  hoverBackground: 'string',
  hoverBorderColor: 'string',
  outlineColor: 'string',
});

const triggerButtonStyle = style({
  vars: {
    [TriggerButtonContract.borderColor]: theme.palette.grey[200],
    [TriggerButtonContract.color]: theme.palette.blue[500],
    [TriggerButtonContract.hoverBackground]: theme.palette.grey[100],
    [TriggerButtonContract.hoverBorderColor]: theme.palette.blue[400],
    [TriggerButtonContract.outlineColor]: theme.palette.blue[200],
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
  borderColor: TriggerButtonContract.borderColor,
  color: TriggerButtonContract.color,

  ':hover': {
    background: TriggerButtonContract.hoverBackground,
    borderColor: TriggerButtonContract.hoverBorderColor,
  },

  ':focus-visible': {
    borderColor: TriggerButtonContract.hoverBorderColor,
    outline: `3px solid ${TriggerButtonContract.outlineColor}`,
  },

  selectors: {
    ['[data-theme="dark"] &']: {
      vars: {
        [TriggerButtonContract.borderColor]: theme.palette.grey[800],
        [TriggerButtonContract.color]: theme.palette.blue[300],
        [TriggerButtonContract.hoverBackground]: theme.palette.grey[900],
        [TriggerButtonContract.hoverBorderColor]: theme.palette.blue[200],
        [TriggerButtonContract.outlineColor]: theme.palette.blue[500],
      },
    },
  },
});

const SnackbarContract = createGlobalThemeContract(
  {
    background: 'string',
    borderColor: 'string',
    color: 'string',
  },
  (_value, paths) => `Snackbar-${paths.join('-')}`
);

const snackBarStyle = style({
  vars: {
    [SnackbarContract.background]: theme.palette.grey[50],
    [SnackbarContract.borderColor]: theme.palette.grey[200],
    [SnackbarContract.color]: theme.palette.blue[700],
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
  backgroundColor: SnackbarContract.background,
  borderRadius: 8,
  border: `1px solid ${SnackbarContract.borderColor}`,
  boxShadow: '0 4px 8px rgb(0 0 0 / 0.1)',
  padding: '0.75rem',
  color: SnackbarContract.color,
  fontFamily: '"IBM Plex Sans", sans-serif',
  fontWeight: 500,
  animation: `${snackbarInRight} 200ms`,
  transition: 'transform 0.2s ease-out',

  selectors: {
    ['[data-theme="dark"] &']: {
      vars: {
        [SnackbarContract.background]: theme.palette.grey[900],
        [SnackbarContract.borderColor]: theme.palette.grey[700],
        [SnackbarContract.color]: theme.palette.blue[200],
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
