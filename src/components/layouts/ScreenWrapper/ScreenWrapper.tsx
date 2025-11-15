import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import Container from '../Container/Container';
import LoadingSpinner from '../../base/LoadingSpinner/LoadingSpinner';
import NetworkStatus from '../../common/NetworkStatus/NetworkStatus';
import ErrorBoundary from '../../common/ErrorBoundary/ErrorBoundary';

interface ScreenWrapperProps {
  children: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  style?: ViewStyle;
  showNetworkStatus?: boolean;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  loading = false,
  error = null,
  style,
  showNetworkStatus = true,
}) => {
  return (
    <ErrorBoundary>
      <Container style={style}>
        {showNetworkStatus && <NetworkStatus />}
        {loading ? <LoadingSpinner fullScreen /> : children}
        {error && <ErrorView error={error} />}
      </Container>
    </ErrorBoundary>
  );
};

interface ErrorViewProps {
  error: string;
}

const ErrorView: React.FC<ErrorViewProps> = ({error}) => {
  const styles = StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: '#fee',
      margin: 16,
      borderRadius: 8,
    },
    text: {
      color: '#c33',
      fontSize: 14,
    },
  });

  return (
    <View style={styles.container}>
      {/* Error text would be rendered here */}
    </View>
  );
};

export default ScreenWrapper;

