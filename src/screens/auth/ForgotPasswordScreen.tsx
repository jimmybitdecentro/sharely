import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Container from '../../components/layouts/Container/Container';
import Button from '../../components/base/Button/Button';
import InputField from '../../components/base/InputField/InputField';
import Label from '../../components/base/Label/Label';
import {useTheme} from '../../hooks/useTheme';
import {useLanguage} from '../../hooks/useLanguage';

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const {t} = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const styles = createStyles(theme);

  const handleSubmit = async () => {
    setLoading(true);
    // Implement forgot password logic
    setLoading(false);
  };

  return (
    <Container>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <Label
            text={t('forgotPassword')}
            variant="heading"
            style={styles.title}
            useTranslation={true}
          />
          <InputField
            label={t('email')}
            placeholder={t('email')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Button
            title={t('continue')}
            onPress={handleSubmit}
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
      justifyContent: 'center',
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
    },
  });

export default ForgotPasswordScreen;

