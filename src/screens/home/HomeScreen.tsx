import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Container from '../../components/layouts/Container/Container';
import Button from '../../components/base/Button/Button';
import Label from '../../components/base/Label/Label';
import ImageView from '../../components/base/ImageView/ImageView';
import {useTheme} from '../../hooks/useTheme';
import {useLanguage} from '../../hooks/useLanguage';
import {HomeStackParamList} from '../../types/navigation';

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Home'>;

interface CampaignItem {
  id: string;
  title: string;
  description: string;
  image: string;
  earnAmount: number;
  clicks: number;
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const {theme} = useTheme();
  const {t} = useLanguage();
  const [activeTab, setActiveTab] = useState<'home' | 'links'>('home');
  const [campaigns] = useState<CampaignItem[]>([
    {
      id: '1',
      title: 'Latest iPhone 15 Pro',
      description: 'Get the latest iPhone with amazing features',
      image: '',
      earnAmount: 15,
      clicks: 123,
    },
  ]);
  const styles = createStyles(theme);

  const renderCampaignItem = ({item}: {item: CampaignItem}) => (
    <View style={styles.campaignCard}>
      <ImageView
        source={{uri: item.image || 'https://via.placeholder.com/150'}}
        style={styles.campaignImage}
        resizeMode="cover"
      />
      <View style={styles.campaignContent}>
        <Label text={item.title} variant="subtitle" useTranslation={false} />
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.campaignFooter}>
          <Text style={styles.earnText}>
            {t('earn')} ₹{item.earnAmount}
          </Text>
          <Text style={styles.clicksText}>
            {item.clicks} {t('clicks')}
          </Text>
        </View>
        <Button
          title={t('share')}
          onPress={() => navigation.navigate('ProductDetail', {productId: item.id})}
          variant="primary"
          style={styles.shareButton}
        />
      </View>
    </View>
  );

  return (
    <Container>
      <View style={styles.container}>
        <View style={styles.header}>
          <Label text="Sharely" variant="heading" useTranslation={false} />
          <View style={styles.headerIcons}>
            <TouchableOpacity>
              <Text style={styles.icon}>🔍</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.icon}>👤</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'home' && styles.activeTab]}
            onPress={() => setActiveTab('home')}>
            <Text style={[styles.tabText, activeTab === 'home' && styles.activeTabText]}>
              {t('homeNews')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'links' && styles.activeTab]}
            onPress={() => setActiveTab('links')}>
            <Text style={[styles.tabText, activeTab === 'links' && styles.activeTabText]}>
              {t('myLinks')}
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={campaigns}
          renderItem={renderCampaignItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
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
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
    headerIcons: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    icon: {
      fontSize: 24,
    },
    tabs: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    tab: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: theme.colors.primary,
    },
    tabText: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.textSecondary,
    },
    activeTabText: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
    listContent: {
      padding: theme.spacing.md,
    },
    campaignCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
      overflow: 'hidden',
    },
    campaignImage: {
      width: '100%',
      height: 200,
    },
    campaignContent: {
      padding: theme.spacing.md,
    },
    description: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.textSecondary,
      marginVertical: theme.spacing.sm,
    },
    campaignFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    earnText: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.success,
      fontWeight: '600',
    },
    clicksText: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.textSecondary,
    },
    shareButton: {
      width: '100%',
    },
  });

export default HomeScreen;

