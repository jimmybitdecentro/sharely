import {useSelector, useDispatch} from 'react-redux';
import {RootState, AppDispatch} from '../store';
import {setTheme, toggleTheme} from '../store/slices/themeSlice';
import {lightTheme, darkTheme} from '../theme';
import {Theme} from '../types/theme';

export const useTheme = () => {
  const dispatch = useDispatch<AppDispatch>();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const theme: Theme = themeMode === 'dark' ? darkTheme : lightTheme;

  const setThemeMode = (mode: 'light' | 'dark') => {
    dispatch(setTheme(mode));
  };

  const toggleThemeMode = () => {
    dispatch(toggleTheme());
  };

  return {
    theme,
    themeMode,
    setTheme: setThemeMode,
    toggleTheme: toggleThemeMode,
    isDark: themeMode === 'dark',
  };
};

