import React, {createContext, useContext, useMemo} from 'react';
import {useColorScheme} from 'react-native';

import {useSettingsStore} from '@/store/settingsStore';

import {ColorScheme, Palette, palettes} from './palette';
import {spacing, Spacing} from './spacing';
import {typography, Typography} from './typography';

export interface Theme {
  palette: Palette;
  spacing: Spacing;
  typography: Typography;
}

const defaultTheme: Theme = {palette: palettes.default.light, spacing, typography};

const ThemeContext = createContext<Theme>(defaultTheme);

export const ThemeProvider: React.FC<{children: React.ReactNode; theme?: Theme}> = ({children, theme}) => {
  const paletteName = useSettingsStore(s => s.paletteName);
  const themeMode = useSettingsStore(s => s.themeMode);
  const systemScheme = useColorScheme();

  const computed = useMemo<Theme>(() => {
    if (theme) return theme;
    const actual: ColorScheme = themeMode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : themeMode;
    return {palette: palettes[paletteName][actual], spacing, typography};
  }, [theme, paletteName, themeMode, systemScheme]);

  return <ThemeContext.Provider value={computed}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): Theme => useContext(ThemeContext);
