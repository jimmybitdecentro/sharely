import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    FlatList,
    StyleSheet,
    TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import Label from '../Label/Label';

interface DropdownProps {
    label?: string;
    placeholder?: string;
    data: { label: string; value: string }[];
    value?: string;
    onSelect: (value: string) => void;
    style?: any;
}

const Dropdown: React.FC<DropdownProps> = ({
    label,
    placeholder = 'Select...',
    data,
    value,
    onSelect,
    style,
}) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [visible, setVisible] = useState(false);

    const selectedItem = data.find((item) => item.value === value);

    const handleSelect = (item: { label: string; value: string }) => {
        onSelect(item.value);
        setVisible(false);
    };

    return (
        <View style={[styles.container, style]}>
            {label && <Label text={label} style={styles.label} />}
            <TouchableOpacity
                style={styles.button}
                onPress={() => setVisible(true)}
                activeOpacity={0.7}>
                <Text
                    style={[
                        styles.buttonText,
                        !selectedItem && styles.placeholderText,
                    ]}>
                    {selectedItem ? selectedItem.label : placeholder}
                </Text>
                <Text style={styles.icon}>▼</Text>
            </TouchableOpacity>

            <Modal visible={visible} transparent animationType="fade">
                <TouchableWithoutFeedback onPress={() => setVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.dropdown}>
                            <FlatList
                                data={data}
                                keyExtractor={(item) => item.value}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.item}
                                        onPress={() => handleSelect(item)}>
                                        <Text style={styles.itemText}>{item.label}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

const createStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            marginBottom: theme.spacing.md,
        },
        label: {
            marginBottom: theme.spacing.xs,
            color: theme.colors.text,
            fontSize: 14,
        },
        button: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#F0F0F0', // Light gray background from design
            borderRadius: theme.borderRadius.md,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.md,
            height: 50,
        },
        buttonText: {
            fontSize: 16,
            color: theme.colors.text,
        },
        placeholderText: {
            color: theme.colors.textSecondary,
        },
        icon: {
            fontSize: 12,
            color: theme.colors.textSecondary,
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            padding: theme.spacing.lg,
        },
        dropdown: {
            backgroundColor: theme.colors.background,
            borderRadius: theme.borderRadius.md,
            maxHeight: 300,
            padding: theme.spacing.xs,
        },
        item: {
            paddingVertical: theme.spacing.md,
            paddingHorizontal: theme.spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
        },
        itemText: {
            fontSize: 16,
            color: theme.colors.text,
        },
    });

export default Dropdown;
