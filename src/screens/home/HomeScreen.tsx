import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Share,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {useNavigation, CompositeNavigationProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import Container from '../../components/layouts/Container/Container';
import Label from '../../components/base/Label/Label';
import {BottomSheet} from '../../components/common/BottomSheet';
import {
  HomeStackParamList,
  MainTabParamList,
  RootStackParamList,
} from '../../types/navigation';
import {useTheme} from '../../hooks/useTheme';
import {useCampaigns} from '../../hooks/useCampaigns';
import {Theme} from '../../types/theme';
import {s} from '../../theme/size';
import {images} from '../../theme/images';
import {MainHeader} from '../../components/common/Headers/MainHeader';
import WhiteCard from '../../components/common/WhiteCard';
import {Campaign, CampaignStatus} from '../../types/campaign.types';

const GRADIENT_COLORS = ['#2C73D2', '#1A88B3', '#23C28C'];

const FILTER_OPTIONS: {id: CampaignStatus | 'all'; label: string}[] = [
  {id: 'all', label: 'All Campaigns'},
  {id: 'ACTIVE', label: 'Active'},
  {id: 'PAUSED', label: 'Paused'},
  {id: 'COMPLETED', label: 'Completed'},
];

type HomeScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<HomeStackParamList>,
  CompositeNavigationProp<
    BottomTabNavigationProp<MainTabParamList>,
    StackNavigationProp<RootStackParamList>
  >
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const {theme} = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const styles = createStyles(theme);

  // Use campaigns hook
  const {
    campaigns,
    pagination,
    isLoading,
    isFetching,
    error,
    status,
    changeStatus,
    hasNextPage,
    loadNextPage,
    refetch,
    generateShareLink,
    isGeneratingLink,
  } = useCampaigns({initialStatus: undefined});

  const [selectedFilter, setSelectedFilter] = useState<CampaignStatus | 'all'>('all');
  const [sharingCampaignId, setSharingCampaignId] = useState<string | null>(null);

  // Handle share button press
  const handleShare = useCallback(async (campaign: Campaign) => {
    setSharingCampaignId(campaign.id);
    
    try {
      // Generate share link for the campaign
      const result = await generateShareLink(campaign.id);
      
      if (result.success && result.data) {
        // Share the generated link
        await Share.share({
          message: `Check out "${campaign.title}" on Sharely!\n\n${result.data.shortUrl}`,
          title: campaign.title,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Share Failed',
        text2: 'Unable to share this campaign',
      });
    } finally {
      setSharingCampaignId(null);
    }
  }, [generateShareLink]);

  const handleApplyFilter = () => {
    if (selectedFilter === 'all') {
      changeStatus(undefined);
    } else {
      changeStatus(selectedFilter);
    }
    setFilterVisible(false);
  };

  const handleClearFilter = () => {
    setSelectedFilter('all');
  };

  // Filter campaigns by search query (client-side)
  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderCheckbox = (selected: boolean) => (
    <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
      {selected && <Label text="✓" size={12} weight="bold" color="#FFFFFF" />}
    </View>
  );

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No end date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).replace(/\//g, '/');
  };

  const renderDealCard = ({item}: {item: Campaign}) => {
    const isSharing = sharingCampaignId === item.id;
    
    return (
      <TouchableOpacity
        style={styles.dealCard}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('ProductDetail', {productId: item.id})}>
        <View style={styles.dealIconContainer}>
          {item.thumbnail ? (
            <Image source={{uri: item.thumbnail}} style={styles.dealIconImage} />
          ) : (
            <Image source={images.announcement} style={styles.dealIconImage} />
          )}
        </View>

        <View style={styles.dealContent}>
          <View style={styles.dealTitleRow}>
            <Label
              text={item.title}
              size={16}
              weight="bold"
              color="#1A1A1A"
              numberOfLines={1}
              style={styles.dealTitle}
            />
            <TouchableOpacity 
              style={styles.shareBtn}
              onPress={() => handleShare(item)}
              disabled={isSharing || isGeneratingLink}>
              {isSharing ? (
                <ActivityIndicator size="small" color="#23C28C" />
              ) : (
                <Image source={images.shareIcon} style={styles.shareIcon} />
              )}
            </TouchableOpacity>
          </View>

        <Label
          text={item.description || 'No description'}
          size={13}
          color="#888888"
          style={styles.dealDescription}
          numberOfLines={1}
        />

        <View style={styles.dealFooter}>
          <View style={styles.dateRow}>
            <Image source={images.clock} style={styles.clockIcon} />
            <View>
              <Label text="Ends on" size={11} color="#999999" />
              <Label
                text={formatDate(item.endDate)}
                size={13}
                weight="bold"
                color="#1A1A1A"
              />
            </View>
          </View>
          <Text style={styles.priceText}>
            {item.currencySymbol || '$'}
            {item.rewardRules.rewardPerClick}
            <Text style={styles.perClickText}>/Click</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!hasNextPage) return null;
    return (
      <View style={styles.loadMoreContainer}>
        {isFetching ? (
          <ActivityIndicator size="small" color="#23C28C" />
        ) : (
          <TouchableOpacity onPress={loadNextPage} style={styles.loadMoreButton}>
            <Label text="Load More" size={14} color="#23C28C" weight="medium" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Label
        text="No campaigns found"
        size={16}
        color="#888888"
        style={styles.emptyText}
      />
      <Label
        text="Check back later for new campaigns"
        size={14}
        color="#BBBBBB"
      />
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#23C28C" />
      <Label
        text="Loading campaigns..."
        size={14}
        color="#888888"
        style={styles.loadingText}
      />
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <Label text="Failed to load campaigns" size={16} color="#EF5350" />
      <TouchableOpacity onPress={refetch} style={styles.retryButton}>
        <Label text="Tap to retry" size={14} color="#23C28C" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Container>
      <MainHeader />

      <WhiteCard>
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Image source={images.search} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search campaigns"
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => setFilterVisible(true)}>
            <Image source={images.filter} style={styles.filterIcon} />
          </TouchableOpacity>
        </View>

        {/* Status badge */}
        {status && (
          <View style={styles.statusBadgeContainer}>
            <View style={styles.statusBadge}>
              <Label text={status} size={12} color="#FFFFFF" />
              <TouchableOpacity onPress={() => changeStatus(undefined)}>
                <Label text=" ✕" size={12} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {isLoading && !campaigns.length ? (
          renderLoadingState()
        ) : error ? (
          renderErrorState()
        ) : (
          <FlatList
            data={filteredCampaigns}
            keyExtractor={(item) => item.id}
            renderItem={renderDealCard}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyState}
            ListFooterComponent={renderFooter}
            refreshControl={
              <RefreshControl
                refreshing={isFetching && !isLoading}
                onRefresh={refetch}
                colors={['#23C28C']}
                tintColor="#23C28C"
              />
            }
          />
        )}
      </WhiteCard>

      {/* Filter Bottom Sheet */}
      <BottomSheet
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        title="Filters">
        <Label
          text="Campaign Status"
          size={14}
          color="#888888"
          style={styles.filterSectionTitle}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.filterScrollView}>
          {FILTER_OPTIONS.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.filterOptionRow,
                index < FILTER_OPTIONS.length - 1 && styles.filterOptionBorder,
              ]}
              onPress={() => setSelectedFilter(option.id)}
              activeOpacity={0.7}>
              {renderCheckbox(selectedFilter === option.id)}
              <Label
                text={option.label}
                size={16}
                weight={selectedFilter === option.id ? 'semiBold' : 'regular'}
                color="#1A1A1A"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.filterButtonRow}>
          <TouchableOpacity style={styles.clearButton} onPress={handleClearFilter}>
            <Label text="CLEAR ALL" size={14} weight="semiBold" color="#1A1A1A" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleApplyFilter} activeOpacity={0.8}>
            <LinearGradient
              colors={GRADIENT_COLORS}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.applyButton}>
              <Label
                text="SHOW RESULTS"
                size={14}
                weight="semiBold"
                color="#FFFFFF"
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </Container>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: s(16),
      paddingTop: s(16),
      paddingBottom: 0,
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: s(16),
    },
    searchBox: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F5F5F5',
      borderRadius: s(30),
      paddingHorizontal: s(16),
      height: s(48),
      marginRight: s(12),
    },
    searchIcon: {
      width: s(18),
      height: s(18),
      resizeMode: 'contain',
      marginRight: s(10),
      tintColor: '#999',
    },
    searchInput: {
      flex: 1,
      fontSize: s(14),
      fontFamily: theme.fonts.regular,
      color: theme.colors.text,
      padding: 0,
    },
    filterBtn: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    filterIcon: {
      width: s(40),
      height: s(40),
      resizeMode: 'contain',
    },
    statusBadgeContainer: {
      flexDirection: 'row',
      marginBottom: s(12),
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#23C28C',
      paddingHorizontal: s(12),
      paddingVertical: s(6),
      borderRadius: s(16),
    },
    dealCard: {
      flexDirection: 'row',
      backgroundColor: '#FFFFFF',
      borderRadius: s(16),
      padding: s(12),
      marginBottom: s(12),
      borderWidth: 1,
      borderColor: '#EFEFEF',
    },
    dealIconContainer: {
      marginRight: s(12),
    },
    dealIconImage: {
      width: s(50),
      height: s(50),
      resizeMode: 'cover',
      borderRadius: s(8),
    },
    dealContent: {
      flex: 1,
    },
    dealTitleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    dealTitle: {
      flex: 1,
      marginRight: s(8),
    },
    shareBtn: {
      width: s(24),
      height: s(24),
      justifyContent: 'center',
      alignItems: 'center',
    },
    shareIcon: {
      width: s(18),
      height: s(18),
      resizeMode: 'contain',
    },
    dealDescription: {
      marginTop: s(2),
      marginBottom: s(10),
    },
    dealFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    dateRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    clockIcon: {
      width: s(16),
      height: s(16),
      resizeMode: 'contain',
      marginRight: s(6),
    },
    priceText: {
      fontSize: s(18),
      fontFamily: theme.fonts.bold,
      color: '#05894F',
    },
    perClickText: {
      fontSize: s(18),
      fontFamily: theme.fonts.bold,
      color: '#1A1A1A',
    },
    listContent: {
      paddingBottom: s(20),
      flexGrow: 1,
    },
    loadMoreContainer: {
      paddingVertical: s(16),
      alignItems: 'center',
    },
    loadMoreButton: {
      paddingVertical: s(8),
      paddingHorizontal: s(16),
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: s(60),
    },
    emptyText: {
      marginBottom: s(8),
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: s(60),
    },
    loadingText: {
      marginTop: s(12),
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: s(60),
    },
    retryButton: {
      marginTop: s(12),
      paddingVertical: s(8),
      paddingHorizontal: s(16),
    },
    // Filter styles
    filterSectionTitle: {
      marginBottom: s(12),
    },
    filterScrollView: {
      maxHeight: s(350),
    },
    filterOptionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: s(16),
    },
    filterOptionBorder: {
      borderBottomWidth: 1,
      borderBottomColor: '#F0F0F0',
    },
    checkbox: {
      width: s(22),
      height: s(22),
      borderRadius: s(4),
      borderWidth: 1.5,
      borderColor: '#D0D0D0',
      marginRight: s(14),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
    },
    checkboxSelected: {
      backgroundColor: '#23C28C',
      borderColor: '#23C28C',
    },
    filterButtonRow: {
      flexDirection: 'row',
      marginTop: s(20),
      gap: s(12),
    },
    clearButton: {
      flex: 1,
      height: s(50),
      borderRadius: s(25),
      borderWidth: 1,
      borderColor: '#E0E0E0',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
    },
    applyButton: {
      flex: 1,
      minWidth: s(150),
      height: s(50),
      borderRadius: s(25),
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
