import React, {useEffect, useState} from 'react';
import {Provider} from 'react-redux';
import {StatusBar, StyleSheet, Platform, View, ActivityIndicator} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import {store} from './src/store';
import {useAppDispatch} from './src/store/hooks';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/common/ErrorBoundary/ErrorBoundary';
import {storageService} from './src/services/storage/storageService';
import {restoreSession} from './src/store/slices/authSlice';
import {setTheme} from './src/store/slices/themeSlice';
import {googleAuthService} from './src/services/auth/googleAuthService';
import i18n from './src/i18n';

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize app - load saved auth and theme
    const initializeApp = async () => {
      try {
        // Initialize Google Sign-In
        try {
          await googleAuthService.initialize();
        } catch (error) {
          console.warn('Failed to initialize Google Sign-In:', error);
          // Continue even if Google Sign-In initialization fails
        }

        // Load saved theme
        const savedTheme = await storageService.getTheme();
        if (savedTheme) {
          dispatch(setTheme(savedTheme as 'light' | 'dark'));
        }

        // Load saved language
        const savedLanguage = await storageService.getLanguage();
        if (savedLanguage) {
          await i18n.changeLanguage(savedLanguage);
        }

        // Restore auth session (checks Firebase auth state or backend tokens)
        await dispatch(restoreSession());
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, [dispatch]);

  if (!isInitialized) {
    // Show loading indicator while initializing
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#23C28C" />
      </View>
    );
  }

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={Platform.OS === 'android'}
      />
      <AppNavigator />
      <Toast />
    </>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={styles.container}>
        <SafeAreaProvider>
          <Provider store={store}>
            <AppContent />
          </Provider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default App;
