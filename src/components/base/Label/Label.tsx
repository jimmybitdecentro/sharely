import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { useLanguage } from '../../../hooks/useLanguage';
import { s } from '../../../theme/size';

interface LabelProps {
  text: string;
  variant?: 'default' | 'heading' | 'subtitle';
  style?: TextStyle;
  useTranslation?: boolean;
}

const Label: React.FC<LabelProps> = ({
  text,
  variant = 'default',
  style,
  useTranslation = true,
}) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const styles = createStyles(theme, variant);

  const displayText = useTranslation ? t(text) : text;

  return <Text style={[styles.label, style]}>{displayText}</Text>;
};

const createStyles = (theme: any, variant: 'default' | 'heading' | 'subtitle') =>
  StyleSheet.create({
    label: {
      fontSize:
        variant === 'heading'
          ? s(24)
          : variant === 'subtitle'
          ? s(20)
          : s(14),
      fontFamily:
        variant === 'heading'
          ? theme.fonts.bold
          : variant === 'subtitle'
          ? theme.fonts.semiBold
          : theme.fonts.regular,
      color: theme.colors.text,
      marginBottom: variant === 'heading' ? s(12) : s(4),
    },
  });

export default Label;
