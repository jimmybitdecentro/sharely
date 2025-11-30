import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import Feather from '@react-native-vector-icons/feather';
import Container from '../../components/layouts/Container/Container';
import FormCard from '../../components/common/FormCard/FormCard';
import Label from '../../components/base/Label/Label';
import InputField from '../../components/base/InputField/InputField';
import Dropdown from '../../components/base/Dropdown/Dropdown';
import RadioGroup from '../../components/base/RadioButton/RadioGroup';
import { useTheme } from '../../hooks/useTheme';
import { Theme } from '../../types/theme';
import { RootState } from '../../store';
import { updateUser } from '../../store/slices/authSlice';
import { s } from '../../theme/size';

const OCCUPATION_OPTIONS = [
  { label: 'Software Technology', value: 'software_technology' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Education', value: 'education' },
  { label: 'Finance', value: 'finance' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Design', value: 'design' },
  { label: 'Other', value: 'other' },
];

const INTERESTS_OPTIONS = [
  { label: 'Tech', value: 'tech' },
  { label: 'Fashion', value: 'fashion' },
  { label: 'Sports', value: 'sports' },
  { label: 'Music', value: 'music' },
  { label: 'Travel', value: 'travel' },
  { label: 'Food', value: 'food' },
  { label: 'Gaming', value: 'gaming' },
];

const AGE_OPTIONS = Array.from({ length: 63 }, (_, i) => ({
  label: String(18 + i),
  value: String(18 + i),
}));

const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

const COUNTRY_OPTIONS = [
  { label: 'India', value: 'india' },
  { label: 'USA', value: 'usa' },
  { label: 'UK', value: 'uk' },
  { label: 'Canada', value: 'canada' },
  { label: 'Australia', value: 'australia' },
];

const CITY_OPTIONS: Record<string, { label: string; value: string }[]> = {
  india: [
    { label: 'Hyderabad', value: 'hyderabad' },
    { label: 'Mumbai', value: 'mumbai' },
    { label: 'Delhi', value: 'delhi' },
    { label: 'Bangalore', value: 'bangalore' },
    { label: 'Chennai', value: 'chennai' },
  ],
  usa: [
    { label: 'New York', value: 'new_york' },
    { label: 'Los Angeles', value: 'los_angeles' },
    { label: 'Chicago', value: 'chicago' },
    { label: 'San Francisco', value: 'san_francisco' },
  ],
  uk: [
    { label: 'London', value: 'london' },
    { label: 'Manchester', value: 'manchester' },
    { label: 'Birmingham', value: 'birmingham' },
  ],
  canada: [
    { label: 'Toronto', value: 'toronto' },
    { label: 'Vancouver', value: 'vancouver' },
    { label: 'Montreal', value: 'montreal' },
  ],
  australia: [
    { label: 'Sydney', value: 'sydney' },
    { label: 'Melbourne', value: 'melbourne' },
    { label: 'Brisbane', value: 'brisbane' },
  ],
};

// Helper to get label from value
const getLabelFromValue = (
  options: { label: string; value: string }[],
  value: string
): string => {
  const option = options.find(opt => opt.value === value);
  return option?.label || value;
};

const EditProfileFormScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const user = useSelector((state: RootState) => state.auth.user);
  const styles = createStyles(theme);

  const [formData, setFormData] = useState({
    name: user?.name || 'John Deo',
    occupation: user?.occupation || 'software_technology',
    interests: user?.interests || 'tech',
    age: user?.age || '37',
    gender: user?.gender || 'male',
    country: user?.country || 'india',
    city: user?.city || 'hyderabad',
  });

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      // Reset city when country changes
      if (field === 'country') {
        newData.city = '';
      }
      return newData;
    });
  };

  const handleSaveChanges = () => {
    // Dispatch update to Redux store - store VALUES (not labels)
    // Labels will be converted in EditProfileScreen for display
    dispatch(updateUser({
      name: formData.name,
      occupation: formData.occupation,
      interests: formData.interests,
      age: formData.age,
      gender: formData.gender,
      country: formData.country,
      city: formData.city,
    }));

    navigation.goBack();
  };

  const getCityOptions = () => {
    return CITY_OPTIONS[formData.country] || [];
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
        <Label text="Edit Profile" size={20} weight="bold" color="#FFFFFF" />
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Form Card */}
      <FormCard
        title=""
        buttonText="SAVE CHANGES"
        onSubmit={handleSaveChanges}
        position="belowHeader"
        cardStyle={styles.formCardStyle}
        keyboardBehavior="handled"
      >
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
        />

        {/* Occupation Dropdown */}
        <Label
          text="Choose Your Occupation"
          size={14}
          color="#1A1A1A"
          weight="medium"
          style={styles.fieldLabel}
        />
        <Dropdown
          data={OCCUPATION_OPTIONS}
          value={formData.occupation}
          onSelect={(value) => handleFieldChange('occupation', value)}
          placeholder="Select occupation"
          style={styles.dropdownContainer}
        />

        {/* Interests Dropdown */}
        <Label
          text="Choose Your Interests"
          size={14}
          color="#1A1A1A"
          weight="medium"
          style={styles.fieldLabel}
        />
        <Dropdown
          data={INTERESTS_OPTIONS}
          value={formData.interests}
          onSelect={(value) => handleFieldChange('interests', value)}
          placeholder="Select interests"
          style={styles.dropdownContainer}
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
          text="How Do You Identify Yourself ?"
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
          text="Where Do You Live ?"
          size={14}
          color="#1A1A1A"
          weight="medium"
          style={styles.fieldLabel}
        />
        <View style={styles.locationRow}>
          <Dropdown
            data={COUNTRY_OPTIONS}
            value={formData.country}
            onSelect={(value) => handleFieldChange('country', value)}
            placeholder="Country"
            style={styles.halfDropdown}
          />
          <Dropdown
            data={getCityOptions()}
            value={formData.city}
            onSelect={(value) => handleFieldChange('city', value)}
            placeholder="City"
            style={styles.halfDropdown}
          />
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
  });

export default EditProfileFormScreen;

