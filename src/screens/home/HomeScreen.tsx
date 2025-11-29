import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import Container from '../../components/layouts/Container/Container';
import { HomeStackParamList } from '../../types/navigation';
import { useTheme } from '../../hooks/useTheme';
import { Theme } from '../../types/theme';
import { s } from '../../theme/size';

const GRADIENT_COLORS = ['#2C73D2', '#1A88B3', '#23C28C'];

// Sample deals data
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

export default function HomeScreen() {
  const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const styles = createStyles(theme);

  // Gradient text for logo
  const GradientText = ({ text, style }: { text: string; style?: any }) => (
    <MaskedView maskElement={<Text style={[styles.logoText, style]}>{text}</Text>}>
      <LinearGradient
        colors={GRADIENT_COLORS}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
        <Text style={[styles.logoText, style, { opacity: 0 }]}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );

  // Header icon button
  const HeaderIconButton = ({ icon, onPress }: { icon: string; onPress?: () => void }) => (
    <TouchableOpacity style={styles.headerIconBtn} onPress={onPress}>
      <Text style={styles.headerIcon}>{icon}</Text>
    </TouchableOpacity>
  );

  // Deal card component
  const DealCard = ({ item }: { item: typeof sampleDeals[0] }) => (
    <TouchableOpacity 
      style={styles.dealCard}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      <View style={styles.dealCardContent}>
        {/* Left: Icon */}
        <View style={styles.dealIconContainer}>
          <Text style={styles.dealIcon}>📢</Text>
        </View>

        {/* Middle: Content */}
        <View style={styles.dealInfo}>
          <View style={styles.dealHeader}>
            <View style={styles.dealTitleContainer}>
              <Text style={styles.dealTitle}>{item.title}</Text>
              <Text style={styles.dealDescription}>{item.description}</Text>
            </View>
            {/* Share button */}
            <TouchableOpacity style={styles.shareButton}>
              <Text style={styles.shareIcon}>↗</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.dealFooter}>
            <View style={styles.dealDateContainer}>
              <Text style={styles.clockIcon}>⏱</Text>
              <View>
                <Text style={styles.endsOnText}>Ends on</Text>
                <Text style={styles.dealDate}>{item.endDate}</Text>
              </View>
            </View>
            
            <Text style={styles.dealPrice}>${item.pricePerClick}/Click</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <Container style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.headerRow}>
          <GradientText text="Sharely" />
          
          <View style={styles.headerIcons}>
            <HeaderIconButton icon="🎧" />
            <HeaderIconButton icon="🔔" />
            <TouchableOpacity>
              <Image
                source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
                style={styles.avatarImage}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.greetingText}>Good Morning, John</Text>
        <Text style={styles.subtitleText}>
          Pick a deal, share with friends to earn cash per click.
        </Text>
      </View>

      {/* White Card Section - stretches to bottom */}
      <View style={styles.whiteCard}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by category or deals..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          {/* Filter button */}
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterIcon}>⚙</Text>
          </TouchableOpacity>
        </View>

        {/* Deals List */}
        <FlatList
          data={sampleDeals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <DealCard item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
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
    
    // Header Section
    headerSection: {
      paddingTop: s(50),
      paddingBottom: s(12),
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logoText: {
      fontSize: s(28),
      fontFamily: theme.fonts.bold,
      fontWeight: 'bold',
    },
    headerIcons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(8),
    },
    headerIconBtn: {
      width: s(40),
      height: s(40),
      borderRadius: s(20),
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerIcon: {
      fontSize: s(18),
    },
    avatarImage: {
      width: s(40),
      height: s(40),
      borderRadius: s(20),
      borderWidth: s(2),
      borderColor: '#23C28C',
    },
    greetingText: {
      fontSize: s(22),
      fontFamily: theme.fonts.bold,
      color: '#FFFFFF',
      marginTop: s(16),
    },
    subtitleText: {
      fontSize: s(14),
      fontFamily: theme.fonts.regular,
      color: 'rgba(255, 255, 255, 0.7)',
      marginTop: s(4),
    },

    // White Card Section - no bottom border radius to merge with tab bar
    whiteCard: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      borderTopLeftRadius: s(30),
      borderTopRightRadius: s(30),
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      paddingHorizontal: s(16),
      paddingTop: s(30),
      marginTop:s(10)
    },

    // Search
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: s(16),
    },
    searchInputWrapper: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.inputBg,
      borderRadius: s(30),
      paddingHorizontal: s(16),
      height: s(48),
      marginRight: s(12),
    },
    searchIcon: {
      fontSize: s(16),
      marginRight: s(8),
      opacity: 0.5,
    },
    searchInput: {
      flex: 1,
      fontSize: s(14),
      fontFamily: theme.fonts.regular,
      color: theme.colors.text,
    },
    filterButton: {
      width: s(48),
      height: s(48),
      borderRadius: s(12),
      backgroundColor: theme.colors.inputBg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    filterIcon: {
      fontSize: s(22),
      color: theme.colors.text,
    },

    // Deal Card
    dealCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: s(16),
      padding: s(14),
      marginBottom: s(12),
      borderWidth: s(1),
      borderColor: '#F0F0F0',
    },
    dealCardContent: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    dealIconContainer: {
      width: s(50),
      height: s(50),
      borderRadius: s(25),
      backgroundColor: '#E3F2FD',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: s(12),
    },
    dealIcon: {
      fontSize: s(24),
    },
    dealInfo: {
      flex: 1,
    },
    dealHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    dealTitleContainer: {
      flex: 1,
      marginRight: s(8),
    },
    dealTitle: {
      fontSize: s(16),
      fontFamily: theme.fonts.semiBold,
      color: theme.colors.text,
      marginBottom: s(2),
    },
    dealDescription: {
      fontSize: s(13),
      fontFamily: theme.fonts.regular,
      color: theme.colors.textSecondary,
      marginBottom: s(10),
    },
    shareButton: {
      padding: s(4),
    },
    shareIcon: {
      fontSize: s(20),
      color: theme.colors.textSecondary,
    },
    dealFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    dealDateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    clockIcon: {
      fontSize: s(16),
      marginRight: s(6),
      opacity: 0.6,
    },
    endsOnText: {
      fontSize: s(11),
      fontFamily: theme.fonts.regular,
      color: theme.colors.textSecondary,
    },
    dealDate: {
      fontSize: s(13),
      fontFamily: theme.fonts.medium,
      color: theme.colors.text,
    },
    dealPrice: {
      fontSize: s(20),
      fontFamily: theme.fonts.bold,
      color: '#23C28C',
    },

    // List
    listContent: {
      paddingBottom: s(20),
    },
  });
