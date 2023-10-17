import { memo } from 'react';
import clsx from 'clsx';
import { style } from '@nought/css';

import { THEME_CONTRACT } from './theme';

type ButtonProps = JSX.IntrinsicElements['button'];

const base = style({
  color: THEME_CONTRACT.palette.primary.main,
  backgroundColor: ['transparent', THEME_CONTRACT.palette.background.default],
  fontWeight: THEME_CONTRACT.typography.medium.weight,
  border: `1px solid #ccc`,
  borderRadius: 2,
});

export const Button = memo<ButtonProps>(function Button({
  className,
  ...rest
}) {
  return <button type="submit" className={clsx(className, base)} {...rest} />;
});
