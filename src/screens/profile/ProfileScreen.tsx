import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSelector, useDispatch} from 'react-redux';
import Container from '../../components/layouts/Container/Container';
import Label from '../../components/base/Label/Label';
import {useTheme} from '../../hooks/useTheme';
import {useLanguage} from '../../hooks/useLanguage';
import {ProfileStackParamList} from '../../types/navigation';
import {RootState} from '../../store';
import {logout} from '../../store/slices/authSlice';
import {storageService} from '../../services/storage/storageService';

type ProfileScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'Profile'>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const dispatch = useDispatch();
  const {theme} = useTheme();
  const {t} = useLanguage();
  const user = useSelector((state: RootState) => state.auth.user);
  const styles = createStyles(theme);

  const handleLogout = async () => {
    await storageService.removeAuthToken();
    await storageService.removeUserData();
    dispatch(logout());
  };

  const menuItems = [
    {key: 'myEarnings', label: t('myEarnings'), screen: 'MyEarnings' as const},
    {key: 'myCampaigns', label: t('myCampaigns'), screen: undefined},
    {key: 'myOrders', label: t('myOrders'), screen: undefined},
    {key: 'settings', label: t('settings'), screen: 'Settings' as const},
    {key: 'helpSupport', label: t('helpSupport'), screen: undefined},
    {key: 'logout', label: t('logout'), screen: undefined, action: handleLogout},
  ];

  return (
    <Container>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image
                source={{uri: user?.profilePicture || 'https://via.placeholder.com/80'}}
                style={styles.avatar}
              />
            </View>
            <Label text={user?.name || 'User'} variant="heading" useTranslation={false} />
            <Text style={styles.email}>{user?.email || ''}</Text>
          </View>
        </View>
        <View style={styles.menu}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.menuItem}
              onPress={() => {
                if (item.action) {
                  item.action();
                } else if (item.screen) {
                  navigation.navigate(item.screen);
                }
              }}>
              <Text style={styles.menuItemText}>{item.label}</Text>
              <Text style={styles.menuItemArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Container>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.background,
      alignItems: 'center',
    },
    profileSection: {
      alignItems: 'center',
    },
    avatarContainer: {
      marginBottom: theme.spacing.md,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.surface,
    },
    email: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    menu: {
      padding: theme.spacing.md,
    },
    menuItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    menuItemText: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text,
    },
    menuItemArrow: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.textSecondary,
    },
  });

export default ProfileScreen;

