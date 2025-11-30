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
import LinearGradient from 'react-native-linear-gradient';
import { s } from '../../theme/size';
import { MainHeader } from '../../components/common/Headers/MainHeader';
import Container from '../../components/layouts/Container/Container';
import TextCustom from '../../components/base/Label/TextCustom';
import { useTheme } from '../../hooks/useTheme';
import { images } from '../../theme/images';
import WhiteCard from '../../components/common/WhiteCard';

const sampleLinks = [
  {
    id: '1',
    title: 'Best Tech Deals 2025',
    subtitle: 'Get the best tech deals of the year',
    clicks: 25,
    revenue: 84.2,
    rate: 3.6,
    image: images.announcement,
  },
  {
    id: '2',
    title: 'Popular cat videos',
    subtitle: 'Watch the most popular cat videos',
    clicks: 25,
    revenue: 84.2,
    rate: 3.6,
    image: images.announcement,
  },
  {
    id: '3',
    title: 'Best Fashion 2025',
    subtitle: 'Get the best fashion deals of the year',
    clicks: 25,
    revenue: 84.2,
    rate: 3.6,
    image: images.announcement,
  },
  {
    id: '4',
    title: 'Best Tech Deals 2024',
    subtitle: 'Get the best tech deals of the year',
    clicks: 25,
    revenue: 84.2,
    rate: 3.6,
    image: images.announcement,
  },
];

export default function MyLinksScreen() {
  const [activeTab, setActiveTab] = useState('Today');
  const [sortOpen, setSortOpen] = useState(false);
  const { theme } = useTheme(); 

  const renderLinkCard = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.cardImage} />

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <TextCustom
         text={item.subtitle} mb={s(10)} color="gray" />

        <View style={styles.badgeRow}>
          <View style={styles.badgeBlue}>
            <Text style={styles.badgeBlueText}>{item.clicks} Clicks</Text>
          </View>

          <View style={styles.badgeGreen}>
            <Text style={styles.badgeGreenText}>₹{item.revenue}</Text>
          </View>

          <View style={styles.badgePurple}>
            <Text style={styles.badgePurpleText}>₹{item.rate}/click</Text>
          </View>
        </View>
      </View>

 
    </View>
  );
  const GRADIENT_COLORS = ['#2C73D2', '#1A88B3', '#23C28C'];

  return (
    <Container>
      <MainHeader />

      <WhiteCard>


        <View style={{
          flexDirection: 'row',
          marginBottom: s(10),
          justifyContent: 'space-between', alignItems: 'center'
        }}>
          <TextCustom text="My Links" size={16}
          />
          <TextCustom text="Earnings: $176" size={16}
            color="primaryGreen"
             />
        </View>

        {/* Tabs */}
        <View style={[styles.tabsRow, {backgroundColor: theme?.colors.inputBg}]}>
          {['Today', 'Monthly', 'All Time'].map(tab => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={styles.tabBtn}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.8}
              >
                {isActive ? (
                  <LinearGradient
                    colors={GRADIENT_COLORS}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.tabGradient}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        styles.tabTextActive,
                      ]}
                    >
                      {tab}
                    </Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.tabContent}>
                    <Text style={styles.tabText}>
                      {tab}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
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
          contentContainerStyle={{ paddingBottom: s(120), marginTop: s(10),
            marginHorizontal: s(5),
           }}
          showsVerticalScrollIndicator={false}
        />
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
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
});
