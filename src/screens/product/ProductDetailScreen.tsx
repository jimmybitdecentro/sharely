import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Container from '../../components/layouts/Container/Container';
import Label from '../../components/base/Label/Label';
import { BottomSheet } from '../../components/common/BottomSheet';
import { useTheme } from '../../hooks/useTheme';
import { HomeStackParamList } from '../../types/navigation';
import { Theme } from '../../types/theme';
import { s } from '../../theme/size';
import { images } from '../../theme/images';
import WhiteCard from '../../components/common/WhiteCard';
import { ActionBar } from '../../components/common/Headers/ActionBar';

type ProductDetailScreenRouteProp = RouteProp<
  HomeStackParamList,
  'ProductDetail'
>;

const GRADIENT_COLORS = ['#2C73D2', '#1A88B3', '#23C28C'];

const TERMS_CONDITIONS = [
  'Offer Valid For Limited Time',
  'Can Only Be Used Once Per User',
  'You Earn Money Only When Different People Click Your Link.',
  "Multiple Clicks From The Same Person Won't Generate Additional Rewards.",
];

interface ProductData {
  id: string;
  title: string;
  description: string;
  clicksLeft: number;
  totalClicks: number;
  earnPerClick: number;
  endDate: string;
  pricePerClick: number;
  shareLink: string;
}

const ProductDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<ProductDetailScreenRouteProp>();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const product: ProductData = {
    id: route.params.productId,
    title: 'Latest IPhone 15 Pro',
    description:
      'Our Collection Of Iphones Are The Latest Model Available In The Market For The Best Price Possible For You. Grab One As Soon As You Can!',
    clicksLeft: 45,
    totalClicks: 100,
    earnPerClick: 15,
    endDate: '21/09/25',
    pricePerClick: 6,
    shareLink: 'Https://Example.Com/Sharely',
  };

  const progressPercent = (product.clicksLeft / product.totalClicks) * 100;

  const handleCopyLink = () => {
    Alert.alert('Copied!', 'Link copied to clipboard');
  };

  const handleGoToLink = () => {
    console.log('Go to link:', product.shareLink);
  };

  return (
    <Container style={styles.container}>
     
<ActionBar title="Product Detail"
 onBackPress={() => navigation.goBack()} 
 />
      <WhiteCard>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Product Header */}
          <View style={styles.productHeader}>
            <Image source={images.announcement} style={styles.productIcon} />
            <View style={styles.productInfo}>
              <Label
                text={product.title}
                size={18}
                weight="bold"
                color="#1A1A1A"
              />
              <Label
                text={product.description}
                size={14}
                color="#666666"
                style={styles.productDescription}
              />
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBg}>
              <LinearGradient
                colors={GRADIENT_COLORS}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${progressPercent}%` }]}
              />
            </View>
            <Label
              text={`${product.clicksLeft} Clicks Left`}
              size={14}
              weight="medium"
              color="#1A1A1A"
              style={styles.clicksLeftText}
            />
          </View>

          {/* Info Cards */}
          <View style={styles.infoCardsRow}>
            {/* Earn Per Click Card */}
            <View style={styles.infoCard}>
              <Image source={images.dollor} style={styles.infoCardIcon} />
              <View style={styles.infoCardContent}>
                <Label
                  text={`$${product.earnPerClick}`}
                  size={18}
                  weight="bold"
                  color="#1A1A1A"
                />
                <Label
                  text="per unique click"
                  size={11}
                  color="#888888"
                  numberOfLines={1}
                />
              </View>
            </View>

            {/* End Date Card */}
            <View style={styles.infoCard}>
              <Image source={images.clock} style={styles.infoCardIcon} />
              <View style={styles.infoCardContent}>
                <Label
                  text={product.endDate}
                  size={18}
                  weight="bold"
                  color="#1A1A1A"
                />
                <Label
                  text="Ending Soon..."
                  size={11}
                  color="#888888"
                  numberOfLines={1}
                />
              </View>
            </View>
          </View>

          {/* Terms & Conditions */}
          <View style={styles.termsSection}>
            <Label
              text="Terms & Conditions"
              size={20}
              weight="bold"
              color="#1A1A1A"
              style={styles.termsTitle}
            />
            {TERMS_CONDITIONS.map((term, index) => (
              <View key={index} style={styles.termRow}>
                <Label
                  text={`${index + 1}.`}
                  size={15}
                  color="#1A88B3"
                  style={styles.termNumber}
                />
                <Label
                  text={term}
                  size={15}
                  color="#666666"
                  style={styles.termText}
                />
              </View>
            ))}
          </View>

          {/* Link Box */}
          <View style={styles.linkBox}>
            <Label
              text={product.shareLink}
              size={16}
              color="#555555"
              style={styles.linkText}
            />
            <TouchableOpacity
              onPress={handleCopyLink}
              style={styles.copyButton}
            >
              <Image source={images.copy} style={styles.copyIcon} />
            </TouchableOpacity>
          </View>

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>
              ${product.pricePerClick}
              <Text style={styles.perClickText}>/Click</Text>
            </Text>
          </View>

          {/* Go To Link Button */}
          <TouchableOpacity onPress={handleGoToLink} activeOpacity={0.8}>
            <LinearGradient
              colors={GRADIENT_COLORS}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.goToLinkButton}
            >
              <Label
                text="GO TO LINK"
                size={16}
                weight="bold"
                color="#FFFFFF"
              />
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </WhiteCard>
    </Container>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: s(16),
      paddingTop: s(16),
      paddingBottom: 0,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: s(40),
      paddingBottom: s(16),
    },
    backButton: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    backIcon: {
      width: s(44),
      height: s(44),
      resizeMode: 'contain',
    },
    shareButton: {
      width: s(44),
      height: s(44),
      borderRadius: s(22),
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
    },
    shareIconHeader: {
      width: s(20),
      height: s(20),
      resizeMode: 'contain',
    },
    scrollContent: {
      paddingBottom: s(30),
    },
    productHeader: {
      flexDirection: 'row',
      marginBottom: s(20),
    },
    productIcon: {
      width: s(65),
      height: s(65),
      resizeMode: 'contain',
      marginRight: s(14),
    },
    productInfo: {
      flex: 1,
    },
    productDescription: {
      marginTop: s(8),
      lineHeight: s(22),
    },
    progressContainer: {
      marginBottom: s(20),
    },
    progressBg: {
      height: s(8),
      backgroundColor: '#E0E0E0',
      borderRadius: s(4),
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: s(4),
    },
    clicksLeftText: {
      marginTop: s(10),
    },
    infoCardsRow: {
      flexDirection: 'row',
      gap: s(10),
      marginBottom: s(28),
    },
    infoCard: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      height: s(65),
      paddingHorizontal: s(12),
      backgroundColor: '#F0F5F8',
      borderRadius: s(8),
    },
    infoCardIcon: {
      width: s(24),
      height: s(24),
      resizeMode: 'contain',
      marginRight: s(10),
      tintColor: '#1A88B3',
      alignSelf: 'flex-start',
      marginTop: s(16),
    },
    infoCardContent: {
      flex: 1,
      justifyContent: 'center',
    },
    termsSection: {
      marginBottom: s(28),
    },
    termsTitle: {
      marginBottom: s(18),
    },
    termRow: {
      flexDirection: 'row',
      marginBottom: s(12),
    },
    termNumber: {
      width: s(24),
    },
    termText: {
      flex: 1,
      lineHeight: s(20),
    },
    linkBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: s(30),
      paddingHorizontal: s(16),
      paddingVertical: s(16),
      marginBottom: s(28),
      borderWidth: 1,
      borderColor: '#D0D0D0',
    },
    linkText: {
      flex: 1,
    },
    copyButton: {
      padding: s(4),
    },
    copyIcon: {
      width: s(20),
      height: s(20),
      resizeMode: 'contain',
    },
    priceContainer: {
      alignItems: 'center',
      marginBottom: s(20),
    },
    priceText: {
      fontSize: s(24),
      fontFamily: theme.fonts.bold,
      color: '#23C28C',
    },
    perClickText: {
      fontSize: s(24),
      fontFamily: theme.fonts.bold,
      color: '#1A1A1A',
    },
    goToLinkButton: {
      height: s(56),
      borderRadius: s(28),
      justifyContent: 'center',
      alignItems: 'center',
    },

    // Share Bottom Sheet Styles
    shareSubtitle: {
      textAlign: 'center',
      marginBottom: s(20),
    },
    shareLinkBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: s(30),
      paddingHorizontal: s(20),
      paddingVertical: s(16),
      marginBottom: s(24),
      borderWidth: 1,
      borderColor: '#E0E0E0',
    },
    shareLinkText: {
      flex: 1,
    },
    shareCopyIcon: {
      width: s(22),
      height: s(22),
      resizeMode: 'contain',
    },
    shareOptionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      paddingHorizontal: s(10),
    },
    shareOptionItem: {
      width: '25%',
      alignItems: 'center',
      marginBottom: s(16),
    },
    shareOptionIcon: {
      width: s(52),
      height: s(52),
      borderRadius: s(26),
      justifyContent: 'center',
      alignItems: 'center',
    },
    shareOptionEmoji: {
      fontSize: s(24),
    },
  });

export default ProductDetailScreen;
