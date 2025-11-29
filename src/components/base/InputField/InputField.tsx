import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import Label from '../Label/Label';
import { s } from '../../../theme/size';

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
  const { theme } = useTheme();
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
      marginBottom: s(12),
    },
    input: {
      borderWidth: s(1),
      borderColor: hasError ? theme.colors.error : theme.colors.border,
      borderRadius: s(30),
      paddingHorizontal: s(16),
      paddingVertical: s(12),
      fontSize: s(16),
      fontFamily: theme.fonts.regular,
      color: theme.colors.text,
      backgroundColor: theme.colors.inputBg,
      minHeight: s(48),
    },
    errorText: {
      color: theme.colors.error,
      fontSize: s(12),
      fontFamily: theme.fonts.regular,
      marginTop: s(4),
    },
  });

export default InputField;
