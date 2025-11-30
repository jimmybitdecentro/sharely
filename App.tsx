import React, {useEffect, useState} from 'react';
import {Provider} from 'react-redux';
import {StatusBar, StyleSheet, Platform} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import {store} from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/common/ErrorBoundary/ErrorBoundary';
import {storageService} from './src/services/storage/storageService';
import {setCredentials} from './src/store/slices/authSlice';
import {setTheme} from './src/store/slices/themeSlice';
import i18n from './src/i18n';
import {useTheme} from './src/hooks/useTheme';
import {User} from './src/types';

const AppContent: React.FC = () => {
  const {theme, themeMode} = useTheme();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize app - load saved auth and theme
    const initializeApp = async () => {
      try {
        // Load saved theme
        const savedTheme = await storageService.getTheme();
        if (savedTheme) {
          store.dispatch(setTheme(savedTheme as 'light' | 'dark'));
        }

        // Load saved language
        const savedLanguage = await storageService.getLanguage();
        if (savedLanguage) {
          await i18n.changeLanguage(savedLanguage);
        }

        // Load saved auth token
        const token = await storageService.getAuthToken();
        const user = await storageService.getUserData<User>();
        if (token && user) {
          store.dispatch(setCredentials({token, user}));
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, []);

  if (!isInitialized) {
    return null; // You can show a splash screen here
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
});

export default App;

