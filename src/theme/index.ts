import {Theme} from '../types/theme';
import {lightColors} from './colors';
import {darkColors} from './darkColors';
import {typography} from './typography';
import {spacing} from './spacing';

export const lightTheme: Theme = {
  colors: lightColors,
  typography,
  spacing,
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
  },
};

export const darkTheme: Theme = {
  colors: darkColors,
  typography,
  spacing,
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
  },
};

