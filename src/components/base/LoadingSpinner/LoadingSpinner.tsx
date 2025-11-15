import React from 'react';
import {View, ActivityIndicator, StyleSheet, ViewStyle} from 'react-native';
import {useTheme} from '../../../hooks/useTheme';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color,
  style,
  fullScreen = false,
}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme, fullScreen);

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator
        size={size}
        color={color || theme.colors.primary}
      />
    </View>
  );
};

const createStyles = (theme: any, fullScreen: boolean) =>
  StyleSheet.create({
    container: {
      ...(fullScreen && {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: fullScreen ? 'rgba(0, 0, 0, 0.3)' : 'transparent',
    },
  });

export default LoadingSpinner;

