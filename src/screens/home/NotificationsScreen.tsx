import React from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import Container from '../../components/layouts/Container/Container';
import {useTheme} from '../../hooks/useTheme';
import { ActionBar } from '../../components/common/Headers/ActionBar';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import TextCustom from '../../components/base/Label/TextCustom';
import WhiteCard from '../../components/common/WhiteCard';
import { s } from '../../theme/size';
import Feather from '@react-native-vector-icons/feather';

interface NotificationItem {
  id: string;
  type: 'earnings' | 'account' | 'link' | 'security';
  title: string;
  description: string;
  timestamp: string;
}

const sampleNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'earnings',
    title: 'Earnings Update',
    description: 'You earned $4.20 from your "Best Tech Deals 2024" link with 23 new clicks',
    timestamp: '2h ago',
  },
  {
    id: '2',
    type: 'account',
    title: 'Account',
    description: 'Your withdrawal of $50.00 has been processed successfully',
    timestamp: '1 day ago',
  },
  {
    id: '3',
    type: 'link',
    title: 'Link Performance',
    description: 'Your "Funny Cat Videos" link reached 100 clicks milestone! Bonus $2.00 added',
    timestamp: '28/08/25',
  },
  {
    id: '4',
    type: 'security',
    title: 'Security Alert',
    description: 'New login detected from Chrome on Windows. If this wasn\'t you, secure your account',
    timestamp: '23/08/25',
  },
];

const NotificationsScreen: React.FC = () => {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();

  const getIconConfig = (type: string) => {
    switch (type) {
      case 'earnings':
        return {
          icon: 'dollar-sign',
          backgroundColor: '#DCFCE7',
          iconColor: '#047857',
        };
      case 'account':
        return {
          icon: 'user',
          backgroundColor: '#DBEAFE',
          iconColor: '#1D4ED8',
        };
      case 'link':
        return {
          icon: 'link',
          backgroundColor: '#F3E8FF',
          iconColor: '#7E22CE',
        };
      case 'security':
        return {
          icon: 'alert-circle',
          backgroundColor: '#FEE2E2',
          iconColor: '#DC2626',
        };
      default:
        return {
          icon: 'bell',
          backgroundColor: '#F3F4F6',
          iconColor: '#6B7280',
        };
    }
  };

  const renderNotificationItem = ({ item }: { item: NotificationItem }) => {
    const iconConfig = getIconConfig(item.type);
    return (
      <TouchableOpacity
        style={[
          styles.notificationCard,
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: iconConfig.backgroundColor }]}>
          <Feather
            name={iconConfig.icon as any}
            size={s(20)}
            color={iconConfig.iconColor}
          />
        </View>

        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <TextCustom
              text={item.title}
              size={15}
              fontFamily="bold"
              color="text"
              style={styles.notificationTitle}
              useTranslation={false}
            />
            <TextCustom
              text={item.timestamp}
              size={12}
              color="textSecondary"
              useTranslation={false}
            />
          </View>

          <TextCustom
            text={item.description}
            size={13}
            color="textSecondary"
            style={styles.notificationDescription}
            useTranslation={false}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Container >
      <ActionBar
        title="Notifications"
        onBackPress={() => {
          navigation.goBack();
        }}
      />

<WhiteCard>
          <FlatList
            data={sampleNotifications}
            keyExtractor={(item) => item.id}
            renderItem={renderNotificationItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </WhiteCard>
    </Container>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      padding: s(16),
    },
    listContent: {
      paddingBottom: s(20),
    },
    notificationCard: {
      flexDirection: 'row',
      backgroundColor: '#F3F4F6',
      borderRadius: s(12),
      padding: s(12),
      marginBottom: s(12),
      alignItems: 'flex-start',
    },
   
    iconContainer: {
      width: s(44),
      height: s(44),
      borderRadius: s(22),
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: s(12),
    },
    notificationContent: {
      flex: 1,
    },
    notificationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: s(6),
    },
    notificationTitle: {
      flex: 1,
      marginRight: s(8),
    },
    notificationDescription: {
      lineHeight: s(18),
    },
  });

export default NotificationsScreen;

