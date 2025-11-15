import React, {useState} from 'react';
import {
  Image,
  View,
  StyleSheet,
  ImageStyle,
  ViewStyle,
  ActivityIndicator,
  Text,
} from 'react-native';
import {ImageSourcePropType, ImageURISource} from 'react-native';
import {useTheme} from '../../../hooks/useTheme';

interface ImageViewProps {
  source: ImageSourcePropType | ImageURISource;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
  style?: ImageStyle | ViewStyle;
  placeholder?: React.ReactNode;
  containerStyle?: ViewStyle;
}

const ImageView: React.FC<ImageViewProps> = ({
  source,
  resizeMode = 'contain',
  style,
  placeholder,
  containerStyle,
}) => {
  const {theme} = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const styles = createStyles(theme);

  const handleLoadStart = () => {
    setLoading(true);
    setError(false);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {loading && !error && (
        <View style={[styles.loadingContainer, style]}>
          {placeholder || (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          )}
        </View>
      )}
      {error && (
        <View style={[styles.errorContainer, style]}>
          <Text style={styles.errorText}>Failed to load image</Text>
        </View>
      )}
      {!error && (
        <Image
          source={source as ImageSourcePropType}
          style={[styles.image, style]}
          resizeMode={resizeMode}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
        />
      )}
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      position: 'relative',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    loadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surface,
    },
    errorContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surface,
      minHeight: 100,
    },
    errorText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.caption.fontSize,
    },
  });

export default ImageView;

