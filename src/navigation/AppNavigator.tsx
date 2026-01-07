import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import MainNavigator from './MainNavigator';
import OnboardingNavigator from './OnboardingNavigator';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import EditProfileFormScreen from '../screens/profile/EditProfileFormScreen';
import PreferencesScreen from '../screens/profile/PreferencesScreen';
import ReferralScreen from '../screens/profile/ReferralScreen';
import TransactionsScreen from '../screens/wallet/TransactionsScreen';
import HelpSupportScreen from '../screens/profile/HelpSupportScreen';
import NotificationsScreen from '../screens/home/NotificationsScreen';
import YouTubeMetricsScreen from '../screens/profile/YouTubeMetricsScreen';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#FFFFFF' },
        }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainNavigator} />
            <Stack.Screen
              name="ProfileModal"
              component={ProfileScreen}
              options={{
                presentation: 'card',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="EditProfileModal"
              component={EditProfileScreen}
              options={{
                presentation: 'card',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="EditProfileFormModal"
              component={EditProfileFormScreen}
              options={{
                presentation: 'card',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="PreferencesModal"
              component={PreferencesScreen}
              options={{
                presentation: 'card',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="ReferralModal"
              component={ReferralScreen}
              options={{
                presentation: 'card',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="TransactionsModal"
              component={TransactionsScreen}
              options={{
                presentation: 'card',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="HelpSupportModal"
              component={HelpSupportScreen}
              options={{
                presentation: 'card',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="NotificationsModal"
              component={NotificationsScreen}
              options={{
                presentation: 'card',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="YouTubeMetrics"
              component={YouTubeMetricsScreen}
              options={{
                presentation: 'card',
                headerShown: false,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

