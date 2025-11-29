import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import Feather from '@react-native-vector-icons/feather';
import LinearGradient from 'react-native-linear-gradient';
import Container from '../../components/layouts/Container/Container';
import FormCard from '../../components/common/FormCard/FormCard';
import Label from '../../components/base/Label/Label';
import { useTheme } from '../../hooks/useTheme';
import { RootStackParamList } from '../../types/navigation';
import { Theme } from '../../types/theme';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { storageService } from '../../services/storage/storageService';
import { s } from '../../theme/size';
import { images } from '../../theme/images';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface MenuItem {
  key: string;
  label: string;
  icon: string;
  screen?: keyof RootStackParamList;
  action?: () => void;
  isLogout?: boolean;
}

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const user = useSelector((state: RootState) => state.auth.user);
  const styles = createStyles(theme);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutPress = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    setShowLogoutModal(false);
    await storageService.removeAuthToken();
    await storageService.removeUserData();
    dispatch(logout());
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const menuItems: MenuItem[] = [
    { key: 'editProfile', label: 'Edit Profile', icon: 'user', screen: 'EditProfileModal' },
    { key: 'paymentMethods', label: 'Payment Methods', icon: 'credit-card' },
    { key: 'preferences', label: 'Preferences', icon: 'sliders', screen: 'PreferencesModal' },
    { key: 'referral', label: 'Referral', icon: 'user-plus', screen: 'ReferralModal' },
    { key: 'helpSupport', label: 'Help & Support', icon: 'help-circle' },
    { key: 'transaction', label: 'Transaction', icon: 'list' },
    { key: 'logout', label: 'Log out', icon: 'log-out', action: handleLogoutPress, isLogout: true },
  ];

  const handleMenuPress = (item: MenuItem) => {
    if (item.action) {
      item.action();
    } else if (item.screen) {
      // Navigate to the modal screen (no tab bar)
      navigation.navigate(item.screen as any);
    }
  };

  const renderMenuItem = (item: MenuItem, index: number) => (
    <TouchableOpacity
      key={item.key}
      style={[
        styles.menuItem,
        index === menuItems.length - 1 && styles.menuItemLast,
      ]}
      onPress={() => handleMenuPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.menuIconContainer, item.isLogout && styles.logoutIconContainer]}>
          <Feather
            name={item.icon as any}
            size={s(20)}
            color={item.isLogout ? '#EF5350' : '#666666'}
          />
        </View>
        <Label
          text={item.label}
          size={15}
          weight="medium"
          color={item.isLogout ? '#EF5350' : '#1A1A1A'}
        />
      </View>
      {!item.isLogout && (
        <Feather name="chevron-right" size={s(20)} color="#CCCCCC" />
      )}
    </TouchableOpacity>
  );

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
        <Label text="My Profile" size={20} weight="bold" color="#FFFFFF" />
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Profile Info */}
      <View style={styles.profileSection}>
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
          text={user?.name || 'John Deo'}
          size={20}
          weight="bold"
          color="#FFFFFF"
          style={styles.userName}
        />
        <Label
          text="Member since Jun 2022"
          size={14}
          color="#23C28C"
          style={styles.memberSince}
        />
      </View>

      {/* Menu Card */}
      <FormCard
        title=""
        buttonText=""
        onSubmit={() => { }}
        showButton={false}
        position="belowHeader"
        cardStyle={styles.formCardStyle}
      >
        <View style={styles.menuContent}>
          {menuItems.map((item, index) => renderMenuItem(item, index))}
        </View>
      </FormCard>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="slide"
        onRequestClose={handleCancelLogout}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Logout Icon */}
            <View style={styles.logoutModalIcon}>
              <Feather name="log-out" size={s(32)} color="#EF5350" />
            </View>

            {/* Title */}
            <Label
              text="Log Out"
              size={22}
              weight="bold"
              color="#1A1A1A"
              style={styles.modalTitle}
            />

            {/* Message */}
            <Label
              text="Are you sure you want to log out of your account?"
              size={14}
              color="#666666"
              style={styles.modalMessage}
            />

            {/* Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelLogout}
                activeOpacity={0.8}
              >
                <Label text="NO" size={16} weight="bold" color="#1A1A1A" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmLogout}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#2C73D2', '#23C28C']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.confirmButtonGradient}
                >
                  <Label text="YES" size={16} weight="bold" color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
      paddingBottom: s(20),
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
    profileSection: {
      alignItems: 'center',
      paddingTop: s(10),
      paddingBottom: s(16),
    },
    avatarContainer: {
      width: s(100),
      height: s(100),
      borderRadius: s(50),
      backgroundColor: '#4A90D9',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    avatar: {
      width: s(100),
      height: s(100),
      borderRadius: s(50),
    },
    userName: {
      marginTop: s(12),
    },
    memberSince: {
      marginTop: s(4),
    },
    formCardStyle: {
      overflow: 'hidden',
      paddingTop: 0,
      marginBottom: s(30),
    },
    menuContent: {
      marginTop: s(-16),
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: s(14),
      borderBottomWidth: 1,
      borderBottomColor: '#F5F5F5',
    },
    menuItemLast: {
      borderBottomWidth: 0,
    },
    menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    menuIconContainer: {
      width: s(40),
      height: s(40),
      borderRadius: s(20),
      backgroundColor: '#F5F5F5',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: s(14),
    },
    logoutIconContainer: {
      backgroundColor: '#FFEBEE',
    },
    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: '#FFFFFF',
      borderTopLeftRadius: s(30),
      borderTopRightRadius: s(30),
      paddingHorizontal: s(24),
      paddingTop: s(32),
      paddingBottom: s(40),
      alignItems: 'center',
    },
    logoutModalIcon: {
      width: s(70),
      height: s(70),
      borderRadius: s(35),
      backgroundColor: '#FFEBEE',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: s(20),
    },
    modalTitle: {
      marginBottom: s(12),
    },
    modalMessage: {
      textAlign: 'center',
      marginBottom: s(28),
      lineHeight: s(22),
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    cancelButton: {
      flex: 1,
      height: s(50),
      borderRadius: s(25),
      borderWidth: 1,
      borderColor: '#E0E0E0',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: s(12),
    },
    confirmButton: {
      flex: 1,
      height: s(50),
      borderRadius: s(25),
      overflow: 'hidden',
    },
    confirmButtonGradient: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default ProfileScreen;
