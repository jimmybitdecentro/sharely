import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Label from '../../base/Label/Label';
import {useTheme} from '../../../hooks/useTheme';
import {Theme} from '../../../types/theme';
import {s} from '../../../theme/size';
import {images} from '../../../theme/images';

const GRADIENT_COLORS = ['#2C73D2', '#1A88B3', '#23C28C'];

interface EmptyStateProps {
  title?: string;
  message?: string;
  imageSource?: any;
  actionText?: string;
  onAction?: () => void;
  style?: object;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No data yet',
  message = 'Check back later',
  imageSource,
  actionText,
  onAction,
  style,
}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.container, style]}>
      <Image source={imageSource || images.link} style={styles.image} />

      <Label
        text={title}
        size={18}
        weight="semiBold"
        color="#666666"
        style={styles.title}
      />

      <Label
        text={message}
        size={14}
        color="#AAAAAA"
        style={styles.message}
      />

      {actionText && onAction && (
        <TouchableOpacity onPress={onAction} activeOpacity={0.8}>
          <LinearGradient
            colors={GRADIENT_COLORS}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.actionButton}>
            <Label text={actionText} size={14} weight="semiBold" color="#FFFFFF" />
          </LinearGradient>
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
      paddingVertical: s(60),
      paddingHorizontal: s(24),
    },
    image: {
      width: s(80),
      height: s(80),
      resizeMode: 'contain',
      marginBottom: s(24),
      opacity: 0.5,
    },
    title: {
      marginBottom: s(8),
      textAlign: 'center',
    },
    message: {
      textAlign: 'center',
      lineHeight: s(20),
    },
    actionButton: {
      marginTop: s(24),
      paddingVertical: s(12),
      paddingHorizontal: s(32),
      borderRadius: s(24),
    },
  });

export default EmptyState;

