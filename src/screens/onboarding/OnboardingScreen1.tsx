import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import GradientText from '../../components/base/GradientText/GradientText';
import { useTheme } from '../../hooks/useTheme';
import Button from '../../components/base/Button/Button';
import Container from '../../components/layouts/Container/Container';
import { images } from '../../theme/images';
import OnboardingLayout from '../../components/layouts/Onboarding/OnboardingLayout';

type OnboardingScreen1NavigationProp = StackNavigationProp<any, 'Onboarding1'>;

const OnboardingScreen1: React.FC = () => {
  const navigation = useNavigation<OnboardingScreen1NavigationProp>();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleNext = () => {
    navigation.navigate('Onboarding2');
  };

  const handleLogin = () => {
    // Navigate to Auth stack - adjust based on your navigation structure
    // @ts-ignore - navigating to root Auth stack
    navigation.getParent()?.navigate('Auth', { screen: 'Login' });
  };

  return (
    <OnboardingLayout
    illustrations={images.onboarding1}
    title="Share your links and earn money"
    description="Share your links and earn money when someone clicks your shared link"
    primaryButtonTitle="GET STARTED"
    primaryButtonOnPress={handleNext}
    secondaryButtonOnPress={handleLogin}
  />
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#1a1a1a', // Dark background
    },
    safeArea: {
      flex: 1,
    },
    titleContainer: {
      paddingTop: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.sm,
    },
    appTitle: {
      fontSize: 32,
      fontWeight: 'bold',
      fontFamily: theme.typography.h1.fontFamily || 'System',
    },
    illustrationContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingTop: theme.spacing.xl,
      paddingBottom: 200, // Space for the card to overlap
    },
    illustration: {
      width: '80%',
      height: '100%',
      maxWidth: 300,
      maxHeight: 400,
    },
    cardContainer: {
      backgroundColor: 'blue',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
      paddingTop: theme.spacing.md,
    },
    card: {
      borderRadius: 10,
      padding: theme.spacing.xl,
      shadowColor: '#000',

      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    cardTitle: {
      fontSize: theme.typography.h2.fontSize,
      fontWeight: 'bold',
      color: '#000000',
      marginBottom: theme.spacing.md,
      textAlign: 'left',
    },
    cardDescription: {
      fontSize: theme.typography.body.fontSize,
      color: '#000000',
      lineHeight: theme.typography.body.fontSize * 1.5,
      marginBottom: theme.spacing.xl,
      textAlign: 'left',
    },
    nextButton: {
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
      marginBottom: theme.spacing.md,
    },
    gradientButton: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 48,
    },
    nextButtonText: {
      color: '#FFFFFF',
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
      letterSpacing: 1,
    },
    loginButton: {
      backgroundColor: '#000000',
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 48,
      borderWidth: 1,
      borderColor: '#FFFFFF',
    },
    loginButtonText: {
      color: '#FFFFFF',
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
      letterSpacing: 1,
    },
  });

export default OnboardingScreen1;

