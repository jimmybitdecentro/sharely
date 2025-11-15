import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Container from '../../components/layouts/Container/Container';
import Button from '../../components/base/Button/Button';
import InputField from '../../components/base/InputField/InputField';
import Label from '../../components/base/Label/Label';
import {useTheme} from '../../hooks/useTheme';
import {useLanguage} from '../../hooks/useLanguage';
import {AuthStackParamList} from '../../types/navigation';

type SignupScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Signup'>;

const SignupScreen: React.FC = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const {theme} = useTheme();
  const {t} = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    country: '',
    city: '',
  });
  const [loading, setLoading] = useState(false);
  const styles = createStyles(theme);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({...prev, [field]: value}));
  };

  const handleContinue = async () => {
    setLoading(true);
    // Implement signup logic
    setLoading(false);
  };

  return (
    <Container>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <Label
            text={t('letsGetToKnowYou')}
            variant="heading"
            style={styles.title}
            useTranslation={true}
          />
          <InputField
            label={t('fullName')}
            placeholder={t('fullName')}
            value={formData.fullName}
            onChangeText={(text) => handleInputChange('fullName', text)}
          />
          <InputField
            label={t('email')}
            placeholder={t('email')}
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <InputField
            label={t('phoneNumber')}
            placeholder={t('phoneNumber')}
            value={formData.phoneNumber}
            onChangeText={(text) => handleInputChange('phoneNumber', text)}
            keyboardType="phone-pad"
          />
          <InputField
            label={t('dateOfBirth')}
            placeholder={t('dateOfBirth')}
            value={formData.dateOfBirth}
            onChangeText={(text) => handleInputChange('dateOfBirth', text)}
          />
          <InputField
            label={t('gender')}
            placeholder={t('gender')}
            value={formData.gender}
            onChangeText={(text) => handleInputChange('gender', text)}
          />
          <InputField
            label={t('country')}
            placeholder={t('country')}
            value={formData.country}
            onChangeText={(text) => handleInputChange('country', text)}
          />
          <InputField
            label={t('city')}
            placeholder={t('city')}
            value={formData.city}
            onChangeText={(text) => handleInputChange('city', text)}
          />
          <Button
            title={t('continue')}
            onPress={handleContinue}
            variant="primary"
            loading={loading}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </Container>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: theme.spacing.lg,
    },
    content: {
      width: '100%',
    },
    title: {
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
    },
    button: {
      width: '100%',
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.xl,
    },
  });

export default SignupScreen;

