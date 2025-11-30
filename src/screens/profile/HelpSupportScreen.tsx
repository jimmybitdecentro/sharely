import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Container from '../../components/layouts/Container/Container';
import { useTheme } from '../../hooks/useTheme';
import { ActionBar } from '../../components/common/Headers/ActionBar';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import TextCustom from '../../components/base/Label/TextCustom';
import InputField from '../../components/base/InputField/InputField';
import Button from '../../components/base/Button/Button';
import WhiteCard from '../../components/common/WhiteCard';
import { s } from '../../theme/size';

const HelpSupportScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NavigationProp<any>>();

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
      // Handle validation error
      return;
    }

    setIsSubmitting(true);
    console.log('Submitting help request:', formData);

    // Simulate API call
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));

    setIsSubmitting(false);
    // Navigate back or show success message
    navigation.goBack();
  };

  return (
    <Container>
      <ActionBar
        title="Help & Support"
        onBackPress={() => {
          navigation.goBack();
        }}
      />

<WhiteCard>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TextCustom
            text="If you are experiencing any issues, please let us know. We will try to solve them as soon as possible."
            size={14}
            color="textSecondary"
            useTranslation={false}
            style={styles.instructionText}
          />

          <InputField
            label="Title"
            placeholder="Enter your title"
            value={formData.title}
            onChangeText={(text) => handleInputChange('title', text)}
            containerStyle={styles.inputContainer}
          />

          <InputField
            label="Explain The Problem"
            placeholder="Type your query here"
            value={formData.description}
            onChangeText={(text) => handleInputChange('description', text)}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            style={styles.textAreaInput}
            containerStyle={styles.inputContainer}
          />

          <Button
            title="SUBMIT"
            onPress={handleSubmit}
            variant="primary"
            loading={isSubmitting}
            disabled={!formData.title.trim() || !formData.description.trim()}
            style={styles.submitButton}
          />
        </ScrollView>
      </WhiteCard>
    </Container>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    scrollContent: {
      paddingBottom: s(20),
    },
    instructionText: {
      marginBottom: s(24),
      lineHeight: s(20),
    },
    inputContainer: {
      marginBottom: s(20),
    },
    textAreaInput: {
      minHeight: s(120),
      paddingTop: s(12),
      textAlignVertical: 'top',
    },
    submitButton: {
      marginTop: s(8),
      borderRadius: s(12),
    },
  });

export default HelpSupportScreen;

