import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { s } from '../../../theme/size';

interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  style?: any;
  error?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  value,
  onChange,
  label,
  style,
  error,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.optionsContainer}>
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              style={[styles.option, isSelected && styles.optionSelected]}
              onPress={() => onChange(option.value)}
              activeOpacity={0.8}>
              <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                {isSelected && <View style={styles.selectedDot} />}
              </View>
              <Text style={styles.optionLabel}>{option.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      marginBottom: s(12),
    },
    label: {
      marginBottom: s(8),
      color: theme.colors.text,
      fontSize: s(14),
      fontFamily: theme.fonts.regular,
    },
    optionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.inputBg,
      borderRadius: s(25),
      paddingVertical: s(10),
      paddingHorizontal: s(16),
      flex: 0.48,
      height: s(48),
    },
    optionSelected: {},
    radioCircle: {
      height: s(18),
      width: s(18),
      borderRadius: s(9),
      borderWidth: s(2),
      borderColor: theme.colors.textSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: s(8),
    },
    radioCircleSelected: {
      borderColor: theme.colors.primary,
    },
    selectedDot: {
      height: s(10),
      width: s(10),
      borderRadius: s(5),
      backgroundColor: theme.colors.primary,
    },
    optionLabel: {
      fontSize: s(16),
      fontFamily: theme.fonts.regular,
      color: theme.colors.text,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: s(12),
      fontFamily: theme.fonts.regular,
      marginTop: s(4),
    },
  });

export default RadioGroup;
