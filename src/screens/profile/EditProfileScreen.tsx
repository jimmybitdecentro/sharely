import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import Feather from '@react-native-vector-icons/feather';
import Container from '../../components/layouts/Container/Container';
import FormCard from '../../components/common/FormCard/FormCard';
import Label from '../../components/base/Label/Label';
import { useTheme } from '../../hooks/useTheme';
import { Theme } from '../../types/theme';
import { RootStackParamList } from '../../types/navigation';
import { RootState } from '../../store';
import { s } from '../../theme/size';
import { images } from '../../theme/images';

type EditProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface ProfileField {
  label: string;
  value: string;
}

// Options for converting values to display labels
const DISPLAY_LABELS: Record<string, Record<string, string>> = {
  occupation: {
    software_technology: 'Software Technology',
    healthcare: 'Healthcare',
    education: 'Education',
    finance: 'Finance',
    marketing: 'Marketing',
    design: 'Design',
    other: 'Other',
  },
  interests: {
    tech: 'Tech',
    fashion: 'Fashion',
    sports: 'Sports',
    music: 'Music',
    travel: 'Travel',
    food: 'Food',
    gaming: 'Gaming',
  },
  gender: {
    male: 'Male',
    female: 'Female',
  },
  country: {
    india: 'India',
    usa: 'USA',
    uk: 'UK',
    canada: 'Canada',
    australia: 'Australia',
  },
  city: {
    hyderabad: 'Hyderabad',
    mumbai: 'Mumbai',
    delhi: 'Delhi',
    bangalore: 'Bangalore',
    chennai: 'Chennai',
    new_york: 'New York',
    los_angeles: 'Los Angeles',
    chicago: 'Chicago',
    san_francisco: 'San Francisco',
    london: 'London',
    manchester: 'Manchester',
    birmingham: 'Birmingham',
    toronto: 'Toronto',
    vancouver: 'Vancouver',
    montreal: 'Montreal',
    sydney: 'Sydney',
    melbourne: 'Melbourne',
    brisbane: 'Brisbane',
  },
};

const getDisplayLabel = (field: string, value: string | undefined, defaultValue: string): string => {
  if (!value) return defaultValue;
  return DISPLAY_LABELS[field]?.[value] || value;
};

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<EditProfileScreenNavigationProp>();
  const { theme } = useTheme();
  const user = useSelector((state: RootState) => state.auth.user);
  const styles = createStyles(theme);

  const profileFields: ProfileField[] = [
    { label: 'Legal Name', value: user?.name || 'John Deo' },
    { label: 'Email', value: user?.email || 'example@gmail.com' },
    { label: 'Occupation', value: getDisplayLabel('occupation', user?.occupation, 'Software Technology') },
    { label: 'Interests', value: getDisplayLabel('interests', user?.interests, 'Tech') },
    { label: 'Age', value: user?.age ? `${user.age} years` : '37 years' },
    { label: 'Gender', value: getDisplayLabel('gender', user?.gender, 'Male') },
    { label: 'Country', value: getDisplayLabel('country', user?.country, 'India') },
    { label: 'City', value: getDisplayLabel('city', user?.city, 'Hyderabad') },
  ];

  const handleEditProfile = () => {
    navigation.navigate('EditProfileFormModal');
  };

  const renderProfileField = (field: ProfileField, index: number) => (
    <View
      key={field.label}
      style={[
        styles.fieldRow,
        index < profileFields.length - 1 && styles.fieldRowBorder,
      ]}
    >
      <Label text={field.label} size={14} color="#666666" />
      <Label text={field.value} size={14} weight="medium" color="#1A1A1A" />
    </View>
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
        <Label text="Edit Profile" size={20} weight="bold" color="#FFFFFF" />
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Main Content Card */}
      <FormCard
        title=""
        buttonText="EDIT PROFILE"
        onSubmit={handleEditProfile}
        position="belowHeader"
        cardStyle={styles.formCardStyle}
      >
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

          {/* Verified Badge */}
          <View style={styles.verifiedBadge}>
            <View style={styles.verifiedIcon}>
              <Feather name="check" size={s(12)} color="#FFFFFF" />
            </View>
            <Label text="Verified Account" size={14} color="#23C28C" weight="medium" />
          </View>
        </View>

        {/* Profile Details Card */}
        <View style={styles.detailsCard}>
          {profileFields.map((field, index) => renderProfileField(field, index))}
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
    formCardStyle: {
      marginTop: s(10),
      marginBottom: s(30),
      overflow: 'hidden',
    },
    avatarSection: {
      alignItems: 'center',
      marginBottom: s(24),
    },
    avatarContainer: {
      width: s(100),
      height: s(100),
      borderRadius: s(50),
      backgroundColor: '#B8D4E8',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      marginBottom: s(12),
    },
    avatar: {
      width: s(100),
      height: s(100),
      borderRadius: s(50),
    },
    verifiedBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(6),
    },
    verifiedIcon: {
      width: s(20),
      height: s(20),
      borderRadius: s(10),
      backgroundColor: '#23C28C',
      justifyContent: 'center',
      alignItems: 'center',
    },
    detailsCard: {
      backgroundColor: '#EAEAEA',
      borderRadius: s(16),
      borderWidth: 1,
      borderColor: '#E8E8E8',
      paddingHorizontal: s(16),
      marginBottom: s(24),
    },
    fieldRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: s(14),
    },
    fieldRowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: '#F0F0F0',
    },
  });

export default EditProfileScreen;
