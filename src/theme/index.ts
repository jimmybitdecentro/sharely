import { Theme } from '../types/theme';
import { lightColors } from './colors';
import { darkColors } from './darkColors';
import { typography } from './typography';
import { spacing } from './spacing';
import fonts from './fonts';

export const lightTheme: Theme = {
  colors: lightColors,
  typography,
  spacing,
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
  },
  fonts: {
    regular: fonts.openSans.regular,
    medium: fonts.openSans.medium,
    semiBold: fonts.openSans.semiBold,
    bold: fonts.openSans.bold,
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
  fonts: {
    regular: fonts.openSans.regular,
    medium: fonts.openSans.medium,
    semiBold: fonts.openSans.semiBold,
    bold: fonts.openSans.bold,
  },
};
