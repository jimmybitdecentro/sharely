import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Label from '../../base/Label/Label';
import {useTheme} from '../../../hooks/useTheme';
import {Theme} from '../../../types/theme';
import {s} from '../../../theme/size';
import {images} from '../../../theme/images';

interface ErrorViewProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
  imageSource?: any;
  style?: object;
}

const ErrorView: React.FC<ErrorViewProps> = ({
  title = 'Something went wrong',
  message = 'Please try again later',
  onRetry,
  retryText = 'Tap to retry',
  imageSource,
  style,
}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.container, style]}>
      <Image source={imageSource || images.announcement} style={styles.image} />

      <Label
        text={title}
        size={18}
        weight="semiBold"
        color="#1A1A1A"
        style={styles.title}
      />

      <Label
        text={message}
        size={14}
        color="#888888"
        style={styles.message}
      />

      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          style={styles.retryButton}
          activeOpacity={0.7}>
          <Label
            text={`↻ ${retryText}`}
            size={14}
            weight="medium"
            color="#23C28C"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: s(40),
      paddingHorizontal: s(24),
    },
    image: {
      width: s(80),
      height: s(80),
      resizeMode: 'contain',
      marginBottom: s(20),
      opacity: 0.7,
    },
    title: {
      marginBottom: s(8),
      textAlign: 'center',
    },
    message: {
      textAlign: 'center',
      lineHeight: s(20),
    },
    retryButton: {
      alignItems: 'center',
      marginTop: s(20),
      paddingVertical: s(10),
      paddingHorizontal: s(20),
      backgroundColor: '#F0FFF7',
      borderRadius: s(20),
    },
  });

export default ErrorView;

