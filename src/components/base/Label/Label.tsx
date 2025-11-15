import React from 'react';
import {Text, StyleSheet, TextStyle} from 'react-native';
import {useTheme} from '../../../hooks/useTheme';
import {useLanguage} from '../../../hooks/useLanguage';

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
  const {theme} = useTheme();
  const {t} = useLanguage();
  const styles = createStyles(theme, variant);

  const displayText = useTranslation ? t(text) : text;

  return <Text style={[styles.label, style]}>{displayText}</Text>;
};

const createStyles = (theme: any, variant: 'default' | 'heading' | 'subtitle') =>
  StyleSheet.create({
    label: {
      fontSize:
        variant === 'heading'
          ? theme.typography.h2.fontSize
          : variant === 'subtitle'
          ? theme.typography.h3.fontSize
          : theme.typography.body.fontSize,
      fontWeight:
        variant === 'heading'
          ? theme.typography.h2.fontWeight
          : variant === 'subtitle'
          ? theme.typography.h3.fontWeight
          : theme.typography.body.fontWeight,
      color: theme.colors.text,
      marginBottom: variant === 'heading' ? theme.spacing.md : theme.spacing.xs,
    },
  });

export default Label;

