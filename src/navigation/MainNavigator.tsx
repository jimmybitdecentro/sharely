import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import { MainTabParamList } from '../types/navigation';
import HomeStackNavigator from './HomeStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';
import MyLinksScreen from '../screens/links/MyLinksScreen';
import { s } from '../theme/size';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Gradient colors matching the button
const GRADIENT_COLORS = ['#2C73D2', '#1A88B3', '#23C28C'];

// Custom Tab Bar Component
const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Get icon based on route
          const getIcon = () => {
            switch (route.name) {
              case 'HomeStack':
                return '💰';
              case 'MyLinksScreen':
                return '🔗';
              case 'ProfileStack':
                return '💳';
              default:
                return '•';
            }
          };

          // Get label text
          const getLabelText = () => {
            switch (route.name) {
              case 'HomeStack':
                return 'EARN';
              case 'MyLinksScreen':
                return 'LINKS';
              case 'ProfileStack':
                return 'WALLET';
              default:
                return label;
            }
          };

          if (isFocused) {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={styles.activeTabButton}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={GRADIENT_COLORS}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.activeTabContent}
                >
                  <Text style={styles.activeTabIcon}>{getIcon()}</Text>
                  <Text style={styles.activeTabLabel}>{getLabelText()}</Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.inactiveTabButton}
              activeOpacity={0.7}
            >
              <Text style={styles.inactiveTabIcon}>{getIcon()}</Text>
              <Text style={styles.inactiveTabLabel}>{getLabelText()}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={{ title: 'Earn' }}
      />
      <Tab.Screen
        name="MyLinksScreen"
        component={MyLinksScreen}
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

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: '#FFFFFF',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1A1F2E',
    paddingVertical: s(12),
    paddingHorizontal: s(16),
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  activeTabButton: {
    flex: 1,
    alignItems: 'center',
  },
  activeTabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: s(10),
    paddingHorizontal: s(20),
    borderRadius: s(25),
    gap: s(6),
  },
  activeTabIcon: {
    fontSize: s(16),
  },
  activeTabLabel: {
    fontSize: s(13),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  inactiveTabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(6),
    paddingVertical: s(10),
  },
  inactiveTabIcon: {
    fontSize: s(16),
    opacity: 0.7,
  },
  inactiveTabLabel: {
    fontSize: s(13),
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

export default MainNavigator;
