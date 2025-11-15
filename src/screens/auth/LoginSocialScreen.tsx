import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Container from '../../components/layouts/Container/Container';
import Button from '../../components/base/Button/Button';
import InputField from '../../components/base/InputField/InputField';
import Label from '../../components/base/Label/Label';
import {useTheme} from '../../hooks/useTheme';
import {useLanguage} from '../../hooks/useLanguage';
import {AuthStackParamList} from '../../types/navigation';

type LoginSocialScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'LoginSocial'
>;

const LoginSocialScreen: React.FC = () => {
  const navigation = useNavigation<LoginSocialScreenNavigationProp>();
  const {theme} = useTheme();
  const {t} = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const styles = createStyles(theme);

  const handleLogin = async () => {
    setLoading(true);
    // Implement login logic
    setLoading(false);
  };

  const handleSocialLogin = (provider: string) => {
    // Implement social login
    console.log(`Login with ${provider}`);
  };

  return (
    <Container>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <Label
            text="Sharely"
            variant="heading"
            style={styles.logo}
            useTranslation={false}
          />
          <Label
            text={t('welcome')}
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
          <InputField
            label={t('password')}
            placeholder={t('password')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>{t('forgotPassword')}</Text>
          </TouchableOpacity>
          <Button
            title={t('login')}
            onPress={handleLogin}
            variant="primary"
            loading={loading}
            style={styles.button}
          />
          <Text style={styles.orText}>{t('orContinueWith')}</Text>
          <Button
            title={t('continueWithGoogle')}
            onPress={() => handleSocialLogin('google')}
            variant="secondary"
            style={styles.socialButton}
          />
          <Button
            title={t('continueWithApple')}
            onPress={() => handleSocialLogin('apple')}
            variant="secondary"
            style={styles.socialButton}
          />
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>{t('dontHaveAccount')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupLink}> {t('signup')}</Text>
            </TouchableOpacity>
          </View>
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
    logo: {
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
      fontSize: 32,
      fontWeight: '700',
    },
    title: {
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginBottom: theme.spacing.lg,
    },
    forgotPasswordText: {
      color: theme.colors.primary,
      fontSize: theme.typography.body.fontSize,
    },
    button: {
      width: '100%',
      marginBottom: theme.spacing.md,
    },
    orText: {
      textAlign: 'center',
      color: theme.colors.textSecondary,
      marginVertical: theme.spacing.md,
    },
    socialButton: {
      width: '100%',
      marginBottom: theme.spacing.sm,
    },
    signupContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: theme.spacing.md,
    },
    signupText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.body.fontSize,
    },
    signupLink: {
      color: theme.colors.primary,
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
    },
  });

export default LoginSocialScreen;

