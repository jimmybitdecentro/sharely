import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Share,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Feather from '@react-native-vector-icons/feather';
import LinearGradient from 'react-native-linear-gradient';
import Container from '../../components/layouts/Container/Container';
import FormCard from '../../components/common/FormCard/FormCard';
import Label from '../../components/base/Label/Label';
import { useTheme } from '../../hooks/useTheme';
import { Theme } from '../../types/theme';
import { RootState } from '../../store';
import { s } from '../../theme/size';
import { images } from '../../theme/images';

const GRADIENT_COLORS = ['#2C73D2', '#1A88B3', '#23C28C'];

const ReferralScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const user = useSelector((state: RootState) => state.auth.user);
  const styles = createStyles(theme);

  const referralLink = `Https://Solosfi.Com/Invite/${user?.name?.replace(' ', '-') || 'John-Do'} 23`;
  const totalReferrals = 6;
  const acceptedCount = 3;

  const handleCopyLink = async () => {
    try {
      await Share.share({
        message: referralLink,
      });
    } catch (error) {
      Alert.alert('Link', referralLink);
    }
  };

  const handleShareLink = async () => {
    try {
      await Share.share({
        message: `Join me on Sharely! Use my referral link: ${referralLink}`,
        title: 'Share Referral Link',
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  return (
    <Container style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Feather name="arrow-left" size={s(20)} color="#FFFFFF" />
        </TouchableOpacity>
        <Label text="Referral" size={20} weight="bold" color="#FFFFFF" />
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Profile Avatar Section */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarContainer}>
          <Image
            source={
              user?.profilePicture
                ? { uri: user.profilePicture }
                : images.profile
            }
            style={styles.avatar}
          />
        </View>
        <Label
          text={`${totalReferrals} Invites - ${acceptedCount} Joined`}
          size={16}
          weight="medium"
          color="#FFFFFF"
          style={styles.inviteText}
        />
      </View>

      {/* Content Card */}
      <FormCard
        title=""
        buttonText="SHARE LINK"
        onSubmit={handleShareLink}
        position="belowHeader"
        cardStyle={styles.formCardStyle}
      >
        {/* QR Code Section */}
        <View style={styles.qrSection}>
          <LinearGradient
            colors={GRADIENT_COLORS}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.qrGradientBorder}
          >
            <View style={styles.qrInner}>
              <View style={styles.qrPlaceholder}>
                <Image
                  source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(referralLink)}` }}
                  style={styles.qrImage}
                />
              </View>
            </View>
          </LinearGradient>
          <Label
            text="Scan QR code to invite"
            size={14}
            color="#666666"
            style={styles.qrLabel}
          />
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Feather name="user-plus" size={s(18)} color="#666666" />
            </View>
            <View>
              <Label text={String(totalReferrals).padStart(2, '0')} size={20} weight="bold" color="#1A1A1A" />
              <Label text="Total Referrals" size={12} color="#888888" />
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Feather name="check-circle" size={s(18)} color="#666666" />
            </View>
            <View>
              <Label text={String(acceptedCount).padStart(2, '0')} size={20} weight="bold" color="#1A1A1A" />
              <Label text="Accepted Count" size={12} color="#888888" />
            </View>
          </View>
        </View>

        {/* Referral Link Section */}
        <Label
          text="Your Referral Link"
          size={16}
          weight="bold"
          color="#1A1A1A"
          style={styles.linkTitle}
        />
        <View style={styles.linkContainer}>
          <Label
            text={referralLink}
            size={14}
            color="#666666"
            style={styles.linkText}
            numberOfLines={1}
          />
          <TouchableOpacity onPress={handleCopyLink} activeOpacity={0.7}>
            <Feather name="copy" size={s(20)} color="#666666" />
          </TouchableOpacity>
        </View>
      </FormCard>
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
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: s(40),
      paddingBottom: s(16),
    },
    backButton: {
      width: s(44),
      height: s(44),
      borderRadius: s(22),
      backgroundColor: '#23C28C',
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerPlaceholder: {
      width: s(44),
    },
    avatarSection: {
      alignItems: 'center',
      paddingVertical: s(16),
    },
    avatarContainer: {
      width: s(80),
      height: s(80),
      borderRadius: s(40),
      backgroundColor: '#4A90D9',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    avatar: {
      width: s(80),
      height: s(80),
      borderRadius: s(40),
    },
    inviteText: {
      marginTop: s(12),
    },
    formCardStyle: {
      marginTop: s(8),
      marginBottom: s(30),
      overflow: 'hidden',
    },
    qrSection: {
      alignItems: 'center',
      marginBottom: s(24),
    },
    qrGradientBorder: {
      padding: s(4),
      borderRadius: s(16),
    },
    qrInner: {
      backgroundColor: '#FFFFFF',
      borderRadius: s(12),
      padding: s(16),
    },
    qrPlaceholder: {
      width: s(180),
      height: s(180),
      justifyContent: 'center',
      alignItems: 'center',
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
      marginBottom: s(24),
    },
    statCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F8F8F8',
      borderRadius: s(12),
      paddingVertical: s(14),
      paddingHorizontal: s(16),
      width: '48%',
      borderWidth: 1,
      borderColor: '#EEEEEE',
    },
    statIconContainer: {
      width: s(36),
      height: s(36),
      borderRadius: s(18),
      backgroundColor: '#EEEEEE',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: s(10),
    },
    linkTitle: {
      marginBottom: s(12),
    },
    linkContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#FFFFFF',
      borderRadius: s(30),
      borderWidth: 1,
      borderColor: '#E0E0E0',
      paddingVertical: s(14),
      paddingHorizontal: s(20),
      marginBottom: s(24),
    },
    linkText: {
      flex: 1,
      marginRight: s(10),
    },
  });

export default ReferralScreen;

