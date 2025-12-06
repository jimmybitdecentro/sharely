import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Share,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Clipboard,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import Container from '../../components/layouts/Container/Container';
import Label from '../../components/base/Label/Label';
import InputField from '../../components/base/InputField/InputField';
import {useTheme} from '../../hooks/useTheme';
import {useReferral} from '../../hooks/useReferral';
import {Theme} from '../../types/theme';
import {s} from '../../theme/size';
import {images} from '../../theme/images';
import {ActionBar} from '../../components/common/Headers/ActionBar';
import WhiteCard from '../../components/common/WhiteCard';

const GRADIENT_COLORS = ['#2C73D2', '#1A88B3', '#23C28C'];

// Generate QR code URL using a free API
const getQRCodeUrl = (data: string, size: number = 200) => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}&color=1A88B3&bgcolor=FFFFFF`;
};

const ReferralScreen: React.FC = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const styles = createStyles(theme);

  // Referral data
  const {
    myReferralCode,
    totalReferrals,
    totalEarnedFromReferrals,
    referralsGiven,
    hasBeenReferred,
    referralReceived,
    isLoading,
    isApplying,
    error,
    refetch,
    applyReferralCode,
  } = useReferral();

  const [inputReferralCode, setInputReferralCode] = useState('');

  const referralLink = myReferralCode
    ? `https://sharely.app/invite/${myReferralCode}`
    : '';

  const handleCopyLink = () => {
    if (!referralLink) return;
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      Clipboard.setString(referralLink);
    }
    Toast.show({
      type: 'success',
      text1: 'Copied!',
      text2: 'Referral link copied to clipboard',
    });
  };

  const handleShareLink = async () => {
    if (!referralLink) return;
    try {
      await Share.share({
        message: `Join me on Sharely! Use my referral code: ${myReferralCode}\n\n${referralLink}`,
        title: 'Share Referral Link',
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const acceptedCount = referralsGiven.length;

  // Loading state
  if (isLoading) {
    return (
      <Container style={styles.container}>
        <ActionBar title="Referral" onBackPress={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#23C28C" />
          <Label
            text="Loading referral info..."
            size={14}
            color="#888888"
            style={{marginTop: s(10)}}
          />
        </View>
      </Container>
    );
  }

  return (
    <Container style={styles.container}>
      <ActionBar title="Referral" onBackPress={() => navigation.goBack()} />

      {/* Header Section with Avatar */}
      <View style={styles.headerSection}>
        <View style={styles.avatarContainer}>
          <Image source={images.profile} style={styles.avatar} />
        </View>
        <Label
          text={`${totalReferrals} Invites - ${acceptedCount} Joined`}
          size={16}
          weight="medium"
          color="#FFFFFF"
          style={styles.inviteText}
        />
      </View>

      {/* White Card Content */}
      <WhiteCard>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              colors={['#23C28C']}
              tintColor="#23C28C"
            />
          }>
          {/* QR Code Section */}
          {myReferralCode && referralLink && (
            <View style={styles.qrSection}>
              <LinearGradient
                colors={GRADIENT_COLORS}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.qrGradientBorder}>
                <View style={styles.qrInner}>
                  <Image
                    source={{uri: getQRCodeUrl(referralLink, 220)}}
                    style={styles.qrImage}
                    resizeMode="contain"
                  />
                </View>
              </LinearGradient>
              <Label
                text="Scan QR code to invite"
                size={14}
                color="#666666"
                style={styles.qrLabel}
              />
            </View>
          )}

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Image source={images.referral} style={styles.statIcon} />
              <View style={styles.statTextContainer}>
                <Label
                  text={String(totalReferrals).padStart(2, '0')}
                  size={22}
                  weight="bold"
                  color="#1A1A1A"
                />
                <Label text="Total Referrals" size={11} color="#888888" />
              </View>
            </View>

            <View style={styles.statCard}>
              <View style={styles.checkIconContainer}>
                <Label text="✓" size={14} weight="bold" color="#23C28C" />
              </View>
              <View style={styles.statTextContainer}>
                <Label
                  text={String(acceptedCount).padStart(2, '0')}
                  size={22}
                  weight="bold"
                  color="#1A1A1A"
                />
                <Label text="Accepted Count" size={11} color="#888888" />
              </View>
            </View>
          </View>

          {/* Referral Link Section */}
          <View style={styles.sectionContainer}>
            <Label
              text="Your Referral Link"
              size={15}
              weight="semiBold"
              color="#1A1A1A"
              style={styles.sectionTitle}
            />
            <View style={styles.linkContainer}>
              <Label
                text={referralLink || 'Loading...'}
                size={14}
                color="#666666"
                style={styles.linkText}
                numberOfLines={1}
              />
              <TouchableOpacity onPress={handleCopyLink} activeOpacity={0.7}>
                <Image source={images.copy} style={styles.copyIcon} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Share Button */}
          <TouchableOpacity
            onPress={handleShareLink}
            activeOpacity={0.8}
            style={styles.shareButtonContainer}>
            <LinearGradient
              colors={GRADIENT_COLORS}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.shareButton}>
              <Label text="SHARE LINK" size={16} weight="bold" color="#FFFFFF" />
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
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerSection: {
      alignItems: 'center',
      paddingVertical: s(20),
    },
    avatarContainer: {
      width: s(90),
      height: s(90),
      borderRadius: s(45),
      backgroundColor: '#6BA3D6',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      borderWidth: 3,
      borderColor: 'rgba(255,255,255,0.3)',
    },
    avatar: {
      width: s(90),
      height: s(90),
      borderRadius: s(45),
    },
    inviteText: {
      marginTop: s(14),
    },
    scrollContent: {
      paddingBottom: s(30),
    },
    qrSection: {
      alignItems: 'center',
      marginBottom: s(24),
      marginTop: s(8),
    },
    qrGradientBorder: {
      padding: s(4),
      borderRadius: s(20),
    },
    qrInner: {
      backgroundColor: '#FFFFFF',
      borderRadius: s(16),
      padding: s(16),
    },
    qrImage: {
      width: s(180),
      height: s(180),
    },
    qrLabel: {
      marginTop: s(16),
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: s(28),
      paddingHorizontal: s(8),
    },
    statCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: s(12),
      paddingVertical: s(14),
      paddingHorizontal: s(14),
      width: '47%',
      borderWidth: 1,
      borderColor: '#EEEEEE',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    statIcon: {
      width: s(36),
      height: s(36),
      resizeMode: 'contain',
      marginRight: s(10),
    },
    checkIconContainer: {
      width: s(36),
      height: s(36),
      borderRadius: s(18),
      backgroundColor: '#E8F5E9',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: s(10),
    },
    statTextContainer: {
      flex: 1,
    },
    sectionContainer: {
      marginBottom: s(24),
    },
    sectionTitle: {
      marginBottom: s(12),
    },
    linkContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#FFFFFF',
      borderRadius: s(30),
      borderWidth: 1,
      borderColor: '#E5E5E5',
      paddingVertical: s(16),
      paddingHorizontal: s(20),
    },
    linkText: {
      flex: 1,
      marginRight: s(10),
    },
    copyIcon: {
      width: s(22),
      height: s(22),
      resizeMode: 'contain',
      tintColor: '#888888',
    },
    shareButtonContainer: {
      marginTop: s(8),
    },
    shareButton: {
      alignItems: 'center',
      justifyContent: 'center',
      height: s(56),
      borderRadius: s(28),
    },
  });

export default ReferralScreen;
