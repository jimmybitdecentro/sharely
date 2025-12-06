import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { images } from '../../../theme/images';
import { s } from '../../../theme/size';
import IVLogo from '../../base/ImageView/IVLogo';
import IVCircle from '../../base/ImageView/IVCircle';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { MainTabParamList } from '../../../types/navigation';
import TextCustom from '../../base/Label/TextCustom';

export const ActionBar = ({
  title = 'Notifications',
  onBackPress = () => { },
  onSharePress = () => { },
  sharePress = false,
}) => {

  const styles = headerStyles();
  return (
    <View style={styles.header}>
      <View style={styles.backButtonContainer}>
        <IVCircle size={40} src={images.back}
          mr={s(10)}
          onPress={
            onBackPress
          }
        />
      </View>

      <View style={styles.titleContainer}>
        <TextCustom text={title} size={20} color="white" fontFamily="bold" />
      </View>


      {sharePress ? <IVCircle size={40} src={images.share}
        mr={s(10)}
        onPress={ onSharePress }
      />
        : <View style={styles.backButtonContainer} />
      }
    </View>
  );
};

// ---------------- Styles ----------------
const headerStyles = () =>
  StyleSheet.create({
    headerWrap: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: s(4),
      paddingVertical: s(6),
    },
    left: {
      flexDirection: 'column',
    },

    greeting: {
      marginTop: s(6),
      color: '#444',
      fontSize: s(14),
    },
    right: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconBtn: {
      padding: s(8),
      marginRight: s(8),
    },
    avatar: {
      width: s(40),
      height: s(40),
      borderRadius: s(20),
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: s(0),
      paddingBottom: s(10),
    },
    backButtonContainer: {
      width: s(40),
    },
    titleContainer: {

      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      width: s(120),
      height: s(45),
      resizeMode: 'contain',
    },
    profileImg: {
      width: s(40),
      height: s(40),
      borderRadius: 20,
    },
  });
