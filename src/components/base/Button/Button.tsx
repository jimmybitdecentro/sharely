import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../../hooks/useTheme';
import { s } from '../../../theme/size';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

// Gradient colors for primary button
const GRADIENT_COLORS = ['#2C73D2', '#1A88B3', '#23C28C'];

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const { theme } = useTheme();
  const isDisabled = disabled || loading;
  const styles = createStyles(theme, variant);

  const renderContent = () => (
    loading ? (
      <ActivityIndicator
        size="small"
        color={variant === 'primary' ? '#FFFFFF' : theme.colors.primary}
      />
    ) : (
      <Text style={[styles.text, textStyle]}>{title}</Text>
    )
  );

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
        style={[isDisabled && styles.disabled,
          
         style]}>
        <LinearGradient
          colors={GRADIENT_COLORS}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}>
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.button, isDisabled && styles.disabled, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}>
      {renderContent()}
    </TouchableOpacity>
  );
};

const createStyles = (theme: any, variant: 'primary' | 'secondary') =>
  StyleSheet.create({
    gradient: {
      borderRadius: s(50),
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: s(50),
    },
    button: {
      backgroundColor: theme.colors.surface,
      paddingVertical: s(14),
      paddingHorizontal: s(20),
      borderRadius: s(25),
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: s(50),
      borderWidth: s(1),
      borderColor: theme.colors.border,
    },
    disabled: {
      opacity: 0.5,
    },
    text: {
      color: variant === 'primary' ? '#FFFFFF' : theme.colors.text,
      fontSize: s(16),
      fontFamily: theme.fonts.semiBold,
    },
  });

export default Button;
