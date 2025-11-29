import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import OnboardingLayout from '../../components/layouts/Onboarding/OnboardingLayout';
import { images } from '../../theme/images';
import { storageService } from '../../services/storage/storageService';

type OnboardingScreen3NavigationProp = StackNavigationProp<any, 'Onboarding3'>;

const OnboardingScreen3: React.FC = () => {
  const navigation = useNavigation<OnboardingScreen3NavigationProp>();

  const handleGetStarted = async () => {
    // Mark onboarding as seen
    await storageService.setItem('@sharely:has_seen_onboarding', true);
    // Navigate to auth/login
    navigation.navigate('Auth', { screen: 'Login' });
  };

  const handleLogin = () => {
    // Navigate to Auth stack - adjust based on your navigation structure
    // @ts-ignore - navigating to root Auth stack
    navigation.getParent()?.navigate('Auth', { screen: 'Login' });
  };

  return (
    <OnboardingLayout
      illustrations={[ images.onboarding33, images.onboarding3]}
      title="Withdraw your funds anytime"
      description="Redeem your earnings instantly via UPI straight to your bank account"
      primaryButtonTitle="GET STARTED"
      primaryButtonOnPress={handleGetStarted}
      secondaryButtonOnPress={handleLogin}
    />
  );
};

export default OnboardingScreen3;

