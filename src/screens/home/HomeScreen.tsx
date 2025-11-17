// Full React Native screen implementing the shared UI design\ n// Clean, responsive, production‑ready code

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
import { HomeStackParamList } from '../../types/navigation';
import { images } from '../../theme/images';
import { useTheme } from '../../hooks/useTheme';
import { useLanguage } from '../../hooks/useLanguage';
import { s } from '../../theme/size';
import { MainHeader } from '../../components/common/Headers/MainHeader';

const sampleCampaigns = [
  {
    id: '1',
    title: 'Latest iPhone 15 Pro',
    description: 'Share exclusive Apple deals',
    endDate: '26/09/2025',
    earn: 6,
    image: images.phone,
  },
  {
    id: '2',
    title: 'Designer Fashion Sale',
    description: 'Premium brands at 70% off',
    endDate: '21/09/2025',
    earn: 6,
    image: images.shopping,
  },
  {
    id: '3',
    title: 'Luxury Beach Resorts',
    description: 'Early bird summer vacation deals',
    endDate: '24/09/2025',
    earn: 6,
    image:images.shopping,
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
  const { theme } = useTheme();
  const { t } = useLanguage();

  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Latest');

  const styles = createStyles(theme);

  const sortOptions = [
    'Latest',
    'Price: high to low',
    'Price: low to high',
    'Expires soon',
    'Popularity',
    'Date Created',
  ];

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.cardImage} />

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>

        <View style={styles.row}>
          <Text style={styles.timerIcon}>⏱</Text>
          <Text style={styles.endDate}>Ends on {item.endDate}</Text>
        </View>

        <View style={styles.rowBetween}>
          <View style={styles.row}>
            <Text style={styles.coinIcon}>💰</Text>
            <Text style={styles.earnText}>₹{item.earn}/click</Text>
          </View>

          <TouchableOpacity
            style={styles.shareBtn}
            onPress={() =>
              navigation.navigate('ProductDetail', { productId: item.id })
            }
          >
            <Text style={styles.shareBtnText}>Share Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      {/* HEADER */}
     <MainHeader />

      <View style={styles.divider} />

      {/* TOP SECTION */}
      <Text style={styles.sectionTitle}>Share & Earn</Text>
      <Text style={styles.sectionSubtitle}>
        Pick a deal, share with friends to earn cash per click.
      </Text>

      {/* Search + Sort */}
      <View style={styles.rowBetween}>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by category or deals..."
          />
        </View>

        {/* SORT DROPDOWN */}
        <View>
          <TouchableOpacity
            style={styles.sortBtn}
            onPress={() => setSortOpen(!sortOpen)}
          >
            <Text style={styles.sortBtnText}>Sort by</Text>
            <Text style={styles.chevron}>{sortOpen ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {sortOpen && (
            <View style={styles.dropdown}>
              {sortOptions.map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedSort(opt);
                    setSortOpen(false);
                  }}
                >
                  <Text style={styles.dropdownText}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* LIST */}
      <FlatList
        data={sampleCampaigns}
        keyExtractor={item => item.id}
        renderItem={renderCard}
        contentContainerStyle={{ paddingBottom: 120, marginTop: s(10) }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// ------------------------- STYLES -------------------------

const createStyles = theme =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: '#fff',
      padding: s(16),
    },
    divider: {
      height: 1,
      backgroundColor: '#E5E7EB',
      marginVertical: s(12),
    },

    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: s(15),
    },
    logo: {
      width: s(120),
      height: s(45),
      resizeMode: 'contain',
    },
    greeting: {
      fontSize: s(14),
      marginTop: s(4),
      color: '#444',
    },
    profileBox: {},
    profileImg: {
      width: s(40),
      height: s(40),
      borderRadius: 20,
    },

    sectionTitle: {
      fontSize: s(20),
      fontWeight: '700',
      marginBottom: s(4),
      color: '#111',
    },
    sectionSubtitle: {
      fontSize: s(13),
      color: '#777',
      marginBottom: s(20),
    },

    searchBox: {
      flex: 1,
      marginRight: s(10),
      backgroundColor: '#F2F4F7',
      borderRadius: 10,
      paddingHorizontal: s(12),
      justifyContent: 'center',
      height: s(45),
    },
    searchInput: {
      fontSize: s(14),
      color: '#333',
    },

    sortBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F2F4F7',
      paddingHorizontal: s(14),
      height: s(45),
      borderRadius: 10,
    },
    sortBtnText: {
      fontSize: s(14),
      marginRight: s(6),
      color: '#333',
    },
    chevron: {
      fontSize: s(12),
      color: '#555',
    },

    dropdown: {
      marginTop: s(6),
      backgroundColor: '#fff',
      borderRadius: 10,
      elevation: 4,
      paddingVertical: s(4),
      width: s(150),
      borderWidth: 1,
      borderColor: '#eee',
      position: 'absolute',
      right: 0,
      zIndex: 10,
    },
    dropdownItem: {
      paddingVertical: s(10),
      paddingHorizontal: s(12),
    },
    dropdownText: {
      fontSize: s(14),
      color: '#333',
    },

    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    card: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      borderRadius: 14,
      marginBottom: s(16),
      borderWidth: 1,
      borderColor: '#eee',
      padding: s(10),
      alignItems: 'flex-start',
    },
    cardImage: {
      width: s(130),
      height: s(115),
      borderRadius: 12,
      marginRight: s(12),
    },
    cardContent: {
      flex: 1,
      justifyContent: 'space-between',
    },
    cardTitle: {
      fontSize: s(16),
      fontWeight: '700',
      color: '#222',
      marginBottom: s(4),
    },
    cardDescription: {
      fontSize: s(13),
      color: '#666',
      marginBottom: s(10),
    },
    timerIcon: {
      fontSize: s(14),
      marginRight: s(4),
    },
    endDate: {
      fontSize: s(13),
      color: '#555',
    },
    coinIcon: {
      fontSize: s(16),
      marginRight: s(4),
    },
    earnText: {
      fontSize: s(14),
      fontWeight: '700',
      color: '#28A745',
    },

    shareBtn: {
      backgroundColor: '#3B7BFF',
      paddingHorizontal: s(16),
      paddingVertical: s(8),
      borderRadius: 8,
    },
    shareBtnText: {
      color: 'white',
      fontWeight: '600',
      fontSize: s(13),
    },
  });
