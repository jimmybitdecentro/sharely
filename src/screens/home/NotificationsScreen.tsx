import React from 'react';
import {View, StyleSheet} from 'react-native';
import Container from '../../components/layouts/Container/Container';
import Label from '../../components/base/Label/Label';
import {useTheme} from '../../hooks/useTheme';

const NotificationsScreen: React.FC = () => {
  const {theme} = useTheme();
  const styles = createStyles(theme);

  return (
    <Container>
      <View style={styles.container}>
        <Label text="Notifications Screen" variant="heading" useTranslation={false} />
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
      padding: theme.spacing.lg,
    },
  });

export default NotificationsScreen;

