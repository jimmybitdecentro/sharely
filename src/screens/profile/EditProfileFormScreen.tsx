import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Container from '../../components/layouts/Container/Container';
import FormCard from '../../components/common/FormCard/FormCard';
import Label from '../../components/base/Label/Label';
import InputField from '../../components/base/InputField/InputField';
import Dropdown from '../../components/base/Dropdown/Dropdown';
import RadioGroup from '../../components/base/RadioButton/RadioGroup';
import {useTheme} from '../../hooks/useTheme';
import {useProfile} from '../../hooks/useProfile';
import {useGetCountriesQuery, useGetCitiesQuery} from '../../store/api';
import {Theme} from '../../types/theme';
import {s} from '../../theme/size';
import {Gender} from '../../types/auth.types';
import {images} from '../../theme/images';
import { ActionBar } from '../../components/common/Headers/ActionBar';

const AGE_OPTIONS = Array.from({length: 63}, (_, i) => ({
  label: String(18 + i),
  value: String(18 + i),
}));

const GENDER_OPTIONS = [
  {label: 'Male', value: 'MALE'},
  {label: 'Female', value: 'FEMALE'},
  {label: 'Other', value: 'OTHER'},
];

const EditProfileFormScreen: React.FC = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const styles = createStyles(theme);

  // Profile hook
  const {
    user,
    isUpdating,
    updateAuthProfile,
    updateExtendedProfile,
  } = useProfile();

  // Location data
  const {data: countries = [], isLoading: isLoadingCountries} = useGetCountriesQuery();
  const {data: cities = [], isLoading: isLoadingCities} = useGetCitiesQuery();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '' as Gender | '',
    countryId: '',
    cityId: '',
  });

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        age: '',
        gender: '',
        countryId: '',
        cityId: '',
      });
    }
  }, [user]);

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => {
      const newData = {...prev, [field]: value};
      // Reset city when country changes
      if (field === 'countryId') {
        newData.cityId = '';
      }
      return newData;
    });
  };

  const handleSaveChanges = async () => {
    // Update auth profile (name, email)
    if (formData.name || formData.email) {
      await updateAuthProfile({
        ...(formData.name && {name: formData.name}),
        ...(formData.email && {email: formData.email}),
      });
    }

    // Update extended profile (age, gender, location)
    const extendedData: any = {};
    if (formData.age) extendedData.age = parseInt(formData.age, 10);
    if (formData.gender) extendedData.gender = formData.gender as Gender;
    if (formData.countryId) extendedData.countryId = formData.countryId;
    if (formData.cityId) extendedData.cityId = formData.cityId;

    if (Object.keys(extendedData).length > 0) {
      await updateExtendedProfile(extendedData);
    }

    navigation.goBack();
  };

  // Transform countries/cities to dropdown format
  const countryOptions = countries.map((country) => ({
    label: country.name,
    value: country.id,
  }));

  const cityOptions = cities
    .filter((city) => !formData.countryId || city.countryId === formData.countryId)
    .map((city) => ({
      label: city.name,
      value: city.id,
    }));

  return (
    <Container style={styles.container}>
      {/* Header */}
      <ActionBar title="Edit Profile" onBackPress={() => navigation.goBack()} />
      {/* <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}>
          <Image source={images.back_white} style={styles.backIcon} />
        </TouchableOpacity>
        <Label text="Edit Profile" size={20} weight="bold" color="#FFFFFF" />
        <View style={styles.headerPlaceholder} />
      </View> */}

      {/* Form Card */}
      <FormCard
        title=""
        buttonText={isUpdating ? 'SAVING...' : 'SAVE CHANGES'}
        onSubmit={handleSaveChanges}
        position="belowHeader"
        cardStyle={styles.formCardStyle}
        keyboardBehavior="handled"
        isSubmitting={isUpdating}>
        {/* Name Field */}
        <Label
          text="What Should We Call You?"
          size={14}
          color="#1A1A1A"
          weight="medium"
          style={styles.fieldLabel}
        />
        <InputField
          placeholder="Enter your name"
          value={formData.name}
          onChangeText={(text) => handleFieldChange('name', text)}
          containerStyle={styles.inputContainer}
          editable={!isUpdating}
        />

        {/* Email Field */}
        <Label
          text="Your Email"
          size={14}
          color="#1A1A1A"
          weight="medium"
          style={styles.fieldLabel}
        />
        <InputField
          placeholder="Enter your email"
          value={formData.email}
          onChangeText={(text) => handleFieldChange('email', text)}
          containerStyle={styles.inputContainer}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isUpdating}
        />

        {/* Age Dropdown */}
        <Label
          text="Tell Us Your Age"
          size={14}
          color="#1A1A1A"
          weight="medium"
          style={styles.fieldLabel}
        />
        <Dropdown
          data={AGE_OPTIONS}
          value={formData.age}
          onSelect={(value) => handleFieldChange('age', value)}
          placeholder="Select age"
          style={styles.dropdownContainer}
        />

        {/* Gender Radio */}
        <Label
          text="How Do You Identify Yourself?"
          size={14}
          color="#1A1A1A"
          weight="medium"
          style={styles.fieldLabel}
        />
        <RadioGroup
          options={GENDER_OPTIONS}
          value={formData.gender}
          onChange={(value) => handleFieldChange('gender', value)}
          style={styles.radioContainer}
        />

        {/* Location Dropdowns */}
        <Label
          text="Where Do You Live?"
          size={14}
          color="#1A1A1A"
          weight="medium"
          style={styles.fieldLabel}
        />
        <View style={styles.locationRow}>
          {isLoadingCountries ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#23C28C" />
            </View>
          ) : (
            <Dropdown
              data={countryOptions}
              value={formData.countryId}
              onSelect={(value) => handleFieldChange('countryId', value)}
              placeholder="Country"
              style={styles.halfDropdown}
            />
          )}
          {isLoadingCities ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#23C28C" />
            </View>
          ) : (
            <Dropdown
              data={cityOptions}
              value={formData.cityId}
              onSelect={(value) => handleFieldChange('cityId', value)}
              placeholder="City"
              style={styles.halfDropdown}
            />
          )}
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
    backIcon: {
      width: s(20),
      height: s(20),
      resizeMode: 'contain',
      tintColor: '#FFFFFF',
    },
    headerPlaceholder: {
      width: s(44),
    },
    formCardStyle: {
      marginTop: s(10),
      marginBottom: s(30),
      overflow: 'hidden',
    },
    fieldLabel: {
      marginBottom: s(8),
    },
    inputContainer: {
      marginBottom: s(20),
    },
    dropdownContainer: {
      marginBottom: s(20),
    },
    radioContainer: {
      marginBottom: s(20),
    },
    locationRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: s(20),
    },
    halfDropdown: {
      width: '48%',
      marginBottom: 0,
    },
    loadingContainer: {
      width: '48%',
      height: s(50),
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default EditProfileFormScreen;
