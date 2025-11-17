import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { images } from '../../../theme/images';
import { s } from '../../../theme/size';

export const MainHeader = ({
  name = 'Raj',
  onBellPress = () => {},
  profileUri = 'https://i.pravatar.cc/150?img=12',
}) => {
  const styles = headerStyles();

  return (
    <View style={styles.header}>
      <View>
        <Image source={images.logo} style={styles.logo} />
        <Text style={styles.greeting}>Good morning, Raj!</Text>
      </View>

      <View>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
          style={styles.profileImg}
        />
      </View>
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
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: s(15),
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
