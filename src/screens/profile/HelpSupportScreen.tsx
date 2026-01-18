import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import Container from '../../components/layouts/Container/Container';
import {useTheme} from '../../hooks/useTheme';
import {ActionBar} from '../../components/common/Headers/ActionBar';
import {useNavigation} from '@react-navigation/native';
import Label from '../../components/base/Label/Label';
import WhiteCard from '../../components/common/WhiteCard';
import {s} from '../../theme/size';
import {Theme} from '../../types/theme';

const GRADIENT_COLORS = ['#2C73D2', '#1A88B3', '#23C28C'];

const HelpSupportScreen: React.FC = () => {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all fields',
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 1500));

    setIsSubmitting(false);
    Toast.show({
      type: 'success',
      text1: 'Submitted',
      text2: 'Your query has been submitted successfully',
    });
    navigation.goBack();
  };

  const isFormValid = formData.title.trim() && formData.description.trim();

  return (
    <Container style={styles.container}>
      <ActionBar
        title="Help & Support"
        onBackPress={() => navigation.goBack()}
      />

      <WhiteCard bottomBorderRadius={30}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            {/* Instruction Text */}
            <Label
              text="If you are experiencing any issues, please let us know. We will try to solve them as soon as possible."
              size={14}
              color="#666666"
              style={styles.instructionText}
            />

            {/* Title Input */}
            <View style={styles.fieldContainer}>
              <Label
                text="Title"
                size={14}
                weight="semiBold"
                color="#1A1A1A"
                style={styles.fieldLabel}
              />
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your title"
                  placeholderTextColor="#AAAAAA"
                  value={formData.title}
                  onChangeText={(text) => handleInputChange('title', text)}
                  editable={!isSubmitting}
                />
              </View>
            </View>

            {/* Description Input */}
            <View style={styles.fieldContainer}>
              <Label
                text="Explain The Problem"
                size={14}
                weight="semiBold"
                color="#1A1A1A"
                style={styles.fieldLabel}
              />
              <View style={[styles.inputContainer, styles.textAreaContainer]}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Type your query here"
                  placeholderTextColor="#AAAAAA"
                  value={formData.description}
                  onChangeText={(text) => handleInputChange('description', text)}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                  editable={!isSubmitting}
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              activeOpacity={0.8}
              disabled={!isFormValid || isSubmitting}
              style={styles.submitButtonContainer}>
              <LinearGradient
                colors={isFormValid ? GRADIENT_COLORS : ['#CCCCCC', '#AAAAAA']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.submitButton}>
                <Label
                  text={isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
                  size={16}
                  weight="bold"
                  color="#FFFFFF"
                />
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </WhiteCard>
    </Container>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: s(16),
      paddingTop: s(16),
      paddingBottom: 0,
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: s(30),
      flexGrow: 1,
    },
    instructionText: {
      marginBottom: s(28),
      lineHeight: s(22),
    },
    fieldContainer: {
      marginBottom: s(24),
    },
    fieldLabel: {
      marginBottom: s(10),
    },
    inputContainer: {
      backgroundColor: '#F5F5F5',
      borderRadius: s(12),
      paddingHorizontal: s(16),
    },
    input: {
      fontSize: s(14),
      fontFamily: theme.fonts.regular,
      color: '#1A1A1A',
      paddingVertical: s(16),
    },
    textAreaContainer: {
      minHeight: s(140),
    },
    textArea: {
      minHeight: s(120),
      textAlignVertical: 'top',
      paddingTop: s(16),
    },
    submitButtonContainer: {
      marginTop: 'auto',
      paddingTop: s(20),
    },
    submitButton: {
      alignItems: 'center',
      justifyContent: 'center',
      height: s(56),
      borderRadius: s(28),
    },
  });

export default HelpSupportScreen;
