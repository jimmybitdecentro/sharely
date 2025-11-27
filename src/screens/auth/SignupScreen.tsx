import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Container from '../../components/layouts/Container/Container';
import FormCard from '../../components/common/FormCard/FormCard';
import InputField from '../../components/base/InputField/InputField';
import Dropdown from '../../components/base/Dropdown/Dropdown';
import RadioGroup from '../../components/base/RadioButton/RadioGroup';
import { useTheme } from '../../hooks/useTheme';
import { useSignupForm } from '../../hooks/useSignupForm';
import { AuthStackParamList } from '../../types/navigation';
import { SignupFormData } from '../../validations/signupSchema';
import { s } from '../../theme/size';
import { Theme } from '../../types/theme';

type SignupScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Signup'>;

const OCCUPATION_OPTIONS = [
  { label: 'Student', value: 'student' },
  { label: 'Professional', value: 'professional' },
  { label: 'Other', value: 'other' },
];

const INTERESTS_OPTIONS = [
  { label: 'Technology', value: 'tech' },
  { label: 'Art', value: 'art' },
  { label: 'Sports', value: 'sports' },
];

const AGE_OPTIONS = Array.from({ length: 100 }, (_, i) => ({
  label: `${i + 18}`,
  value: `${i + 18}`,
}));

const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

const COUNTRY_OPTIONS = [
  { label: 'USA', value: 'usa' },
  { label: 'India', value: 'india' },
];

const CITY_OPTIONS = [
  { label: 'New York', value: 'ny' },
  { label: 'Mumbai', value: 'mumbai' },
];

const SignupScreen: React.FC = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const {
    formData,
    isSubmitting,
    handleInputChange,
    handleBlur,
    handleSubmit,
    getFieldError,
  } = useSignupForm();

  const handleSignup = async (data: SignupFormData) => {
    console.log('Signup form submitted:', data);
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));
  };

  const onFormSubmit = () => {
    handleSubmit(handleSignup);
  };

  return (
    <Container style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backButtonIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sharely</Text>
      </View>

      <FormCard
        title="Account Details"
        subtitle="Let's get to know you! 👋"
        position="belowHeader"
        buttonText="GET STARTED"
        onSubmit={onFormSubmit}
        isSubmitting={isSubmitting}
        renderContent={({ styles: formStyles }) => (
          <>
            <View style={formStyles.formGroup}>
              <InputField
                placeholder="Type your Legal Name here..."
                value={formData.fullName}
                onChangeText={(text) => handleInputChange('fullName', text)}
                onBlur={() => handleBlur('fullName')}
                error={getFieldError('fullName')}
                style={formStyles.input}
                autoCapitalize="words"
                autoCorrect={false}
                label="What Should We Call You?"
              />
            </View>

            <View style={formStyles.formGroup}>
              <Dropdown
                label="Choose Your Occupation"
                placeholder="Select your Occupation..."
                data={OCCUPATION_OPTIONS}
                value={formData.occupation}
                onSelect={(value) => handleInputChange('occupation', value)}
                error={getFieldError('occupation')}
              />
            </View>

            <View style={formStyles.formGroup}>
              <Dropdown
                label="Choose Your Interests"
                placeholder="Select your Interest..."
                data={INTERESTS_OPTIONS}
                value={formData.interests}
                onSelect={(value) => handleInputChange('interests', value)}
                error={getFieldError('interests')}
              />
            </View>

            <View style={formStyles.formGroup}>
              <Dropdown
                label="Tell Us Your Age"  
                placeholder="Select your Age..."
                data={AGE_OPTIONS}
                value={formData.age}
                onSelect={(value) => handleInputChange('age', value)}
                error={getFieldError('age')}
              />
            </View>

            <View style={formStyles.formGroup}>
              <RadioGroup
                label="How Do You Identify Yourself ?"
                options={GENDER_OPTIONS}
                value={formData.gender}
                onChange={(value) => handleInputChange('gender', value)}
                error={getFieldError('gender')}
              />
            </View>

            <View style={formStyles.formGroup}>
              <Text style={formStyles.fieldLabel}>Where Do You Live ?</Text>
              <View style={formStyles.row}>
                <Dropdown
                  placeholder="Country"
                  data={COUNTRY_OPTIONS}
                  value={formData.country}
                  onSelect={(value) => handleInputChange('country', value)}
                  style={formStyles.halfWidth}
                  error={getFieldError('country')}
                />
                <Dropdown
                  placeholder="City"
                  data={CITY_OPTIONS}
                  value={formData.city}
                  onSelect={(value) => handleInputChange('city', value)}
                  style={formStyles.halfWidth}
                  error={getFieldError('city')}
                />
              </View>
            </View>
          </>
        )}
      />
    </Container>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      padding: s(19),
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: s(24),
      paddingBottom: s(16),
    },
    backButton: {
      padding: s(10),
      backgroundColor: '#FFFFFF',
      marginRight: s(12),
      justifyContent: 'center',
      borderRadius: s(20),
    },
    backButtonIcon: {
      fontSize: s(20),
      fontFamily: theme.fonts.bold,
      color: '#000000',
    },
    headerTitle: {
      fontSize: s(24),
      fontFamily: theme.fonts.bold,
      color: theme.colors.primary,
    },
  });

export default SignupScreen;
