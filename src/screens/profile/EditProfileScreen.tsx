import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import Container from '../../components/layouts/Container/Container';
import Button from '../../components/base/Button/Button';
import InputField from '../../components/base/InputField/InputField';
import Label from '../../components/base/Label/Label';
import {useTheme} from '../../hooks/useTheme';
import {useLanguage} from '../../hooks/useLanguage';
import {RootState} from '../../store';

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const {t} = useLanguage();
  const user = useSelector((state: RootState) => state.auth.user);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || '',
    country: user?.country || '',
    city: user?.city || '',
  });
  const [loading, setLoading] = useState(false);
  const styles = createStyles(theme);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({...prev, [field]: value}));
  };

  const handleSave = async () => {
    setLoading(true);
    // Implement save logic
    setLoading(false);
  };

  return (
    <Container>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Label
            text={t('myProfile')}
            variant="heading"
            style={styles.title}
            useTranslation={true}
          />
        </View>
        <View style={styles.content}>
          <View style={styles.avatarContainer}>
            <Image
              source={{uri: user?.profilePicture || 'https://via.placeholder.com/80'}}
              style={styles.avatar}
            />
            <Label text={user?.name || 'User'} variant="subtitle" useTranslation={false} />
          </View>
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
            title={t('saveChanges')}
            onPress={handleSave}
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
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
    backIcon: {
      fontSize: 24,
      color: theme.colors.text,
      marginRight: theme.spacing.md,
    },
    title: {
      flex: 1,
    },
    content: {
      padding: theme.spacing.md,
    },
    avatarContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.surface,
      marginBottom: theme.spacing.md,
    },
    button: {
      width: '100%',
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
  });

export default EditProfileScreen;

