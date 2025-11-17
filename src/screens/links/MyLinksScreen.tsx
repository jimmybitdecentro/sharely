// MyLinksScreen implementation matching provided screenshot
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { s } from '../../theme/size';
import { MainHeader } from '../../components/common/Headers/MainHeader';

const sampleLinks = [
  {
    id: '1',
    title: 'Best Tech Deals 2025',
    clicks: 25,
    revenue: 84.2,
    rate: 3.6,
    image: '',
  },
  {
    id: '2',
    title: 'Popular cat videos',
    clicks: 25,
    revenue: 84.2,
    rate: 3.6,
    image: '',
  },
  {
    id: '3',
    title: 'Best Fashion 2025',
    clicks: 25,
    revenue: 84.2,
    rate: 3.6,
    image: '',
  },
  {
    id: '4',
    title: 'Best Tech Deals 2024',
    clicks: 25,
    revenue: 84.2,
    rate: 3.6,
    image: '',
  },
];

export default function MyLinksScreen() {
  const [activeTab, setActiveTab] = useState('Today');
  const [sortOpen, setSortOpen] = useState(false);

  const renderLinkCard = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.cardImage} />

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>

        <View style={styles.badgeRow}>
          <View style={styles.badgeBlue}>
            <Feather name="send" size={s(12)} color="#1D4ED8" />
            <Text style={styles.badgeBlueText}>{item.clicks} Clicks</Text>
          </View>

          <View style={styles.badgeGreen}>
            <Feather name="dollar-sign" size={s(12)} color="#047857" />
            <Text style={styles.badgeGreenText}>₹{item.revenue}</Text>
          </View>

          <View style={styles.badgePurple}>
            <Text style={styles.badgePurpleText}>₹{item.rate}/click</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity>
        <Feather name="more-vertical" size={s(20)} color="#555" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.screen}>
      <MainHeader />
      <View style={styles.divider} />
      <Text style={styles.title}>My Links</Text>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {['Today', 'Monthly', 'All Time'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabBtn, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Earnings + Sort */}
      <View style={styles.earnSortRow}>
        <Text style={styles.earnLabel}>
          Total Earnings Today: <Text style={styles.earnValue}>₹176</Text>
        </Text>

        <TouchableOpacity
          style={styles.sortBtn}
          onPress={() => setSortOpen(!sortOpen)}
        >
          <Text style={styles.sortBtnText}>Sort by</Text>
          <Feather name="chevron-down" size={s(14)} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={sampleLinks}
        keyExtractor={item => item.id}
        renderItem={renderLinkCard}
        contentContainerStyle={{ paddingBottom: s(120), marginTop: s(10) }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
    padding: s(16),
  },
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
    flexDirection: 'row',
    marginBottom: s(16),
  },
  tabBtn: {
    paddingVertical: s(8),
    paddingHorizontal: s(20),
    backgroundColor: '#F3F4F6',
    borderRadius: s(8),
    marginRight: s(8),
  },
  tabActive: {
    backgroundColor: '#3B82F6',
  },
  tabText: {
    fontSize: s(13),
    color: '#444',
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
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: s(10),
    marginBottom: s(16),
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
    paddingVertical: s(4),
    paddingHorizontal: s(8),
    borderRadius: s(8),
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
    paddingVertical: s(4),
    paddingHorizontal: s(8),
    borderRadius: s(8),
    marginRight: s(6),
  },
  badgeGreenText: {
    fontSize: s(12),
    color: '#047857',
    marginLeft: s(4),
  },

  badgePurple: {
    backgroundColor: '#F3E8FF',
    paddingVertical: s(4),
    paddingHorizontal: s(8),
    borderRadius: s(8),
  },
  badgePurpleText: {
    fontSize: s(12),
    color: '#7E22CE',
  },
});
