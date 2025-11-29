import React, {useState, useEffect} from 'react';
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
  source?: ImageSourcePropType | ImageURISource;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
  style?: ImageStyle | ViewStyle;
  placeholder?: React.ReactNode;
  containerStyle?: ViewStyle;
}

// Helper function to check if source is valid
const isValidSource = (source?: ImageSourcePropType | ImageURISource): boolean => {
  if (!source) return false;
  
  // If it's a number (require()), it's valid
  if (typeof source === 'number') return true;
  
  // If it's an object with uri property
  if (typeof source === 'object' && 'uri' in source) {
    return !!source.uri && source.uri.trim().length > 0;
  }
  
  // If it's an array, check if any source is valid
  if (Array.isArray(source)) {
    return source.some(s => isValidSource(s));
  }
  
  return true;
};

// Helper function to check if source is a local image (require())
const isLocalImage = (source?: ImageSourcePropType | ImageURISource): boolean => {
  return typeof source === 'number';
};

const ImageView: React.FC<ImageViewProps> = ({
  source,
  resizeMode = 'contain',
  style,
  placeholder,
  containerStyle,
}) => {
  const {theme} = useTheme();
  const sourceValid = isValidSource(source);
  const isLocal = isLocalImage(source);
  
  // For local images, start with loading false since they load synchronously
  // For remote images, start with loading true
  const [loading, setLoading] = useState(isLocal ? false : true);
  const [error, setError] = useState(false);
  const styles = createStyles(theme);

  // Check if source is valid on mount and when source changes
  useEffect(() => {
    const valid = isValidSource(source);
    const local = isLocalImage(source);
    
    if (!valid) {
      setLoading(false);
      setError(true);
    } else {
      // Reset states when source changes
      setError(false);
      // Local images don't need loading state, remote images do
      setLoading(local ? false : true);
    }
  }, [source]);

  // Fallback timeout for remote images in case load events don't fire
  useEffect(() => {
    if (!sourceValid || isLocal || error) return;
    
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 10000); // 10 second timeout
    
    return () => clearTimeout(timeout);
  }, [sourceValid, isLocal, error]);

  const handleLoadStart = () => {
    setLoading(true);
    setError(false);
  };

  const handleLoad = () => {
    // This fires for both local and remote images when they're loaded
    setLoading(false);
    setError(false);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  if (!sourceValid) {
    return (
      <View style={[styles.container, containerStyle]}>
        {placeholder || (
          <View style={[styles.errorContainer, style]}>
            <Text style={styles.errorText}>No image source</Text>
          </View>
        )}
      </View>
    );
  }

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
      {!error && sourceValid && (
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

