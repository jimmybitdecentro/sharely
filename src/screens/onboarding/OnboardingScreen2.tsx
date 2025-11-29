import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import OnboardingLayout from '../../components/layouts/Onboarding/OnboardingLayout';
import { images } from '../../theme/images';

type OnboardingScreen2NavigationProp = StackNavigationProp<any, 'Onboarding2'>;

const OnboardingScreen2: React.FC = () => {
  const navigation = useNavigation<OnboardingScreen2NavigationProp>();

  const handleNext = () => {
    navigation.navigate('Onboarding3');
    // navigation.goBack();
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <OnboardingLayout
      illustrations={images.onboarding2}
      title="Earn money with every click"
      description="You earn real cash when someone clicks your shared link"
      primaryButtonTitle="NEXT"
      primaryButtonOnPress={handleNext}
      secondaryButtonOnPress={handleLogin}
    />
  );
};

export default OnboardingScreen2;

