import React from 'react';
import {View, StyleSheet, ViewStyle, SafeAreaView} from 'react-native';
import {useTheme} from '../../../hooks/useTheme';

interface ContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  safeArea?: boolean;
}

const Container: React.FC<ContainerProps> = ({children, style, safeArea = true}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);

  const content = <View style={[styles.container, style]}>{children}</View>;

  if (safeArea) {
    return <SafeAreaView style={styles.safeArea}>{content}</SafeAreaView>;
  }

  return content;
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });

export default Container;

