import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import { MainTabParamList } from '../types/navigation';
import HomeStackNavigator from './HomeStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';
import MyLinksScreen from '../screens/links/MyLinksScreen';
import { s } from '../theme/size';
import { images } from '../theme/images';

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
          const getIcon = (): ImageSourcePropType => {
            switch (route.name) {
              case 'HomeStack':
                return images.earn;
              case 'MyLinksScreen':
                return images.link;
              case 'ProfileStack':
                return images.wallet;
              default:
                return images.earn;
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
                 <View style={styles.activeTabContentv}>
                 <Image source={getIcon()} style={styles.activeTabIcon} />
                  <Text style={styles.activeTabLabel}>{getLabelText()}</Text>
               
                 </View>
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
              <Image source={getIcon()} style={styles.inactiveTabIcon} />
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
   
    borderRadius: s(25),
  },
  activeTabContentv: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(10),
    paddingVertical: s(6),
    gap: s(6),
    borderRadius: s(25),
  },
  activeTabIcon: {
    width: s(20),
    height: s(20),
    resizeMode: 'contain',
    tintColor: '#FFFFFF',
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
    width: s(20),
    height: s(20),
    resizeMode: 'contain',
    tintColor: 'rgba(255, 255, 255, 0.7)',
  },
  inactiveTabLabel: {
    fontSize: s(13),
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

export default MainNavigator;
