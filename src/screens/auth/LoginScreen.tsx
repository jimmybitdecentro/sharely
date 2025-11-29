import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import Container from '../../components/layouts/Container/Container';
import FormCard from '../../components/common/FormCard/FormCard';
import InputField from '../../components/base/InputField/InputField';
import { useTheme } from '../../hooks/useTheme';
import { useLoginForm } from '../../hooks/useLoginForm';
import { AuthStackParamList } from '../../types/navigation';
import { LoginFormData } from '../../validations/loginSchema';
import { Theme } from '../../types/theme';
import { s } from '../../theme/size';
import IVLogo from '../../components/base/ImageView/IVLogo';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const GRADIENT_COLORS = ['#2C73D2', '#1A88B3', '#23C28C'];

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const {
    formData,
    isSubmitting,
    handleInputChange,
    handleBlur,
    handleSubmit,
    getFieldError,
  } = useLoginForm();

  // Handles OTP request after validation - navigates to OTP screen
  const handleSendOtp = async (data: LoginFormData) => {
    console.log('Send OTP for:', data.email);
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));
    
    // TODO: Call your send OTP API here
    // await apiService.sendOtp(data.email);
    
    // Navigate to OTP verification screen
    navigation.navigate('OtpVerification', { 
      email: data.email, 
      referral: data.referral || undefined 
    });
  };

  const onFormSubmit = () => {
    handleSubmit(handleSendOtp);
  };

  // Gradient text component for "Sharely" logo
  const GradientText = ({ text, style }: { text: string; style?: any }) => (
    <MaskedView maskElement={<Text style={[styles.logoText, style]}>{text}</Text>}>
      <LinearGradient
        colors={GRADIENT_COLORS}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
        <Text style={[styles.logoText, style, { opacity: 0 }]}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );

  // Terms and signup footer component
  const TermsFooter = () => (
    <View style={styles.footerContainer}>
      <View style={styles.termsContainer}>
        <Text style={styles.termsText}>By Continuing, You Agree To Our</Text>
        <TouchableOpacity onPress={() => console.log('Terms pressed')}>
          <Text style={styles.termsLink}>Terms & Conditions</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signupLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Label with optional tag
  const FieldLabel = ({ label, optional }: { label: string; optional?: boolean }) => (
    <View style={styles.labelContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {optional && <Text style={styles.optionalTag}>(Optional)</Text>}
    </View>
  );

  return (
    <Container style={styles.container}>
      <IVLogo /> 
      <View style={styles.centerWrapper}>
        <FormCard
          title="Welcome Back!"
          subtitle="Sign in to start earning money"
          position="center"
          buttonText="SEND OTP"
          onSubmit={onFormSubmit}
          isSubmitting={isSubmitting}
          footerComponent={<TermsFooter />}
          renderContent={() => (
            <>
              {/* Email Field */}
              <View style={styles.fieldGroup}>
                <FieldLabel label="Email" />
                <InputField
                  placeholder="Enter your Email"
                  value={formData.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                  onBlur={() => handleBlur('email')}
                  error={getFieldError('email')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Referral Field */}
              <View style={styles.fieldGroup}>
                <FieldLabel label="Referral" optional />
                <InputField
                  placeholder="Enter Referral"
                  value={formData.referral}
                  onChangeText={(text) => handleInputChange('referral', text)}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </>
          )}
        />
      </View>
    </Container>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      padding: s(19),
    },
    header: {
      paddingTop: theme.spacing.xl,
      paddingBottom: theme.spacing.lg,
    },
    centerWrapper: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoText: {
      fontSize: s(28),
      fontFamily: theme.fonts.bold,
      fontWeight: 'bold',
    },
    fieldGroup: {
      marginBottom: theme.spacing.sm,
    },
    labelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    fieldLabel: {
      fontSize: s(14),
      fontFamily: theme.fonts.regular,
      color: theme.colors.text,
    },
    optionalTag: {
      fontSize: s(14),
      fontFamily: theme.fonts.regular,
      color: '#23C28C',
      marginLeft: theme.spacing.xs,
    },
    footerContainer: {
      marginTop: theme.spacing.lg,
    },
    termsContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    termsText: {
      fontSize: s(13),
      fontFamily: theme.fonts.regular,
      color: theme.colors.textSecondary,
    },
    termsLink: {
      fontSize: s(13),
      fontFamily: theme.fonts.medium,
      color: '#1A88B3',
      marginTop: theme.spacing.xs,
    },
    signupContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    signupText: {
      fontSize: s(14),
      fontFamily: theme.fonts.regular,
      color: theme.colors.textSecondary,
    },
    signupLink: {
      fontSize: s(14),
      fontFamily: theme.fonts.semiBold,
      color: '#23C28C',
    },
  });

export default LoginScreen;
