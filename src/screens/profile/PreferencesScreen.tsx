import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from '@react-native-vector-icons/feather';
import Container from '../../components/layouts/Container/Container';
import FormCard from '../../components/common/FormCard/FormCard';
import Label from '../../components/base/Label/Label';
import { useTheme } from '../../hooks/useTheme';
import { Theme } from '../../types/theme';
import { s } from '../../theme/size';

interface PreferenceItem {
  key: string;
  label: string;
  icon: string;
}

const PREFERENCE_ITEMS: PreferenceItem[] = [
  { key: 'pushNotification', label: 'Push Notification', icon: 'bell' },
  { key: 'earningUpdates', label: 'Earning Updates', icon: 'mail' },
];

const PreferencesScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [preferences, setPreferences] = useState<Record<string, boolean>>({
    pushNotification: true,
    earningUpdates: false,
  });

  const handleToggle = (key: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderPreferenceItem = (item: PreferenceItem) => (
    <View key={item.key} style={styles.preferenceItem}>
      <View style={styles.preferenceLeft}>
        <View style={styles.iconContainer}>
          <Feather name={item.icon} size={s(20)} color="#666666" />
        </View>
        <Label text={item.label} size={15} weight="medium" color="#1A1A1A" />
      </View>
      <Switch
        value={preferences[item.key]}
        onValueChange={() => handleToggle(item.key)}
        trackColor={{ false: '#E0E0E0', true: '#23C28C' }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#E0E0E0"
      />
    </View>
  );

  return (
    <Container style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Feather name="arrow-left" size={s(20)} color="#FFFFFF" />
        </TouchableOpacity>
        <Label text="Preferences" size={20} weight="bold" color="#FFFFFF" />
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Content Card */}
      <FormCard
        title="Notification"
        buttonText=""
        onSubmit={() => {}}
        showButton={false}
        position="belowHeader"
        cardStyle={styles.formCardStyle}
      >
        {PREFERENCE_ITEMS.map(item => renderPreferenceItem(item))}
      </FormCard>
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
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: s(40),
      paddingBottom: s(20),
    },
    backButton: {
      width: s(44),
      height: s(44),
      borderRadius: s(22),
      backgroundColor: '#23C28C',
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerPlaceholder: {
      width: s(44),
    },
    formCardStyle: {
      marginTop: s(10),
      marginBottom: s(30),
      overflow: 'hidden',
    },
    preferenceItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: s(16),
    },
    preferenceLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconContainer: {
      width: s(44),
      height: s(44),
      borderRadius: s(22),
      backgroundColor: '#F5F5F5',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: s(14),
    },
  });

export default PreferencesScreen;

