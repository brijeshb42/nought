import { style, createGlobalThemeContract, assignVars } from '@nought/css';

type HStackProps = JSX.IntrinsicElements['div'] & {
  gap?: number | string;
};

const HStackVars = createGlobalThemeContract(
  {
    gap: '',
  },
  (_value, paths) => `HStack-${paths.join('-')}`
);

const hstack = style({
  vars: assignVars(HStackVars, {
    gap: '2px',
  }),
  display: 'flex',
  flexDirection: 'row',
  gap: HStackVars.gap,
});

export function HStack({
  className,
  children,
  gap,
  style,
  ...rest
}: HStackProps) {
  return (
    <div
      className={`${hstack}${className ? ' ' + className : ''}`}
      style={{
        ...style,
        gap,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
