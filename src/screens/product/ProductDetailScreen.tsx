import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
  Share,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import Container from '../../components/layouts/Container/Container';
import Label from '../../components/base/Label/Label';
import {BottomSheet} from '../../components/common/BottomSheet';
import {useTheme} from '../../hooks/useTheme';
import {useCampaignDetail} from '../../hooks/useCampaigns';
import {HomeStackParamList} from '../../types/navigation';
import {Theme} from '../../types/theme';
import {s} from '../../theme/size';
import {images} from '../../theme/images';
import WhiteCard from '../../components/common/WhiteCard';
import {ActionBar} from '../../components/common/Headers/ActionBar';
import {ShareLink} from '../../types';

type ProductDetailScreenRouteProp = RouteProp<HomeStackParamList, 'ProductDetail'>;

const GRADIENT_COLORS = ['#2C73D2', '#1A88B3', '#23C28C'];

const DEFAULT_TERMS = [
  'Offer Valid For Limited Time',
  'Can Only Be Used Once Per User',
  'You Earn Money Only When Different People Click Your Link.',
  "Multiple Clicks From The Same Person Won't Generate Additional Rewards.",
];

const ProductDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<ProductDetailScreenRouteProp>();
  const {theme} = useTheme();
  const styles = createStyles(theme);

  const campaignId = route.params.productId;
  
  // Fetch campaign details
  const {
    campaign,
    isLoading,
    isFetching,
    error,
    generateShareLink,
    isGenerating,
    refetch,
  } = useCampaignDetail(campaignId);

  const [shareLink, setShareLink] = useState<ShareLink | null>(null);
  const [shareSheetVisible, setShareSheetVisible] = useState(false);

  // Calculate progress
  const clicksUsed = campaign?.analytics?.totalClicks || 0;
  const totalBudgetClicks = campaign?.budget && campaign?.rewardRules?.rewardPerClick
    ? Math.floor(campaign.budget / campaign.rewardRules.rewardPerClick)
    : 100;
  const clicksLeft = Math.max(0, totalBudgetClicks - clicksUsed);
  const progressPercent = Math.min(100, (clicksUsed / totalBudgetClicks) * 100);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No end date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  };

  const handleGenerateLink = async () => {
    const result = await generateShareLink();
    if (result.success && result.shareLink) {
      setShareLink(result.shareLink);
      setShareSheetVisible(true);
    }
  };

  const handleCopyLink = async () => {
    const linkToCopy = shareLink?.shortUrl || campaign?.url;
    if (linkToCopy) {
      try {
        // Use Share API to copy/share the link
        await Share.share({
          message: linkToCopy,
        });
      } catch (err) {
        Toast.show({
          type: 'info',
          text1: 'Your Link',
          text2: linkToCopy,
        });
      }
    }
  };

  const handleShareLink = async () => {
    const linkToShare = shareLink?.shortUrl || campaign?.url;
    if (linkToShare) {
      try {
        await Share.share({
          message: `Check out this deal: ${campaign?.title}\n\n${linkToShare}`,
          url: linkToShare,
        });
      } catch (err) {
        console.error('Share error:', err);
      }
    }
  };

  const handleGoToLink = () => {
    const url = shareLink?.fullUrl || campaign?.url;
    if (url) {
      Linking.openURL(url).catch((err) => {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Could not open link',
        });
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Container style={styles.container}>
        <ActionBar title="Campaign Detail" onBackPress={() => navigation.goBack()} />
        <WhiteCard>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#23C28C" />
            <Label text="Loading campaign..." size={14} color="#888888" style={{marginTop: s(10)}} />
          </View>
        </WhiteCard>
      </Container>
    );
  }

  // Error state
  if (error || !campaign) {
    return (
      <Container style={styles.container}>
        <ActionBar title="Campaign Detail" onBackPress={() => navigation.goBack()} />
        <WhiteCard>
          <View style={styles.errorContainer}>
            <Image source={images.announcement} style={styles.errorImage} />
            <Label text="Failed to load campaign" size={16} weight="medium" color="#888888" />
            <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
              <Label text="Tap to retry" size={14} color="#1A88B3" />
            </TouchableOpacity>
          </View>
        </WhiteCard>
      </Container>
    );
  }

  const terms = campaign.terms?.length ? campaign.terms : DEFAULT_TERMS;

  return (
    <Container style={styles.container}>
      <ActionBar
        title="Campaign Detail"
        onBackPress={() => navigation.goBack()}
        sharePress
        onSharePress={handleShareLink}
      />
      <WhiteCard>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Product Header */}
          <View style={styles.productHeader}>
            {campaign.thumbnail ? (
              <Image source={{uri: campaign.thumbnail}} style={styles.productIcon} />
            ) : (
              <Image source={images.announcement} style={styles.productIcon} />
            )}
            <View style={styles.productInfo}>
              <Label text={campaign.title} size={18} weight="bold" color="#1A1A1A" />
              <Label
                text={campaign.description || 'No description available'}
                size={14}
                color="#666666"
                style={styles.productDescription}
                numberOfLines={4}
              />
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBg}>
              <LinearGradient
                colors={GRADIENT_COLORS}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={[styles.progressFill, {width: `${progressPercent}%`}]}
              />
            </View>
            <Label
              text={`${clicksLeft} Clicks Left`}
              size={14}
              weight="medium"
              color="#1A1A1A"
              style={styles.clicksLeftText}
            />
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Label text="Total Clicks" size={12} color="#888888" />
              <Label text={String(campaign.analytics.totalClicks)} size={20} weight="bold" color="#1A1A1A" />
            </View>
            <View style={styles.statItem}>
              <Label text="Shares" size={12} color="#888888" />
              <Label text={String(campaign.analytics.totalShares)} size={20} weight="bold" color="#1A1A1A" />
            </View>
            <View style={styles.statItem}>
              <Label text="CTR" size={12} color="#888888" />
              <Label text={`${campaign.analytics.ctr.toFixed(1)}%`} size={20} weight="bold" color="#23C28C" />
            </View>
          </View>

          {/* Info Cards */}
          <View style={styles.infoCardsRow}>
            {/* Earn Per Click Card */}
            <View style={styles.infoCard}>
              <Image source={images.dollor} style={styles.infoCardIcon} />
              <View style={styles.infoCardContent}>
                <Label
                  text={`${campaign.currencySymbol || '$'}${campaign.rewardRules.rewardPerClick}`}
                  size={18}
                  weight="bold"
                  color="#1A1A1A"
                />
                <Label text="per unique click" size={11} color="#888888" numberOfLines={1} />
              </View>
            </View>

            {/* End Date Card */}
            <View style={styles.infoCard}>
              <Image source={images.clock} style={styles.infoCardIcon} />
              <View style={styles.infoCardContent}>
                <Label
                  text={formatDate(campaign.endDate)}
                  size={18}
                  weight="bold"
                  color="#1A1A1A"
                />
                <Label
                  text={campaign.endDate ? 'Ending Soon...' : 'No expiry'}
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
            {terms.map((term, index) => (
              <View key={index} style={styles.termRow}>
                <Label text={`${index + 1}.`} size={15} color="#1A88B3" style={styles.termNumber} />
                <Label text={term} size={15} color="#666666" style={styles.termText} />
              </View>
            ))}
          </View>

          {/* Link Box - Show if share link exists */}
          {shareLink && (
            <View style={styles.linkBox}>
              <Label
                text={shareLink.shortUrl}
                size={16}
                color="#555555"
                style={styles.linkText}
                numberOfLines={1}
              />
              <TouchableOpacity onPress={handleCopyLink} style={styles.copyButton}>
                <Image source={images.clipboard} style={styles.copyIcon} />
              </TouchableOpacity>
            </View>
          )}

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>
              {campaign.currencySymbol || '$'}
              {campaign.rewardRules.rewardPerClick}
              <Text style={styles.perClickText}>/Click</Text>
            </Text>
          </View>

          {/* Action Buttons */}
          {!shareLink ? (
            <TouchableOpacity
              onPress={handleGenerateLink}
              activeOpacity={0.8}
              disabled={isGenerating}>
              <LinearGradient
                colors={GRADIENT_COLORS}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.goToLinkButton}>
                {isGenerating ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Label text="GENERATE SHARE LINK" size={16} weight="bold" color="#FFFFFF" />
                )}
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={handleCopyLink}
                style={styles.secondaryButton}
                activeOpacity={0.8}>
                <Label text="COPY LINK" size={14} weight="bold" color="#1A1A1A" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleGoToLink} activeOpacity={0.8} style={{flex: 1}}>
                <LinearGradient
                  colors={GRADIENT_COLORS}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.primaryButton}>
                  <Label text="GO TO LINK" size={14} weight="bold" color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </WhiteCard>

      {/* Share Bottom Sheet */}
      <BottomSheet
        visible={shareSheetVisible}
        onClose={() => setShareSheetVisible(false)}
        title="Share Your Link">
        <Label
          text="Share this link to earn rewards!"
          size={14}
          color="#888888"
          style={styles.shareSubtitle}
        />

        <View style={styles.shareLinkBox}>
          <Label
            text={shareLink?.shortUrl || ''}
            size={14}
            color="#555555"
            style={styles.shareLinkText}
            numberOfLines={1}
          />
          <TouchableOpacity onPress={handleCopyLink}>
            <Image source={images.clipboard} style={styles.shareCopyIcon} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleShareLink} activeOpacity={0.8}>
          <LinearGradient
            colors={GRADIENT_COLORS}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.shareButton}>
            <Label text="SHARE NOW" size={16} weight="bold" color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </BottomSheet>
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
    scrollContent: {
      paddingBottom: s(30),
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: s(100),
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: s(100),
    },
    errorImage: {
      width: s(80),
      height: s(80),
      resizeMode: 'contain',
      opacity: 0.5,
      marginBottom: s(16),
    },
    retryButton: {
      marginTop: s(12),
      padding: s(8),
    },
    productHeader: {
      flexDirection: 'row',
      marginBottom: s(20),
    },
    productIcon: {
      width: s(65),
      height: s(65),
      resizeMode: 'cover',
      borderRadius: s(12),
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
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: s(20),
      paddingHorizontal: s(10),
    },
    statItem: {
      alignItems: 'center',
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
    buttonRow: {
      flexDirection: 'row',
      gap: s(12),
    },
    secondaryButton: {
      flex: 1,
      height: s(56),
      borderRadius: s(28),
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#E0E0E0',
      backgroundColor: '#FFFFFF',
    },
    primaryButton: {
      height: s(56),
      borderRadius: s(28),
      justifyContent: 'center',
      alignItems: 'center',
    },
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
    shareButton: {
      height: s(56),
      borderRadius: s(28),
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default ProductDetailScreen;
