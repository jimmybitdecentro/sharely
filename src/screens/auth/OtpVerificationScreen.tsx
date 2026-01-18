import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import Container from '../../components/layouts/Container/Container';
import FormCard from '../../components/common/FormCard/FormCard';
import {useTheme} from '../../hooks/useTheme';
import {useAuth} from '../../hooks/useAuth';
import {AuthStackParamList} from '../../types/navigation';
import {Theme} from '../../types/theme';
import {s} from '../../theme/size';
import IVLogo from '../../components/base/ImageView/IVLogo';
import IVCircle from '../../components/base/ImageView/IVCircle';
import {images} from '../../theme/images';

type OtpScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'OtpVerification'
>;
type OtpScreenRouteProp = RouteProp<AuthStackParamList, 'OtpVerification'>;

const GRADIENT_COLORS = ['#2C73D2', '#1A88B3', '#23C28C'];
const OTP_LENGTH = 6; // Updated to 6 digits per API documentation

const OtpVerificationScreen: React.FC = () => {
  const navigation = useNavigation<OtpScreenNavigationProp>();
  const route = useRoute<OtpScreenRouteProp>();
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const {verifyOTP, sendOTP, isLoading: isAuthLoading} = useAuth();

  const {email, referral} = route.params;

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
    // Only allow numeric input
    if (value && !/^\d+$/.test(value)) {
      return;
    }

    if (value.length > 1) {
      // Handle paste
      const pastedOtp = value.slice(0, OTP_LENGTH).split('');
      const newOtp = [...otp];
      pastedOtp.forEach((digit, i) => {
        if (index + i < OTP_LENGTH) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);
      // Focus on next empty or last input
      const nextEmptyIndex = newOtp.findIndex((d) => !d);
      const focusIndex =
        nextEmptyIndex === -1 ? OTP_LENGTH - 1 : nextEmptyIndex;
      inputRefs.current[focusIndex]?.focus();
    } else {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError(null);

      if (value && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
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

    const result = await verifyOTP({
      email,
      otp: otpValue,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Invalid OTP. Please try again.');
    }
    // If successful, the auth state will update and navigation will happen automatically
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;

    setCanResend(false);
    setTimer(30);
    setOtp(Array(OTP_LENGTH).fill(''));
    setError(null);

    await sendOTP({email});
    inputRefs.current[0]?.focus();
  };

  // Gradient text for logo
  const GradientText = ({text, style}: {text: string; style?: any}) => (
    <MaskedView
      maskElement={<Text style={[styles.logoText, style]}>{text}</Text>}>
      <LinearGradient
        colors={GRADIENT_COLORS}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        <Text style={[styles.logoText, style, {opacity: 0}]}>{text}</Text>
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

  const isButtonLoading = isSubmitting || isAuthLoading;

  return (
    <Container style={styles.container}>
      {/* Header - same as Login screen */}
      <View style={styles.header}>
        <IVCircle
          size={40}
          src={images.back_white}
          onPress={() => navigation.goBack()}
        />
        <IVLogo />
      </View>
      {/* Center wrapper for FormCard */}
      <View style={styles.centerWrapper}>
        <FormCard
          title="Email Verification"
          subtitle={`Enter the 6-digit code we've sent to ${email}`}
          position="center"
          buttonText="VERIFY OTP"
          onSubmit={handleVerifyOtp}
          isSubmitting={isButtonLoading}
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
                      maxLength={index === 0 ? OTP_LENGTH : 1} // Allow paste on first input
                      selectTextOnFocus
                      editable={!isButtonLoading}
                    />
                  ))}
                </View>

                {/* Error message */}
                {error && <Text style={styles.errorText}>{error}</Text>}
              </View>
              <View style={styles.resendContainer}>
                <Text style={styles.resendText}>Didn't receive the code? </Text>
                {canResend ? (
                  <TouchableOpacity
                    onPress={handleResendOtp}
                    disabled={isButtonLoading}>
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
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(10),
      marginBottom: s(10),
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
      width: s(45),
      height: s(48),
      borderRadius: s(12),
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
      textAlign: 'center',
    },
    footerContainer: {
      marginTop: theme.spacing.lg,
    },
    resendContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
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
