import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/navigation';
import HomeStackNavigator from './HomeStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';
import NotificationsScreen from '../screens/home/NotificationsScreen';
import Feather from '@react-native-vector-icons/feather';
import MyLinksScreen from '../screens/links/MyLinksScreen';

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
        options={{
          title: 'Earn',
          tabBarIcon: ({ color, size }) => (
            <Feather name="zap" size={size} color={color} />
          ),
        }}
      />

      {/* <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: 'Links',
          tabBarIcon: ({ color, size }) => (
            <Feather name="link" size={size} color={color} />
          ),
        }}
      /> */}
      <Tab.Screen
        name="MyLinksScreen"
        component={MyLinksScreen}
        options={{
          title: 'Links',
          tabBarIcon: ({ color, size }) => (
            <Feather name="link" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="ProfileStack"
        component={ProfileStackNavigator}
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color, size }) => (
            <Feather name="wallet" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
