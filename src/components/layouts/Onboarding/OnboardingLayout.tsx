import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  ImageSourcePropType,
  ImageBackground,
  Text,
  Platform,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import Button from '../../base/Button/Button';
import Label from '../../base/Label/Label';
import Container from '../Container/Container';
import { images } from '../../../theme/images';
import TextCustom from '../../base/Label/TextCustom';
import Button2 from '../../base/Button/Button2';
import { s } from '../../../theme/size';
import IVLogo from '../../base/ImageView/IVLogo';

interface OnboardingLayoutProps {
  illustrations: ImageSourcePropType | ImageSourcePropType[];
  title: string;
  description: string;
  primaryButtonTitle: string;
  primaryButtonOnPress: () => void;
  secondaryButtonTitle?: string;
  secondaryButtonOnPress?: () => void;
  showSecondaryButton?: boolean;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  illustrations,
  title,
  description,
  primaryButtonTitle,
  primaryButtonOnPress,
  secondaryButtonTitle = 'LOGIN',
  secondaryButtonOnPress,
  showSecondaryButton = true,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  // Normalize illustrations to array
  const illustrationArray = Array.isArray(illustrations)
    ? illustrations
    : [illustrations];
  const isMultipleImages = illustrationArray.length > 1;

  return (
    <Container >
      {/* App Title with Gradient */}
     <IVLogo  mt={s(40)}/>
      <View style={[{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
      }]}>

        <View style={{flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      
        {isMultipleImages && <Image
          source={illustrationArray[1]}
          style={[
            {
              width: '30%',
                maxWidth: 150,
              resizeMode: 'contain'
            },
          ]}
        />
        } 
         <Image
          source={illustrationArray[0]}
          style={[
            {
              width:isMultipleImages ? '60%' : '70%',
              maxWidth: 300,
              maxHeight: '75%',
              resizeMode: 'contain'
            },
          ]}
        />
     
        </View>
      </View>

      {/* White Card Container */}
      <View style={styles.cardContainer}>
        <ImageBackground
          resizeMode='stretch'
          source={images.white_transparent_bg}
          style={{
            flex: 1,
            padding: theme.spacing.lg,
          }}
        >
          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'column', justifyContent: 'space-between',
             }}>
              <TextCustom text={title} 
              fontFamily="bold"
              size={32}
              mb={theme.spacing.md}
              />
              <TextCustom text={description} fontFamily="regular"
                size={16}
                mb={theme.spacing.md}
              />
            </View>
            <View  >
              <Button title={primaryButtonTitle} onPress={primaryButtonOnPress} 
                style={{ marginBottom: theme.spacing.md }}
              />

              <Button2
                title={secondaryButtonTitle} onPress={secondaryButtonOnPress || (() => { }) as () => void} variant="secondary" />
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

export default OnboardingLayout;

