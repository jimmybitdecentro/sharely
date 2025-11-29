import React from 'react';
import { View, StyleSheet, ViewStyle, SafeAreaView, ImageBackground, ImageSourcePropType, Platform } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { s } from '../../../theme/size';

// Import images
const allBg = require('../../../assets/images/allBg.png');

interface ContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  safeArea?: boolean;
  backgroundImage?: ImageSourcePropType;
}

const Container: React.FC<ContainerProps> = ({
  children,
  style,
  safeArea = true,
  backgroundImage = allBg
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const content = (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
      <View style={[styles.container, style]}>
        {children}
      </View>
    </ImageBackground>
  );

  if (safeArea) {
    return (
      <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
        <SafeAreaView style={styles.safeArea}>
          <View style={[styles.container, style]}>
            {children}
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return content;
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    backgroundImage: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    safeArea: {
      flex: 1,
      // Removed background color to show image
    },
    container: {
      flex: 1,
      // paddingTop: Platform.OS === 'android' ? s(20) : 0,
      paddingHorizontal: Platform.OS === 'android' ? s(20) : 0,
      // Removed background color to show image
    },
  });

export default Container;

