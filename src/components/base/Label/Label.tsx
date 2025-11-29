import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { useLanguage } from '../../../hooks/useLanguage';
import { s } from '../../../theme/size';

type FontWeight = 'regular' | 'medium' | 'semiBold' | 'bold';

interface LabelProps {
  text: string;
  size?: number;
  color?: string;
  weight?: FontWeight;
  style?: TextStyle;
  numberOfLines?: number;
  useTranslation?: boolean;
}

const Label: React.FC<LabelProps> = ({
  text,
  size = 14,
  color,
  weight = 'regular',
  style,
  numberOfLines,
  useTranslation = false,
}) => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const fontFamily = {
    regular: theme.fonts.regular,
    medium: theme.fonts.medium,
    semiBold: theme.fonts.semiBold,
    bold: theme.fonts.bold,
  }[weight];

  const labelStyle: TextStyle = {
    fontSize: s(size),
    fontFamily,
    color: color || theme.colors.text,
  };

  const displayText = useTranslation ? t(text) : text;

  return (
    <Text style={[labelStyle, style]} numberOfLines={numberOfLines}>
      {displayText}
    </Text>
  );
};

export default Label;
