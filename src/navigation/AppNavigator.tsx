import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from '../types/navigation';
import {useSelector} from 'react-redux';
import {RootState} from '../store';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import OnboardingNavigator from './OnboardingNavigator';
import {storageService} from '../services/storage/storageService';
import LoadingSpinner from '../components/base/LoadingSpinner/LoadingSpinner';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Check if user has seen onboarding (you can store this in AsyncStorage)
        const hasSeenOnboardingValue = await storageService.getItem<boolean>('@sharely:has_seen_onboarding');
        setHasSeenOnboarding(hasSeenOnboardingValue || isAuthenticated);
      } catch (error) {
        console.error('Error initializing navigation:', error);
        setHasSeenOnboarding(isAuthenticated);
      } finally {
        setIsInitializing(false);
      }
    };
    initialize();
  }, [isAuthenticated]);

  if (isInitializing) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: {backgroundColor: '#FFFFFF'},
        }}>
        {!isAuthenticated ? (
          hasSeenOnboarding ? (
            <Stack.Screen name="Auth" component={AuthNavigator} />
          ) : (
            <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
          )
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

