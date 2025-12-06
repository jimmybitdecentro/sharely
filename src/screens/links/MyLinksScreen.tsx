import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {s} from '../../theme/size';
import {MainHeader} from '../../components/common/Headers/MainHeader';
import Container from '../../components/layouts/Container/Container';
import TextCustom from '../../components/base/Label/TextCustom';
import Label from '../../components/base/Label/Label';
import {useTheme} from '../../hooks/useTheme';
import {useLinks} from '../../hooks/useLinks';
import {images} from '../../theme/images';
import WhiteCard from '../../components/common/WhiteCard';
import {PublisherLink} from '../../types/campaign.types';

const GRADIENT_COLORS = ['#2C73D2', '#1A88B3', '#23C28C'];

export default function MyLinksScreen() {
  const [activeTab, setActiveTab] = useState('Today');
  const [sortOpen, setSortOpen] = useState(false);
  const {theme} = useTheme();

  // Use links hook
  const {
    links,
    pagination,
    isLoading,
    isFetching,
    error,
    hasNextPage,
    loadNextPage,
    refetch,
  } = useLinks();

  // Calculate total earnings (mock calculation - in real app would come from API)
  const totalEarnings = links.reduce((sum, link) => sum + (link.clicks * 3.36), 0);

  const renderLinkCard = ({item}: {item: PublisherLink}) => (
    <View style={styles.card}>
      <Image source={images.announcement} style={styles.cardImage} />

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.shortUrl}
        </Text>
        <TextCustom
          text={`Created ${new Date(item.createdAt).toLocaleDateString()}`}
          mb={s(10)}
          color="gray"
        />

        <View style={styles.badgeRow}>
          <View style={styles.badgeBlue}>
            <Text style={styles.badgeBlueText}>{item.clicks} Clicks</Text>
          </View>

          <View style={styles.badgeGreen}>
            <Text style={styles.badgeGreenText}>
              ${(item.clicks * 3.36).toFixed(2)}
            </Text>
          </View>

          <View style={styles.badgePurple}>
            <Text style={styles.badgePurpleText}>$3.36/click</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Image source={images.link} style={styles.emptyIcon} />
      <Label
        text="No links yet"
        size={16}
        weight="medium"
        color="#888888"
        style={{marginTop: s(16)}}
      />
      <Label
        text="Share campaigns to see your links here"
        size={14}
        color="#AAAAAA"
        style={{marginTop: s(8)}}
      />
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#23C28C" />
      <Label
        text="Loading links..."
        size={14}
        color="#888888"
        style={{marginTop: s(12)}}
      />
    </View>
  );

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

  return (
    <Container>
      <MainHeader />

      <WhiteCard>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: s(10),
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TextCustom text="My Links" size={16} />
          <TextCustom
            text={`Earnings: $${totalEarnings.toFixed(2)}`}
            size={16}
            color="primaryGreen"
          />
        </View>

        {/* Tabs */}
        <View style={[styles.tabsRow, {backgroundColor: theme?.colors.inputBg}]}>
          {['Today', 'Monthly', 'All Time'].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={styles.tabBtn}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.8}>
                {isActive ? (
                  <LinearGradient
                    colors={GRADIENT_COLORS}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.tabGradient}>
                    <Text style={[styles.tabText, styles.tabTextActive]}>
                      {tab}
                    </Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.tabContent}>
                    <Text style={styles.tabText}>{tab}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Earnings + Sort */}
        <View style={styles.earnSortRow}>
          <Text style={styles.earnLabel}>
            Total Links:{' '}
            <Text style={styles.earnValue}>{pagination?.total || links.length}</Text>
          </Text>

          <TouchableOpacity
            style={styles.sortBtn}
            onPress={() => setSortOpen(!sortOpen)}>
            <Text style={styles.sortBtnText}>Sort by</Text>
            <Image source={images.rightArrow} style={styles.sortArrow} />
          </TouchableOpacity>
        </View>

        {isLoading && !links.length ? (
          renderLoadingState()
        ) : (
          <FlatList
            data={links}
            keyExtractor={(item) => item.id}
            renderItem={renderLinkCard}
            contentContainerStyle={{
              paddingBottom: s(120),
              marginTop: s(10),
              marginHorizontal: s(5),
              flexGrow: 1,
            }}
            showsVerticalScrollIndicator={false}
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
    </Container>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: s(20),
    fontWeight: '700',
    marginTop: s(10),
    marginBottom: s(16),
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: s(12),
  },
  tabsRow: {
    justifyContent: 'space-between',
    padding: s(10),
    borderRadius: s(40),
    flexDirection: 'row',
    marginBottom: s(16),
  },
  tabBtn: {
    borderRadius: s(40),
    flex: 1,
    overflow: 'hidden',
  },
  tabGradient: {
    borderRadius: s(18),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: s(36),
  },
  tabContent: {
    borderRadius: s(40),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: s(36),
  },
  tabText: {
    fontSize: s(13),
    color: '#444',
    padding: s(5),
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  earnSortRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: s(16),
  },
  earnLabel: {
    fontSize: s(14),
    color: '#444',
  },
  earnValue: {
    fontWeight: '700',
    color: '#2563EB',
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: s(12),
    height: s(36),
    borderRadius: s(8),
  },
  sortBtnText: {
    fontSize: s(13),
    marginRight: s(4),
    color: '#333',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: s(12),
    borderColor: '#E5E7EB',
    padding: s(10),
    marginBottom: s(16),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: s(60),
    height: s(60),
    borderRadius: s(8),
    marginRight: s(12),
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: s(15),
    fontWeight: '600',
    marginBottom: s(8),
  },
  badgeRow: {
    flexDirection: 'row',
  },
  badgeBlue: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    padding: s(8),
    borderRadius: s(18),
    marginRight: s(6),
  },
  badgeBlueText: {
    fontSize: s(12),
    color: '#1D4ED8',
    marginLeft: s(4),
  },
  badgeGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    padding: s(8),
    borderRadius: s(18),
    marginRight: s(6),
  },
  badgeGreenText: {
    fontSize: s(12),
    color: '#047857',
    marginLeft: s(4),
  },
  badgePurple: {
    backgroundColor: '#F3E8FF',
    padding: s(8),
    borderRadius: s(18),
  },
  badgePurpleText: {
    fontSize: s(12),
    color: '#7E22CE',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: s(60),
  },
  emptyIcon: {
    width: s(60),
    height: s(60),
    resizeMode: 'contain',
    opacity: 0.5,
  },
  sortArrow: {
    width: s(14),
    height: s(14),
    resizeMode: 'contain',
    tintColor: '#333',
    transform: [{rotate: '90deg'}],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: s(60),
  },
  loadMoreContainer: {
    paddingVertical: s(16),
    alignItems: 'center',
  },
  loadMoreButton: {
    paddingVertical: s(8),
    paddingHorizontal: s(16),
  },
});
