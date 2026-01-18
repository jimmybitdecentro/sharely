import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ImageSourcePropType,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import Container from '../../components/layouts/Container/Container';
import FormCard from '../../components/common/FormCard/FormCard';
import Label from '../../components/base/Label/Label';
import {useTheme} from '../../hooks/useTheme';
import {useAuth} from '../../hooks/useAuth';
import {RootStackParamList} from '../../types/navigation';
import {Theme} from '../../types/theme';
import {s} from '../../theme/size';
import {images} from '../../theme/images';
import {ActionBar} from '../../components/common/Headers/ActionBar';
import IVCircle from '../../components/base/ImageView/IVCircle';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface MenuItem {
  key: string;
  label: string;
  icon: ImageSourcePropType;
  screen?: keyof RootStackParamList;
  action?: () => void;
  isLogout?: boolean;
}

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const {theme} = useTheme();
  const {user, logout, isLoading} = useAuth();
  const styles = createStyles(theme);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutPress = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    setShowLogoutModal(false);
    await logout();
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const menuItems: MenuItem[] = [
    {key: 'editProfile', label: 'Edit Profile', icon: images.editProfile, screen: 'EditProfileModal'},
    {key: 'paymentMethods', label: 'Payment Methods', icon: images.paymentMethod},
    {key: 'preferences', label: 'Preferences', icon: images.preferences, screen: 'PreferencesModal'},
    {key: 'referral', label: 'Referral', icon: images.referral, screen: 'ReferralModal'},
    {key: 'helpSupport', label: 'Help & Support', icon: images.help, screen: 'HelpSupportModal'},
    {key: 'transaction', label: 'Transaction', icon: images.transaction, screen: 'TransactionsModal'},
    {key: 'logout', label: 'Log out', icon: images.logout, action: handleLogoutPress, isLogout: true},
  ];

  const handleMenuPress = (item: MenuItem) => {
    if (item.action) {
      item.action();
    } else if (item.screen) {
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
      activeOpacity={0.7}>
      <View style={styles.menuItemLeft}>
        <Image source={item.icon} style={styles.menuIcon} />
        <Label
          text={item.label}
          size={15}
          weight="medium"
          color={item.isLogout ? '#EF5350' : '#1A1A1A'}
        />
      </View>
      {!item.isLogout && (
        <Image source={images.rightArrow} style={styles.arrowIcon} />
      )}
    </TouchableOpacity>
  );

  return (
    <Container style={styles.container}>
      <ActionBar title="My Profile" onBackPress={() => navigation.goBack()} />

      {/* Profile Info */}
      <View style={styles.profileSection}>
        <IVCircle size={80} src={images.profile} />
        <Label
          text={user?.name || 'User'}
          size={20}
          weight="bold"
          color="#FFFFFF"
          style={styles.userName}
        />
        <Label
          text={user?.email || ''}
          size={14}
          color="#AAAAAA"
          style={styles.userEmail}
        />
        {user?.referralCode && (
          <View style={styles.referralBadge}>
            <Image source={images.referral} style={styles.referralBadgeIcon} />
            <Label
              text={`Referral: ${user.referralCode}`}
              size={12}
              color="#23C28C"
              style={{marginLeft: s(4)}}
            />
          </View>
        )}
      </View>

      {/* Menu Card */}
      <FormCard
        title=""
        buttonText=""
        onSubmit={() => {}}
        showButton={false}
        position="belowHeader"
        cardStyle={styles.formCardStyle}>
        <View style={styles.menuContent}>
          {menuItems.map((item, index) => renderMenuItem(item, index))}
        </View>
      </FormCard>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="slide"
        onRequestClose={handleCancelLogout}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Logout Icon */}
            <Image source={images.logout} style={styles.modalLogoutImage} />

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
                activeOpacity={0.8}>
                <Label text="NO" size={16} weight="bold" color="#1A1A1A" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmLogout}
                activeOpacity={0.8}
                disabled={isLoading}>
                <LinearGradient
                  colors={['#2C73D2', '#23C28C']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.confirmButtonGradient}>
                  <Label text={isLoading ? '...' : 'YES'} size={16} weight="bold" color="#FFFFFF" />
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
    profileSection: {
      alignItems: 'center',
      paddingTop: s(10),
      paddingBottom: s(16),
    },
    userName: {
      marginTop: s(12),
    },
    userEmail: {
      marginTop: s(4),
    },
    referralBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: s(8),
      backgroundColor: 'rgba(35, 194, 140, 0.1)',
      paddingHorizontal: s(12),
      paddingVertical: s(6),
      borderRadius: s(16),
    },
    referralBadgeIcon: {
      width: s(18),
      height: s(18),
      resizeMode: 'contain',
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
    menuIcon: {
      width: s(40),
      height: s(40),
      resizeMode: 'contain',
      marginRight: s(14),
    },
    arrowIcon: {
      width: s(16),
      height: s(8),
      resizeMode: 'contain',
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
    modalLogoutImage: {
      width: s(70),
      height: s(70),
      resizeMode: 'contain',
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
