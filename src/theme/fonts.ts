// Open Sans font family configuration
// Font files should be placed in: android/app/src/main/assets/fonts/ and ios linked via Xcode

export const fonts = {
  openSans: {
    light: 'OpenSans-Light',
    regular: 'OpenSans-Regular',
    medium: 'OpenSans-Medium',
    semiBold: 'OpenSans-SemiBold',
    bold: 'OpenSans-Bold',
    extraBold: 'OpenSans-ExtraBold',
  },
} as const;

// Helper to get font family based on weight
export const getFontFamily = (weight: '300' | '400' | '500' | '600' | '700' | '800' | 'normal' | 'bold'): string => {
  switch (weight) {
    case '300':
      return fonts.openSans.light;
    case '400':
    case 'normal':
      return fonts.openSans.regular;
    case '500':
      return fonts.openSans.medium;
    case '600':
      return fonts.openSans.semiBold;
    case '700':
    case 'bold':
      return fonts.openSans.bold;
    case '800':
      return fonts.openSans.extraBold;
    default:
      return fonts.openSans.regular;
  }
};

export default fonts;

