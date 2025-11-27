import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';

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
}

const RadioGroup: React.FC<RadioGroupProps> = ({
    options,
    value,
    onChange,
    label,
    style,
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
                            style={[
                                styles.option,
                                isSelected && styles.optionSelected,
                            ]}
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
        </View>
    );
};

const createStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            marginBottom: theme.spacing.md,
        },
        label: {
            marginBottom: theme.spacing.sm,
            color: theme.colors.text,
            fontSize: 14,
        },
        optionsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        option: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#F0F0F0', // Light gray background
            borderRadius: 25, // Pill shape
            paddingVertical: theme.spacing.sm,
            paddingHorizontal: theme.spacing.lg,
            flex: 0.48, // Almost half width
        },
        optionSelected: {
            // Optional: change background if selected, design shows same background
        },
        radioCircle: {
            height: 20,
            width: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: theme.colors.textSecondary,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: theme.spacing.sm,
        },
        radioCircleSelected: {
            borderColor: theme.colors.primary,
        },
        selectedDot: {
            height: 10,
            width: 10,
            borderRadius: 5,
            backgroundColor: theme.colors.primary,
        },
        optionLabel: {
            fontSize: 16,
            color: theme.colors.text,
        },
    });

export default RadioGroup;
