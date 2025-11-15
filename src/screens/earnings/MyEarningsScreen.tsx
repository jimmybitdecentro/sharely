import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Container from '../../components/layouts/Container/Container';
import Button from '../../components/base/Button/Button';
import Label from '../../components/base/Label/Label';
import {useTheme} from '../../hooks/useTheme';
import {useLanguage} from '../../hooks/useLanguage';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'earnings' | 'withdrawal';
}

const MyEarningsScreen: React.FC = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const {t} = useLanguage();
  const [transactions] = useState<Transaction[]>([]);
  const styles = createStyles(theme);

  return (
    <Container>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Label
            text={t('myEarnings')}
            variant="heading"
            style={styles.title}
            useTranslation={true}
          />
        </View>
        <View style={styles.content}>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>{t('currentBalance')}</Text>
            <Text style={styles.balanceAmount}>₹257.50</Text>
            <Text style={styles.totalEarnings}>
              {t('totalEarnings')}: ₹1325
            </Text>
          </View>
          <Button
            title={t('withdrawNow')}
            onPress={() => {}}
            variant="primary"
            style={styles.button}
          />
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>125</Text>
              <Text style={styles.statLabel}>{t('totalClicks')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>23</Text>
              <Text style={styles.statLabel}>{t('totalShares')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>₹9,806</Text>
              <Text style={styles.statLabel}>{t('totalRevenue')}</Text>
            </View>
          </View>
          <View style={styles.transactionsSection}>
            <Label
              text={t('transactionHistory')}
              variant="subtitle"
              style={styles.sectionTitle}
              useTranslation={true}
            />
            {transactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View>
                  <Text style={styles.transactionDescription}>
                    {transaction.description}
                  </Text>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                </View>
                <Text
                  style={[
                    styles.transactionAmount,
                    transaction.type === 'earnings' ? styles.earnings : styles.withdrawal,
                  ]}>
                  {transaction.type === 'earnings' ? '+' : '-'}₹
                  {transaction.amount.toLocaleString('en-IN')}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
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
      alignItems: 'center',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
    backIcon: {
      fontSize: 24,
      color: theme.colors.text,
      marginRight: theme.spacing.md,
    },
    title: {
      flex: 1,
    },
    content: {
      padding: theme.spacing.md,
    },
    balanceCard: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    balanceLabel: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.background,
      marginBottom: theme.spacing.sm,
    },
    balanceAmount: {
      fontSize: theme.typography.h1.fontSize,
      fontWeight: theme.typography.h1.fontWeight,
      color: theme.colors.background,
      marginBottom: theme.spacing.sm,
    },
    totalEarnings: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.background,
      opacity: 0.9,
    },
    button: {
      width: '100%',
      marginBottom: theme.spacing.lg,
    },
    stats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.xl,
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
    },
    statValue: {
      fontSize: theme.typography.h3.fontSize,
      fontWeight: theme.typography.h3.fontWeight,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    statLabel: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    transactionsSection: {
      marginTop: theme.spacing.lg,
    },
    sectionTitle: {
      marginBottom: theme.spacing.md,
    },
    transactionItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    transactionDescription: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    transactionDate: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.textSecondary,
    },
    transactionAmount: {
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
    },
    earnings: {
      color: theme.colors.success,
    },
    withdrawal: {
      color: theme.colors.text,
    },
  });

export default MyEarningsScreen;

