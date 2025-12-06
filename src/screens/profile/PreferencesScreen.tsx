import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Switch,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Container from '../../components/layouts/Container/Container';
import FormCard from '../../components/common/FormCard/FormCard';
import Label from '../../components/base/Label/Label';
import { useTheme } from '../../hooks/useTheme';
import { Theme } from '../../types/theme';
import { s } from '../../theme/size';
import { ActionBar } from '../../components/common/Headers/ActionBar';
import { images } from '../../theme/images';

interface PreferenceItem {
  key: string;
  label: string;
  image: any;
}

const PREFERENCE_ITEMS: PreferenceItem[] = [
  { key: 'pushNotification', label: 'Push Notification', image: images.push },
  { key: 'earningUpdates', label: 'Earning Updates', image: images.earning },
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
        <Image source={item.image} style={styles.preferenceIcon} />
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
    <ActionBar title="Preferences" onBackPress={() => navigation.goBack()} />
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
    preferenceIcon: {
      width: s(40),
      height: s(40),
      resizeMode: 'contain',
      marginRight: s(14),
    },
  });

export default PreferencesScreen;

