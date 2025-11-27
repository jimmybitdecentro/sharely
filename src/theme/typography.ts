import { Typography } from '../types/theme';
import fonts from './fonts';

export const typography: Typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    fontFamily: fonts.openSans.bold,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    fontFamily: fonts.openSans.semiBold,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    fontFamily: fonts.openSans.semiBold,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    fontFamily: fonts.openSans.regular,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    fontFamily: fonts.openSans.regular,
  },
};
