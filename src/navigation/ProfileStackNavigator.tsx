import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ProfileStackParamList} from '../types/navigation';
import ProfileScreen from '../screens/profile/ProfileScreen';
import MyEarningsScreen from '../screens/earnings/MyEarningsScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import NotificationSettingsScreen from '../screens/profile/NotificationSettingsScreen';

const Stack = createStackNavigator<ProfileStackParamList>();

const ProfileStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        cardStyle: {backgroundColor: '#FFFFFF'},
      }}>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name="MyEarnings" component={MyEarningsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen
        name="NotificationSettings"
        component={NotificationSettingsScreen}
      />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;

