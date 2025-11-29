import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import Container from '../../components/layouts/Container/Container';
import Label from '../../components/base/Label/Label';
import { BottomSheet } from '../../components/common/BottomSheet';
import { HomeStackParamList, MainTabParamList, RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../hooks/useTheme';
import { Theme } from '../../types/theme';
import { s } from '../../theme/size';
import { images } from '../../theme/images';

const GRADIENT_COLORS = ['#2C73D2', '#1A88B3', '#23C28C'];

const sampleDeals = [
  {
    id: '1',
    title: 'Latest IPhone 15 Pro',
    description: 'Share Exclusive Apple Deals',
    endDate: '21/09/2025',
    pricePerClick: 6,
  },
  {
    id: '2',
    title: 'Designer Fashion Sale',
    description: 'Premium Brands At 70% Off',
    endDate: '22/09/2025',
    pricePerClick: 5,
  },
  {
    id: '3',
    title: 'Luxury Beach Resorts',
    description: 'Early Bird Summer Vacation Deals',
    endDate: '24/09/2025',
    pricePerClick: 10,
  },
  {
    id: '4',
    title: 'Designer Fashion Sale',
    description: 'Premium Brands At 70% Off',
    endDate: '22/09/2025',
    pricePerClick: 5,
  },
];

const FILTER_OPTIONS = [
  { id: 'latest', label: 'Latest' },
  { id: 'priceLowToHigh', label: 'Price : Low to High' },
  { id: 'priceHighToLow', label: 'Price : High to Low' },
  { id: 'priceLowHigh', label: 'Price: low to high' },
  { id: 'popularity', label: 'Popularity' },
  { id: 'dateCreated', label: 'Date Created' },
];

type DealItem = typeof sampleDeals[0];

type HomeScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<HomeStackParamList>,
  CompositeNavigationProp<
    BottomTabNavigationProp<MainTabParamList>,
    StackNavigationProp<RootStackParamList>
  >
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('latest');
  const styles = createStyles(theme);

  const handleApplyFilter = () => {
    console.log('Applied filter:', selectedFilter);
    setFilterVisible(false);
  };

  const handleClearFilter = () => {
    setSelectedFilter('latest');
  };

  const renderCheckbox = (selected: boolean) => (
    <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
      {selected && <Label text="✓" size={12} weight="bold" color="#FFFFFF" />}
    </View>
  );

  const renderDealCard = ({ item }: { item: DealItem }) => (
    <TouchableOpacity
      style={styles.dealCard}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      <View style={styles.dealIconContainer}>
        <Image source={images.announcement} style={styles.dealIconImage} />
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
          <TouchableOpacity style={styles.shareBtn}>
            <Image source={images.share} style={styles.shareIcon} />
          </TouchableOpacity>
        </View>

        <Label
          text={item.description}
          size={13}
          color="#888888"
          style={styles.dealDescription}
        />

        <View style={styles.dealFooter}>
          <View style={styles.dateRow}>
            <Image source={images.clock} style={styles.clockIcon} />
            <View>
              <Label text="Ends on" size={11} color="#999999" />
              <Label text={item.endDate} size={13} weight="bold" color="#1A1A1A" />
            </View>
          </View>
          <Text style={styles.priceText}>
            ${item.pricePerClick}<Text style={styles.perClickText}>/Click</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <Container style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Image source={images.logo} style={styles.logo} />
          <View style={styles.headerIcons}>
            <Image source={images.sound} style={styles.headerIcon} />
            <Image source={images.notification} style={styles.headerIcon} />
            <TouchableOpacity
              onPress={() => navigation.navigate('ProfileModal')}
              activeOpacity={0.7}
            >
              <Image source={images.profile} style={styles.avatar} />
            </TouchableOpacity>
          </View>
        </View>
        <Label
          text="Good Morning, John"
          size={22}
          weight="bold"
          color="#FFFFFF"
          style={styles.greeting}
        />
        <Label
          text="Pick a deal, share with friends to earn cash per click."
          size={14}
          color="rgba(255, 255, 255, 0.7)"
          style={styles.subtitle}
        />
      </View>

      <View style={styles.whiteCard}>
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Image source={images.search} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => setFilterVisible(true)}
          >
            <Image source={images.filter} style={styles.filterIcon} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={sampleDeals}
          keyExtractor={(item) => item.id}
          renderItem={renderDealCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>

      {/* Filter Bottom Sheet */}
      <BottomSheet
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        title="Filters"
      >
        <Label text="Sort By" size={14} color="#888888" style={styles.filterSectionTitle} />
        
        <ScrollView showsVerticalScrollIndicator={false} style={styles.filterScrollView}>
          {FILTER_OPTIONS.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.filterOptionRow,
                index < FILTER_OPTIONS.length - 1 && styles.filterOptionBorder,
              ]}
              onPress={() => setSelectedFilter(option.id)}
              activeOpacity={0.7}
            >
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
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.applyButton}
            >
              <Label text="SHOW RESULTS" size={14} weight="semiBold" color="#FFFFFF" />
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
    header: {
      paddingTop: s(40),
      paddingBottom: s(16),
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logo: {
      width: s(100),
      height: s(35),
      resizeMode: 'contain',
    },
    headerIcons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(8),
    },
    headerIcon: {
      width: s(36),
      height: s(36),
      resizeMode: 'contain',
    },
    avatar: {
      width: s(40),
      height: s(40),
      resizeMode: 'contain',
    },
    greeting: {
      marginTop: s(20),
    },
    subtitle: {
      marginTop: s(4),
    },
    whiteCard: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      borderTopLeftRadius: s(30),
      borderTopRightRadius: s(30),
      paddingHorizontal: s(16),
      paddingTop: s(24),
      marginTop: s(12),
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
      resizeMode: 'contain',
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
      padding: s(4),
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
