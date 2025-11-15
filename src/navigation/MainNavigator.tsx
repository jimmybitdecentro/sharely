import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/navigation';
import HomeStackNavigator from './HomeStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';
import NotificationsScreen from '../screens/home/NotificationsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007BFF',
        tabBarInactiveTintColor: '#6C757D',
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={{ title: 'Earn' }}
      />
      {/* <Tab.Screen name="Search" component={SearchScreen} options={{title: 'Search'}} /> */}
      {/* <Tab.Screen name="Add" component={AddScreen} options={{title: 'Add'}} /> */}
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: 'Links' }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStackNavigator}
        options={{ title: 'Wallet' }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
