import React, {createContext, useContext, ReactNode} from 'react';
import {useTheme as useReduxTheme} from '../hooks/useTheme';
import {Theme} from '../types/theme';

interface ThemeContextType {
  theme: Theme;
  themeMode: 'light' | 'dark';
  setTheme: (mode: 'light' | 'dark') => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const themeHook = useReduxTheme();

  return (
    <ThemeContext.Provider value={themeHook}>{children}</ThemeContext.Provider>
  );
};

export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return context;
};

