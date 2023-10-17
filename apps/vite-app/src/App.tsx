import { memo, useState } from 'react';
import { Button } from '@nought/ui';

export const App = memo(function App() {
  const [isDark, setIsDark] = useState(true);

  return (
    <Button
      onClick={() => {
        setIsDark(!isDark);
      }}
    >
      Toggle Theme
    </Button>
  );
});
