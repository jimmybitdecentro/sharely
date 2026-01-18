import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ImageSourcePropType,
  ImageBackground,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../hooks/useTheme';
import Button from '../../components/base/Button/Button';
import Button2 from '../../components/base/Button/Button2';
import Container from '../../components/layouts/Container/Container';
import { images } from '../../theme/images';
import TextCustom from '../../components/base/Label/TextCustom';
import { s } from '../../theme/size';
import IVLogo from '../../components/base/ImageView/IVLogo';
import { storageService } from '../../services/storage/storageService';

type OnboardingScreenNavigationProp = StackNavigationProp<any, 'Onboarding'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingStep {
  title: string;
  description: string;
  illustrations: ImageSourcePropType | ImageSourcePropType[];
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: 'Share your links and earn money',
    description:
      'Share your links and earn money when someone clicks your shared link',
    illustrations: images.onboarding1,
  },
  {
    title: 'Earn money with every click',
    description: 'You earn real cash when someone clicks your shared link',
    illustrations: images.onboarding2,
  },
  {
    title: 'Withdraw your funds anytime',
    description:
      'Redeem your earnings instantly via UPI straight to your bank account',
    illustrations: [images.onboarding33, images.onboarding3],
  },
];

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [currentStep, setCurrentStep] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [isAnimating, setIsAnimating] = useState(false);

  const currentStepData = ONBOARDING_STEPS[currentStep];
  const illustrationArray = Array.isArray(currentStepData.illustrations)
    ? currentStepData.illustrations
    : [currentStepData.illustrations];
  const isMultipleImages = illustrationArray.length > 1;
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  useEffect(() => {
    // Animate slide in from right when step changes
    if (currentStep === 0) {
      // Initial load - no animation needed
      slideAnim.setValue(0);
      fadeAnim.setValue(1);
    } else {
      // Reset animation values for new step
      slideAnim.setValue(SCREEN_WIDTH);
      fadeAnim.setValue(0);

      // Animate slide in from right
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsAnimating(false);
      });
    }
  }, [currentStep]);

  const handleNext = async () => {
    if (isLastStep) {
      // Mark onboarding as seen and navigate to Login
      await storageService.setItem('@sharely:has_seen_onboarding', true);
      navigation.navigate('Login');
    } else {
      if (isAnimating) return; // Prevent multiple rapid clicks
      setIsAnimating(true);

      // Animate slide out to left, then change step
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -SCREEN_WIDTH,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentStep(currentStep + 1);
      });
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <Container>
      {/* Logo - consistent across all steps */}
      <IVLogo mt={Platform.OS === 'android' ? s(30) : s(0)} />

      {/* Image Container with Animation */}
      <View
        style={[
          {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <Animated.View
          style={[
            {
              flexDirection: 'row',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              transform: [{ translateX: slideAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          {isMultipleImages && (
            <Image
              source={illustrationArray[1]}
              style={[
                {
                  width: '30%',
                  maxWidth: 150,
                  resizeMode: 'contain',
                },
              ]}
            />
          )}
          <Image
            source={illustrationArray[0]}
            style={[
              {
                width: isMultipleImages ? '60%' : '70%',
                maxWidth: 300,
                maxHeight: '75%',
                resizeMode: 'contain',
              },
            ]}
          />
        </Animated.View>
      </View>

      {/* White Card Container */}
      <View style={styles.cardContainer}>
        <ImageBackground
          resizeMode="stretch"
          source={images.white_transparent_bg}
          style={{
            flex: 1,
            padding: theme.spacing.lg,
          }}
        >
          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Animated.View style={{ opacity: fadeAnim }}>
                <TextCustom
                  text={currentStepData.title}
                  fontFamily="bold"
                  size={32}
                  mb={theme.spacing.md}
                />
                <TextCustom
                  text={currentStepData.description}
                  fontFamily="regular"
                  size={16}
                  mb={theme.spacing.md}
                />
              </Animated.View>
            </View>
            <View>
              <Button
                title={isLastStep ? 'GET STARTED' : 'NEXT'}
                onPress={handleNext}
                style={{ marginBottom: theme.spacing.md }}
              />

              <Button2
                title="LOGIN"
                onPress={handleLogin}
                variant="secondary"
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    </Container>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#1a1a1a',
    },
    safeArea: {
      flex: 1,
    },
    cardContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '50%',
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
      paddingTop: theme.spacing.md,
    },
  });

export default OnboardingScreen;
