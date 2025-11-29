import React from 'react';
import { Text, StyleSheet, TextStyle,  } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { useLanguage } from '../../../hooks/useLanguage';
import { s } from '../../../theme/size';
import { Colors } from '../../../types/theme';

interface TextCustomProps {
  text: string;
  size?: number;
  fontFamily?: 'regular' | 'medium' | 'bold';
  style?: TextStyle;
  mb?: number;
  color?: keyof Colors;
  useTranslation?: boolean;
}

const TextCustom: React.FC<TextCustomProps> = ({
  text,
  size = 12,
  style,
  fontFamily = 'regular',
  mb = 0,
  useTranslation = true,
  color = 'text',
}) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const styles = createStyles(theme, fontFamily, size, mb, color);

  const displayText = useTranslation ? t(text) : text;

  return <Text style={[styles.label, style,
    { fontFamily: theme.fonts.regular}]}
    >
      {displayText}</Text>;
};

const createStyles = (theme: any, fontFamily: 'regular' | 'medium' | 'bold', size: number, mb: number, color: keyof Colors) =>
  StyleSheet.create({
    label: {
      fontSize: size? s(size) : s(14),
      fontFamily: fontFamily  === 'bold' ?  theme.fonts.bold: fontFamily === 'medium' ? theme.fonts.medium : theme.fonts.regular,
      fontWeight: fontFamily,
      color: color ? theme.colors[color] : theme.colors.black,
      marginBottom: mb ? s(mb) : 0,
    },
  });

export default TextCustom;
