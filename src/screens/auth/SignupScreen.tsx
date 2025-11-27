import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Container from '../../components/layouts/Container/Container';
import Button from '../../components/base/Button/Button';
import InputField from '../../components/base/InputField/InputField';
import Label from '../../components/base/Label/Label';
import Dropdown from '../../components/base/Dropdown/Dropdown';
import RadioGroup from '../../components/base/RadioButton/RadioGroup';
import { useTheme } from '../../hooks/useTheme';
import { useLanguage } from '../../hooks/useLanguage';
import { AuthStackParamList } from '../../types/navigation';
import { s } from '../../theme/size';

type SignupScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Signup'>;

const SignupScreen: React.FC = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    occupation: '',
    interests: '',
    age: '',
    gender: '',
    country: '',
    city: '',
  });
  const [loading, setLoading] = useState(false);
  const styles = createStyles(theme);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContinue = async () => {
    setLoading(true);
    // Implement signup logic
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <Container style={{ padding: 19 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sharely</Text>
      </View>
      <View style={styles.cardContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Label
            text="Account Details"
            variant="heading"
            style={styles.title}
            useTranslation={false}
          />
          <Text style={styles.subtitle}>Let's get to know you! 👋</Text>

          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>What Should We Call You?</Text>
            <InputField
              placeholder="Type your Legal Name here..."
              value={formData.fullName}
              onChangeText={(text) => handleInputChange('fullName', text)}
              style={styles.input}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>Choose Your Occupation</Text>
            <Dropdown
              placeholder="Select your Occupation..."
              data={[
                { label: 'Student', value: 'student' },
                { label: 'Professional', value: 'professional' },
                { label: 'Other', value: 'other' },
              ]}
              value={formData.occupation}
              onSelect={(value) => handleInputChange('occupation', value)}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>Choose Your Interests</Text>
            <Dropdown
              placeholder="Select your Interest..."
              data={[
                { label: 'Technology', value: 'tech' },
                { label: 'Art', value: 'art' },
                { label: 'Sports', value: 'sports' },
              ]}
              value={formData.interests}
              onSelect={(value) => handleInputChange('interests', value)}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>Tell Us Your Age</Text>
            <Dropdown
              placeholder="Select your Age..."
              data={Array.from({ length: 100 }, (_, i) => ({
                label: `${i + 18}`,
                value: `${i + 18}`,
              }))}
              value={formData.age}
              onSelect={(value) => handleInputChange('age', value)}
            />
          </View>

          <View style={styles.formGroup}>
            <RadioGroup
              label="How Do You Identify Yourself ?"
              options={[
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' },
              ]}
              value={formData.gender}
              onChange={(value) => handleInputChange('gender', value)}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>Where Do You Live ?</Text>
            <View style={styles.row}>
              <Dropdown
                placeholder="Country"
                data={[{ label: 'USA', value: 'usa' }, { label: 'India', value: 'india' }]}
                value={formData.country}
                onSelect={(value) => handleInputChange('country', value)}
                style={styles.halfWidth}
              />
              <Dropdown
                placeholder="City"
                data={[{ label: 'New York', value: 'ny' }, { label: 'Mumbai', value: 'mumbai' }]}
                value={formData.city}
                onSelect={(value) => handleInputChange('city', value)}
                style={styles.halfWidth}
              />
            </View>
          </View>

          <Button
            title="GET STARTED"
            onPress={handleContinue}
            variant="primary"
            loading={loading}
            style={styles.button}
            textStyle={styles.buttonText}
          />
        </ScrollView>
      </View>
    </Container >
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: theme.spacing.xl,
      paddingBottom: theme.spacing.lg,
    },
    backButton: {
      padding: theme.spacing.sm,
      backgroundColor: '#fff',
      marginRight: theme.spacing.md,
      justifyContent: 'center',
      borderRadius: s(20),
    },
    backButtonIcon: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#000',
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.primary, // Assuming 'Sharely' is primary color
    },
    cardContainer: {
      flex: 1,
      backgroundColor: "#ffff",
      borderRadius: 30,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.xl,
      marginTop: theme.spacing.sm,
    },
    scrollContent: {
      paddingBottom: theme.spacing.xl,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#000',
      marginBottom: theme.spacing.xs,
      textAlign: 'left',
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xl,
    },
    formGroup: {
      marginBottom: theme.spacing.md,
    },
    fieldLabel: {
      fontSize: 14,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    input: {
      backgroundColor: '#F0F0F0',
      borderRadius: theme.borderRadius.md,
      borderWidth: 0,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    halfWidth: {
      width: '48%',
    },
    button: {
      marginTop: theme.spacing.lg,
      borderRadius: 25,
      height: 50,
      backgroundColor: '#20B2AA', // Example green/teal color from design
    },
    buttonText: {
      fontSize: 16,
      fontWeight: 'bold',
      textTransform: 'uppercase',
    },
  });

export default SignupScreen;

