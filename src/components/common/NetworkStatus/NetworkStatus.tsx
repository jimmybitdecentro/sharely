import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useNetworkStatus} from '../../../hooks/useNetworkStatus';
import {useTheme} from '../../../hooks/useTheme';

const NetworkStatus: React.FC = () => {
  const {isOffline} = useNetworkStatus();
  const {theme} = useTheme();
  const styles = createStyles(theme);

  if (!isOffline) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>No internet connection</Text>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.error,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      alignItems: 'center',
    },
    text: {
      color: theme.colors.background,
      fontSize: theme.typography.caption.fontSize,
      fontWeight: '600',
    },
  });

export default NetworkStatus;

