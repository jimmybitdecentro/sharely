import React from 'react';
import {View, TextInput, Text, StyleSheet, TextInputProps, ViewStyle} from 'react-native';
import {useTheme} from '../../../hooks/useTheme';
import Label from '../Label/Label';

interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...textInputProps
}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme, !!error);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Label text={label} variant="default" />}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={theme.colors.placeholder}
        {...textInputProps}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const createStyles = (theme: any, hasError: boolean) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
    },
    input: {
      borderWidth: 1,
      borderColor: hasError ? theme.colors.error : theme.colors.border,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text,
      backgroundColor: theme.colors.background,
      minHeight: 48,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: theme.typography.caption.fontSize,
      marginTop: theme.spacing.xs,
    },
  });

export default InputField;

