import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ProfileStackParamList} from '../types/navigation';
import WalletScreen from '../screens/wallet/WalletScreen';
import TransactionsScreen from '../screens/wallet/TransactionsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import PreferencesScreen from '../screens/profile/PreferencesScreen';
import MyEarningsScreen from '../screens/earnings/MyEarningsScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import EditProfileFormScreen from '../screens/profile/EditProfileFormScreen';
import NotificationSettingsScreen from '../screens/profile/NotificationSettingsScreen';

const Stack = createStackNavigator<ProfileStackParamList>();

const ProfileStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Wallet"
      screenOptions={{
        headerShown: true,
        cardStyle: {backgroundColor: '#FFFFFF'},
      }}>
      <Stack.Screen
        name="Wallet"
        component={WalletScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Preferences"
        component={PreferencesScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name="MyEarnings" component={MyEarningsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EditProfileForm"
        component={EditProfileFormScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="NotificationSettings"
        component={NotificationSettingsScreen}
      />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;

