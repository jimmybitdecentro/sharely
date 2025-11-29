import React, { ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ViewStyle,
  Platform,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { Theme } from '../../../types/theme';
import Button from '../../base/Button/Button';
import Label from '../../base/Label/Label';
import { s } from '../../../theme/size';

export type FormCardPosition = 'center' | 'belowHeader';

export interface FormCardRenderStyles {
  formGroup: ViewStyle;
  fieldLabel: TextStyle;
  input: ViewStyle;
  row: ViewStyle;
  halfWidth: ViewStyle;
}

export interface FormCardProps {
  title: string;
  subtitle?: string;
  position: FormCardPosition;
  buttonText: string;
  onSubmit: () => void;
  isSubmitting?: boolean;
  isButtonDisabled?: boolean;
  children?: ReactNode;
  renderContent?: (params: { styles: FormCardRenderStyles }) => ReactNode;
  style?: ViewStyle;
  cardStyle?: ViewStyle;
  buttonStyle?: ViewStyle;
  buttonTextStyle?: TextStyle;
  useTranslation?: boolean;
  headerComponent?: ReactNode;
  footerComponent?: ReactNode;
  showButton?: boolean;
  keyboardBehavior?: 'handled' | 'always' | 'never';
}

const FormCard: React.FC<FormCardProps> = ({
  title,
  subtitle,
  position,
  buttonText,
  onSubmit,
  isSubmitting = false,
  isButtonDisabled = false,
  children,
  renderContent,
  style,
  cardStyle,
  buttonStyle,
  buttonTextStyle,
  useTranslation = false,
  headerComponent,
  footerComponent,
  showButton = true,
  keyboardBehavior = 'handled',
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme, position);

  const renderStyles: FormCardRenderStyles = {
    formGroup: styles.formGroup,
    fieldLabel: styles.fieldLabel,
    input: styles.input,
    row: styles.row,
    halfWidth: styles.halfWidth,
  };

  return (
    <View style={[styles.wrapper, style]}>
      <View style={[styles.cardContainer, cardStyle]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={keyboardBehavior}
        >
          {headerComponent}

          <Label
            text={title}
            style={styles.title}
            useTranslation={useTranslation}
          />

          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

          {renderContent ? renderContent({ styles: renderStyles }) : children}

          {showButton && (
            <Button
              title={buttonText}
              onPress={onSubmit}
              variant="primary"
              loading={isSubmitting}
              disabled={isButtonDisabled}
              style={{ ...styles.button, ...buttonStyle }}
              textStyle={{ ...styles.buttonText, ...buttonTextStyle }}
            />
          )}

          {footerComponent}
        </ScrollView>
      </View>
    </View>
  );
};

const createStyles = (theme: Theme, position: FormCardPosition) =>
  StyleSheet.create({
    wrapper: {
      flex: position === 'belowHeader' ? 1 : undefined,
      justifyContent: position === 'center' ? 'center' : 'flex-start',
      alignItems: position === 'center' ? 'center' : 'stretch',
      width: '100%',
    },
    cardContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: s(30),
      paddingHorizontal: s(16),
      paddingTop: s(24),
      maxWidth: position === 'center' ? s(500) : undefined,
      width: position === 'center' ? '100%' : undefined,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: s(4) },
          shadowOpacity: 0.1,
          shadowRadius: s(12),
        },
        android: {
          elevation: 8,
        },
      }),
      ...(position === 'belowHeader' && { flex: 1 }),
    },
    scrollContent: {
      paddingBottom: s(24),
      flexGrow: 1,
    },
    title: {
      fontSize: s(28),
      fontFamily: theme.fonts.bold,
      color: theme.colors.text,
      marginBottom: s(4),
      textAlign: 'left',
      fontWeight: 'bold',
    },
    subtitle: {
      fontSize: s(16),
      fontFamily: theme.fonts.regular,
      color: theme.colors.textSecondary,
      marginBottom: s(20),
    },
    formGroup: {},
    fieldLabel: {
      fontSize: s(14),
      fontFamily: theme.fonts.regular,
      color: theme.colors.text,
      marginBottom: s(6),
    },
    input: {},
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    halfWidth: {
      width: '48%',
    },
    button: {
      marginTop: s(16),
    },
    buttonText: {
      fontSize: s(16),
      fontFamily: theme.fonts.bold,
      textTransform: 'uppercase',
    },
  });

export default FormCard;
