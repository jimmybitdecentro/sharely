import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import Container from '../../components/layouts/Container/Container';
import Button from '../../components/base/Button/Button';
import Label from '../../components/base/Label/Label';
import ImageView from '../../components/base/ImageView/ImageView';
import {useTheme} from '../../hooks/useTheme';
import {useLanguage} from '../../hooks/useLanguage';

interface LinkItem {
  id: string;
  title: string;
  description: string;
  image: string;
  earnAmount: number;
  clicks: number;
}

const MyLinksScreen: React.FC = () => {
  const {theme} = useTheme();
  const {t} = useLanguage();
  const [links] = useState<LinkItem[]>([]);
  const styles = createStyles(theme);

  const renderLinkItem = ({item}: {item: LinkItem}) => (
    <View style={styles.linkCard}>
      <ImageView
        source={{uri: item.image || 'https://via.placeholder.com/150'}}
        style={styles.linkImage}
        resizeMode="cover"
      />
      <View style={styles.linkContent}>
        <Label text={item.title} variant="subtitle" useTranslation={false} />
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.linkFooter}>
          <Text style={styles.earnText}>
            {t('earn')} ₹{item.earnAmount}
          </Text>
          <Text style={styles.clicksText}>
            {item.clicks} {t('clicks')}
          </Text>
        </View>
        <Button
          title={t('share')}
          onPress={() => {}}
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
        </View>
        <View style={styles.tabs}>
          <TouchableOpacity style={[styles.tab, styles.inactiveTab]}>
            <Text style={styles.tabText}>{t('homeNews')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={[styles.tabText, styles.activeTabText]}>{t('myLinks')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.filterBar}>
          <Button title={t('filter')} onPress={() => {}} variant="secondary" />
          <Button title={t('sort')} onPress={() => {}} variant="secondary" />
        </View>
        <FlatList
          data={links}
          renderItem={renderLinkItem}
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
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background,
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
    inactiveTab: {},
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
    filterBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: theme.spacing.md,
      gap: theme.spacing.md,
    },
    listContent: {
      padding: theme.spacing.md,
    },
    linkCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
      overflow: 'hidden',
    },
    linkImage: {
      width: '100%',
      height: 200,
    },
    linkContent: {
      padding: theme.spacing.md,
    },
    description: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.textSecondary,
      marginVertical: theme.spacing.sm,
    },
    linkFooter: {
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

export default MyLinksScreen;

