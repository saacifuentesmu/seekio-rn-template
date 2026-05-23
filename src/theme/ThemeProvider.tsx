import React, {createContext, useContext} from 'react';

import {palette, Palette} from './palette';
import {spacing, Spacing} from './spacing';
import {typography, Typography} from './typography';

export interface Theme {
  palette: Palette;
  spacing: Spacing;
  typography: Typography;
}

const defaultTheme: Theme = {palette, spacing, typography};

const ThemeContext = createContext<Theme>(defaultTheme);

export const ThemeProvider: React.FC<{children: React.ReactNode; theme?: Theme}> = ({
  children,
  theme = defaultTheme,
}) => <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;

export const useTheme = (): Theme => useContext(ThemeContext);
