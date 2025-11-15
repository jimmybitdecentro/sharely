import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Container from '../../components/layouts/Container/Container';
import Button from '../../components/base/Button/Button';
import Label from '../../components/base/Label/Label';
import {useTheme} from '../../hooks/useTheme';
import {useLanguage} from '../../hooks/useLanguage';

type OnboardingScreen1NavigationProp = StackNavigationProp<any, 'Onboarding1'>;

const OnboardingScreen1: React.FC = () => {
  const navigation = useNavigation<OnboardingScreen1NavigationProp>();
  const {theme} = useTheme();
  const {t} = useLanguage();
  const styles = createStyles(theme);

  const handleGetStarted = () => {
    navigation.navigate('Onboarding2');
  };

  return (
    <Container>
      <View style={styles.container}>
        <View style={styles.illustrationContainer}>
          {/* Placeholder for illustration */}
          <View style={styles.illustration} />
        </View>
        <View style={styles.contentContainer}>
          <Label
            text={t('shareCampaignLinks')}
            variant="heading"
            style={styles.title}
            useTranslation={true}
          />
          <Text style={styles.description}>
            {t('shareCampaignLinksDesc')}
          </Text>
          <Button
            title={t('getStarted')}
            onPress={handleGetStarted}
            variant="primary"
            style={styles.button}
          />
        </View>
      </View>
    </Container>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
    },
    illustrationContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    illustration: {
      width: 200,
      height: 200,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
    },
    contentContainer: {
      flex: 0.5,
      width: '100%',
      alignItems: 'center',
    },
    title: {
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    description: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
      paddingHorizontal: theme.spacing.md,
    },
    button: {
      width: '100%',
      marginTop: theme.spacing.lg,
    },
  });

export default OnboardingScreen1;

