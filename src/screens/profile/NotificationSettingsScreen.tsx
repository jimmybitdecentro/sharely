import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Container from '../../components/layouts/Container/Container';
import Label from '../../components/base/Label/Label';
import {useTheme} from '../../hooks/useTheme';
import {useLanguage} from '../../hooks/useLanguage';

const NotificationSettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const {t} = useLanguage();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const styles = createStyles(theme);

  const notifications = [
    {key: 'New Campaign Alert', date: '2024-01-15'},
    {key: 'Earnings Update', date: '2024-01-14'},
    {key: 'Withdrawal Successful', date: '2024-01-13'},
  ];

  return (
    <Container>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Label
            text={t('notificationSettings')}
            variant="heading"
            style={styles.title}
            useTranslation={true}
          />
        </View>
        <View style={styles.content}>
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>{t('pushNotifications')}</Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{false: theme.colors.border, true: theme.colors.primary}}
              thumbColor={theme.colors.background}
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>{t('emailNotifications')}</Text>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{false: theme.colors.border, true: theme.colors.primary}}
              thumbColor={theme.colors.background}
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>{t('smsNotifications')}</Text>
            </View>
            <Switch
              value={smsNotifications}
              onValueChange={setSmsNotifications}
              trackColor={{false: theme.colors.border, true: theme.colors.primary}}
              thumbColor={theme.colors.background}
            />
          </View>
          <View style={styles.recentActivity}>
            <Label
              text={t('recentActivity')}
              variant="subtitle"
              style={styles.sectionTitle}
              useTranslation={true}
            />
            {notifications.map((notification, index) => (
              <View key={index} style={styles.notificationItem}>
                <Text style={styles.notificationText}>{notification.key}</Text>
                <Text style={styles.notificationDate}>{notification.date}</Text>
              </View>
            ))}
          </View>
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
    content: {
      padding: theme.spacing.md,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    settingContent: {
      flex: 1,
    },
    settingLabel: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text,
    },
    recentActivity: {
      marginTop: theme.spacing.xl,
    },
    sectionTitle: {
      marginBottom: theme.spacing.md,
    },
    notificationItem: {
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    notificationText: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    notificationDate: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.textSecondary,
    },
  });

export default NotificationSettingsScreen;

