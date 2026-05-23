import {
  DarkTheme,
  DefaultTheme,
  Theme as NavTheme,
} from '@react-navigation/native';
import {useMemo} from 'react';

import {useTheme} from './ThemeProvider';

// Maps the app palette onto React Navigation's theme so headers, the tab bar,
// and the container background follow the selected palette / scheme.
export function useNavigationTheme(): NavTheme {
  const {palette, scheme} = useTheme();

  return useMemo<NavTheme>(() => {
    const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: palette.primary,
        background: palette.background,
        card: palette.surface,
        text: palette.text,
        border: palette.border,
      },
    };
  }, [palette, scheme]);
}
