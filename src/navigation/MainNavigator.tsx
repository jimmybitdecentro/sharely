import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MainTabParamList} from '../types/navigation';
import HomeStackNavigator from './HomeStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';
import MyLinksScreen from '../screens/links/MyLinksScreen';
import SearchScreen from '../screens/home/SearchScreen';
import AddScreen from '../screens/home/AddScreen';
import NotificationsScreen from '../screens/home/NotificationsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007BFF',
        tabBarInactiveTintColor: '#6C757D',
      }}>
      <Tab.Screen name="HomeStack" component={HomeStackNavigator} options={{title: 'Home'}} />
      <Tab.Screen name="Search" component={SearchScreen} options={{title: 'Search'}} />
      <Tab.Screen name="Add" component={AddScreen} options={{title: 'Add'}} />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{title: 'Notifications'}}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStackNavigator}
        options={{title: 'Profile'}}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;

