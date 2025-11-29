import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import Container from '../../components/layouts/Container/Container';
import FormCard from '../../components/common/FormCard/FormCard';
import { useTheme } from '../../hooks/useTheme';
import { AuthStackParamList } from '../../types/navigation';
import { setCredentials } from '../../store/slices/authSlice';
import { storageService } from '../../services/storage/storageService';
import { Theme } from '../../types/theme';
import { s } from '../../theme/size';
import IVLogo from '../../components/base/ImageView/IVLogo';

type OtpScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'OtpVerification'>;
type OtpScreenRouteProp = RouteProp<AuthStackParamList, 'OtpVerification'>;

const GRADIENT_COLORS = ['#2C73D2', '#1A88B3', '#23C28C'];
const OTP_LENGTH = 4;

const OtpVerificationScreen: React.FC = () => {
  const navigation = useNavigation<OtpScreenNavigationProp>();
  const route = useRoute<OtpScreenRouteProp>();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const { email } = route.params;

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // Handle OTP input change
  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(null);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');

    if (otpValue.length !== OTP_LENGTH) {
      setError('Please enter complete OTP');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      console.log('Verifying OTP:', otpValue, 'for email:', email);
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));

      await storageService.setItem('@sharely:has_seen_onboarding', true);
      dispatch(setCredentials({
        token: 'dummy-token',
        user: { id: '1', name: 'Guest', email }
      }));
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;

    setCanResend(false);
    setTimer(30);
    setOtp(Array(OTP_LENGTH).fill(''));
    setError(null);
    console.log('Resending OTP to:', email);
  };

  // Gradient text for logo
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

  // Footer component - matching Login screen style
  const OtpFooter = () => (
    <View style={styles.footerContainer}>
      <View style={styles.backToLoginContainer}>
        <Text style={styles.backToLoginText}>Wrong email? </Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backToLoginLink}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );



  return (
    <Container style={styles.container}>
      {/* Header - same as Login screen */}
     <IVLogo/>

      {/* Center wrapper for FormCard */}
      <View style={styles.centerWrapper}>
        <FormCard
          title="Email Verification"
          subtitle={`Enter the code we’ve sent to your email ${email}`}
          position="center"
          buttonText="VERIFY OTP"
          onSubmit={handleVerifyOtp}
          isSubmitting={isSubmitting}
          footerComponent={<OtpFooter />}
          renderContent={() => (
            <>
              <View style={styles.fieldGroup}>
                {/* OTP Input Boxes */}
                <View style={styles.otpInputContainer}>
                  {otp.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => (inputRefs.current[index] = ref)}
                      style={[
                        styles.otpInput,
                        digit && styles.otpInputFilled,
                        error && styles.otpInputError,
                      ]}
                      value={digit}
                      onChangeText={(value) => handleOtpChange(value, index)}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      keyboardType="number-pad"
                      maxLength={1}
                      selectTextOnFocus
                    />
                  ))}

                </View>

                {/* Error message */}
                {error && <Text style={styles.errorText}>{error}</Text>}
              </View>
              <View style={styles.resendContainer}>
                <Text style={styles.resendText}>Didn't receive the code? </Text>
                {canResend ? (
                  <TouchableOpacity onPress={handleResendOtp}>
                    <Text style={styles.resendLink}>Resend OTP</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.timerText}>{timer}s</Text>
                )}
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
    otpInputContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    otpInput: {
      width: s(65),
      height: s(48),
      borderRadius: s(30),
      backgroundColor: theme.colors.inputBg,
      borderWidth: s(1),
      borderColor: theme.colors.border,
      textAlign: 'center',
      fontSize: s(20),
      fontFamily: theme.fonts.semiBold,
      color: theme.colors.text,
    },
    otpInputFilled: {
      borderColor: '#23C28C',
    },
    otpInputError: {
      borderColor: theme.colors.error,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: s(12),
      fontFamily: theme.fonts.regular,
      marginTop: s(8),
    },
    footerContainer: {
      marginTop: theme.spacing.lg,
    },
    resendContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      // marginBottom: theme.spacing.md,
      marginTop: theme.spacing.md,
    },
    resendText: {
      fontSize: s(13),
      fontFamily: theme.fonts.regular,
      color: theme.colors.textSecondary,
    },
    resendLink: {
      fontSize: s(13),
      fontFamily: theme.fonts.medium,
      color: '#1A88B3',
    },
    timerText: {
      fontSize: s(13),
      fontFamily: theme.fonts.semiBold,
      color: '#1A88B3',
    },
    backToLoginContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    backToLoginText: {
      fontSize: s(14),
      fontFamily: theme.fonts.regular,
      color: theme.colors.textSecondary,
    },
    backToLoginLink: {
      fontSize: s(14),
      fontFamily: theme.fonts.semiBold,
      color: '#23C28C',
    },
  });

export default OtpVerificationScreen;
