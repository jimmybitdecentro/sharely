import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useDispatch} from 'react-redux';
import Container from '../../components/layouts/Container/Container';
import Button from '../../components/base/Button/Button';
import InputField from '../../components/base/InputField/InputField';
import Label from '../../components/base/Label/Label';
import {useTheme} from '../../hooks/useTheme';
import {useLanguage} from '../../hooks/useLanguage';
import {AuthStackParamList} from '../../types/navigation';
import {apiService} from '../../services/api/apiService';
import {setCredentials} from '../../store/slices/authSlice';
import {storageService} from '../../services/storage/storageService';
import {validateEmail, validatePassword} from '../../utils/validators';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const dispatch = useDispatch();
  const {theme} = useTheme();
  const {t} = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const styles = createStyles(theme);

  const handleLogin = async () => {
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    setEmailError(emailErr);
    setPasswordError(passwordErr);

    if (emailErr || passwordErr) {
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.login(email, password);
      if (response.success && response.data) {
        const {token, user} = response.data;
        await storageService.setAuthToken(token);
        await storageService.setUserData(user);
        dispatch(setCredentials({token, user}));
        // Navigation will be handled by AppNavigator based on auth state
      }
    } catch (error: any) {
      // Handle error
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
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
            onChangeText={(text) => {
              setEmail(text);
              setEmailError(null);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError || undefined}
          />
          <InputField
            label={t('password')}
            placeholder={t('password')}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError(null);
            }}
            secureTextEntry
            error={passwordError || undefined}
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

export default LoginScreen;

