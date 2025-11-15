import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Container from '../../components/layouts/Container/Container';
import Label from '../../components/base/Label/Label';
import {useTheme} from '../../hooks/useTheme';
import {useLanguage} from '../../hooks/useLanguage';
import {ProfileStackParamList} from '../../types/navigation';

type SettingsScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'Settings'>;

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const {theme} = useTheme();
  const {t} = useLanguage();
  const styles = createStyles(theme);

  const menuItems = [
    {key: 'editProfile', label: t('editProfile'), screen: 'EditProfile' as const},
    {key: 'changePassword', label: t('changePassword'), screen: undefined},
    {key: 'notificationSettings', label: t('notificationSettings'), screen: 'NotificationSettings' as const},
    {key: 'privacyPolicy', label: t('privacyPolicy'), screen: undefined},
    {key: 'termsConditions', label: t('termsConditions'), screen: undefined},
    {key: 'aboutUs', label: t('aboutUs'), screen: undefined},
    {key: 'deleteAccount', label: t('deleteAccount'), screen: undefined, danger: true},
  ];

  return (
    <Container>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Label
            text={t('settings')}
            variant="heading"
            style={styles.title}
            useTranslation={true}
          />
        </View>
        <View style={styles.menu}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.menuItem}
              onPress={() => {
                if (item.screen) {
                  navigation.navigate(item.screen);
                }
              }}>
              <Text
                style={[
                  styles.menuItemText,
                  item.danger && styles.dangerText,
                ]}>
                {item.label}
              </Text>
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
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
    backIcon: {
      fontSize: 24,
      color: theme.colors.text,
      marginRight: theme.spacing.md,
    },
    title: {
      flex: 1,
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
    dangerText: {
      color: theme.colors.error,
    },
  });

export default SettingsScreen;

