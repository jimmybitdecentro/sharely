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
import { s } from '../../../theme/size';

interface DropdownProps {
    label?: string;
    placeholder?: string;
    data: { label: string; value: string }[];
    value?: string;
    onSelect: (value: string) => void;
    style?: any;
  error?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
    label,
    placeholder = 'Select...',
    data,
    value,
    onSelect,
    style,
  error,
}) => {
    const { theme } = useTheme();
  const styles = createStyles(theme, !!error);
    const [visible, setVisible] = useState(false);

    const selectedItem = data.find((item) => item.value === value);

    const handleSelect = (item: { label: string; value: string }) => {
        onSelect(item.value);
        setVisible(false);
    };

    return (
        <View style={[styles.container, style]}>
      {label && <Label text={label} variant="default" />}
            <TouchableOpacity
                style={styles.button}
                onPress={() => setVisible(true)}
                activeOpacity={0.7}>
        <Text style={[styles.buttonText, !selectedItem && styles.placeholderText]}>
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

      {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const createStyles = (theme: any, hasError: boolean = false) =>
    StyleSheet.create({
        container: {
      marginBottom: s(12),
        },
        label: {
      marginBottom: s(6),
            color: theme.colors.text,
      fontSize: s(14),
      fontFamily: theme.fonts.regular,
        },
        button: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
      backgroundColor: theme.colors.inputBg,
      borderRadius: s(30),
      paddingHorizontal: s(16),
      paddingVertical: s(12),
      height: s(48),
      borderWidth: hasError ? s(1) : 0,
      borderColor: hasError ? theme.colors.error : theme.colors.border,
        },
        buttonText: {
      fontSize: s(16),
      fontFamily: theme.fonts.regular,
            color: theme.colors.text,
        },
        placeholderText: {
            color: theme.colors.textSecondary,
        },
        icon: {
      fontSize: s(12),
            color: theme.colors.textSecondary,
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
      padding: s(20),
        },
        dropdown: {
            backgroundColor: theme.colors.background,
      borderRadius: s(12),
      maxHeight: s(300),
      padding: s(8),
        },
        item: {
      paddingVertical: s(14),
      paddingHorizontal: s(16),
      borderBottomWidth: s(1),
            borderBottomColor: theme.colors.border,
        },
        itemText: {
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

export default Dropdown;
