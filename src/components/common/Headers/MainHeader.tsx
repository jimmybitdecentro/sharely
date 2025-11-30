import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { images } from '../../../theme/images';
import { s } from '../../../theme/size';
import IVLogo from '../../base/ImageView/IVLogo';
import IVCircle from '../../base/ImageView/IVCircle';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { MainTabParamList } from '../../../types/navigation';

export const MainHeader = ({
}) => {

  const styles = headerStyles();
  const navigation = useNavigation<NavigationProp<MainTabParamList>>();
  return (
    <View style={styles.header}>
      <View>
        <IVLogo />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <IVCircle size={40} src={images.notification}
          mr={s(10)}
          onPress={
            () => navigation.navigate('Notifications')
          }
        />
        <IVCircle size={40} src={images.sound}
          mr={s(10)}
          onPress={
            () => navigation.navigate('HelpSupport')
          }
        />
        <IVCircle size={40} src={images.profile}
          mr={s(10)}
          onPress={
            () => navigation.navigate('ProfileStack', { screen: 'Profile' })
          }
        />

      </View>
    </View>
  );
};

// ---------------- Styles ----------------
const headerStyles = () =>
  StyleSheet.create({
  
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: s(15),

    },
   
  });
