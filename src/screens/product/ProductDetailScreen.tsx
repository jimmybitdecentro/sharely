import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import Container from '../../components/layouts/Container/Container';
import Button from '../../components/base/Button/Button';
import Label from '../../components/base/Label/Label';
import ImageView from '../../components/base/ImageView/ImageView';
import {useTheme} from '../../hooks/useTheme';
import {useLanguage} from '../../hooks/useLanguage';
import {HomeStackParamList} from '../../types/navigation';

type ProductDetailScreenRouteProp = RouteProp<HomeStackParamList, 'ProductDetail'>;

const ProductDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<ProductDetailScreenRouteProp>();
  const {theme} = useTheme();
  const {t} = useLanguage();
  const [showShareOptions, setShowShareOptions] = useState(false);
  const styles = createStyles(theme);

  const product = {
    id: route.params.productId,
    title: 'Latest iPhone 15 Pro',
    price: 120000,
    earnAmount: 15,
    images: ['https://via.placeholder.com/400'],
    description: 'The latest iPhone with amazing features',
    specs: {
      display: '6.1 inch',
      processor: 'A17 Pro',
      camera: '48MP',
      battery: '3274 mAh',
    },
  };

  return (
    <Container>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{product.title}</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => setShowShareOptions(true)}>
              <Text style={styles.icon}>📤</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.icon}>🔖</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ImageView
          source={{uri: product.images[0]}}
          style={styles.productImage}
          resizeMode="cover"
        />
        <View style={styles.content}>
          <Label text={product.title} variant="heading" useTranslation={false} />
          <Text style={styles.earnText}>
            {t('earn')} ₹{product.earnAmount}
          </Text>
          <Text style={styles.price}>₹{product.price.toLocaleString('en-IN')}</Text>
          <Text style={styles.description}>{product.description}</Text>
          <View style={styles.specs}>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Display</Text>
              <Text style={styles.specValue}>{product.specs.display}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Processor</Text>
              <Text style={styles.specValue}>{product.specs.processor}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Camera</Text>
              <Text style={styles.specValue}>{product.specs.camera}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Battery</Text>
              <Text style={styles.specValue}>{product.specs.battery}</Text>
            </View>
          </View>
          <Button
            title={t('shareNow')}
            onPress={() => setShowShareOptions(true)}
            variant="primary"
            style={styles.button}
          />
        </View>
      </ScrollView>
      <Modal
        visible={showShareOptions}
        transparent
        animationType="slide"
        onRequestClose={() => setShowShareOptions(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Share Options</Text>
            <View style={styles.shareOptions}>
              {['WhatsApp', 'Instagram', 'Facebook', 'Twitter', 'Snapchat', 'Telegram'].map(
                (option) => (
                  <TouchableOpacity key={option} style={styles.shareOption}>
                    <Text style={styles.shareOptionText}>{option}</Text>
                  </TouchableOpacity>
                ),
              )}
            </View>
            <Button
              title={t('share')}
              onPress={() => setShowShareOptions(false)}
              variant="primary"
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>
    </Container>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
    backIcon: {
      fontSize: 24,
      color: theme.colors.text,
    },
    headerTitle: {
      flex: 1,
      fontSize: theme.typography.h3.fontSize,
      fontWeight: theme.typography.h3.fontWeight,
      color: theme.colors.text,
      textAlign: 'center',
    },
    headerIcons: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    icon: {
      fontSize: 24,
    },
    productImage: {
      width: '100%',
      height: 300,
    },
    content: {
      padding: theme.spacing.md,
    },
    earnText: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.success,
      fontWeight: '600',
      marginTop: theme.spacing.sm,
    },
    price: {
      fontSize: theme.typography.h2.fontSize,
      fontWeight: theme.typography.h2.fontWeight,
      color: theme.colors.text,
      marginTop: theme.spacing.sm,
    },
    description: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.md,
    },
    specs: {
      marginTop: theme.spacing.lg,
    },
    specItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    specLabel: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.textSecondary,
    },
    specValue: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text,
      fontWeight: '600',
    },
    button: {
      width: '100%',
      marginTop: theme.spacing.xl,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: theme.borderRadius.lg,
      borderTopRightRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
    },
    modalTitle: {
      fontSize: theme.typography.h3.fontSize,
      fontWeight: theme.typography.h3.fontWeight,
      color: theme.colors.text,
      marginBottom: theme.spacing.lg,
      textAlign: 'center',
    },
    shareOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.lg,
    },
    shareOption: {
      width: '30%',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    shareOptionText: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.text,
    },
    modalButton: {
      width: '100%',
    },
  });

export default ProductDetailScreen;

