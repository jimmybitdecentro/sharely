import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from '@react-native-vector-icons/feather';
import Container from '../../components/layouts/Container/Container';
import Label from '../../components/base/Label/Label';
import { useTheme } from '../../hooks/useTheme';
import { Theme } from '../../types/theme';
import { s } from '../../theme/size';
import WhiteCard from '../../components/common/WhiteCard';
import { ActionBar } from '../../components/common/Headers/ActionBar';

interface Transaction {
  id: string;
  type: 'withdraw' | 'earnings';
  title: string;
  date: string;
  amount: number;
}

const allTransactions: Transaction[] = [
  {
    id: '1',
    type: 'withdraw',
    title: 'Withdraw',
    date: 'Today, 2:30 PM',
    amount: -200,
  },
  {
    id: '2',
    type: 'earnings',
    title: 'Earnings from link clicks',
    date: 'Yesterday, 5:45 PM',
    amount: 12,
  },
  {
    id: '3',
    type: 'withdraw',
    title: 'Withdraw',
    date: 'Today, 2:30 PM',
    amount: -200,
  },
  {
    id: '4',
    type: 'earnings',
    title: 'Earnings from link clicks',
    date: 'Yesterday, 5:45 PM',
    amount: 12,
  },
  {
    id: '5',
    type: 'withdraw',
    title: 'Withdraw',
    date: 'Today, 2:30 PM',
    amount: -200,
  },
  {
    id: '6',
    type: 'earnings',
    title: 'Earnings from link clicks',
    date: 'Yesterday, 5:45 PM',
    amount: 12,
  },
  {
    id: '7',
    type: 'withdraw',
    title: 'Withdraw',
    date: 'Today, 2:30 PM',
    amount: -200,
  },
  {
    id: '8',
    type: 'earnings',
    title: 'Earnings from link clicks',
    date: 'Yesterday, 5:45 PM',
    amount: 12,
  },
];

const TransactionsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View
          style={[
            styles.transactionIcon,
            item.type === 'withdraw'
              ? styles.withdrawIcon
              : styles.earningsIcon,
          ]}
        >
          {item.type === 'withdraw' ? (
            <Feather name="arrow-up-right" size={s(20)} color="#EF5350" />
          ) : (
            <Feather name="arrow-up-right" size={s(20)} color="#4CAF50" />
          )}
        </View>
        <View style={styles.transactionDetails}>
          <Label text={item.title} size={15} weight="medium" color="#1A1A1A" />
          <Label
            text={item.date}
            size={12}
            color="#888888"
            style={styles.transactionDate}
          />
        </View>
      </View>
      <Text
        style={[
          styles.transactionAmount,
          item.amount < 0 ? styles.negativeAmount : styles.positiveAmount,
        ]}
      >
        {item.amount < 0 ? `- $${Math.abs(item.amount)}` : `+$${item.amount}`}
      </Text>
    </View>
  );

  return (
    <Container style={styles.container}>
      <ActionBar
        title="Transactions"
        onBackPress={() => {
          navigation.goBack();
        }}
      />

      {/* Transactions Card */}
      <WhiteCard bottomBorderRadius={s(30)}>
        <FlatList
          data={allTransactions}
          keyExtractor={(item) => item.id}
          renderItem={renderTransactionItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
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
    listContent: {
      paddingBottom: s(30),
    },
    transactionItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#F8F8F8',
      borderRadius: s(30),
      padding: s(14),
      marginBottom: s(12),
    },
    transactionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    transactionIcon: {
      width: s(44),
      height: s(44),
      borderRadius: s(22),
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: s(12),
    },
    withdrawIcon: {
      backgroundColor: '#FFEBEE',
    },
    earningsIcon: {
      backgroundColor: '#E8F5E9',
    },
    transactionDetails: {
      flex: 1,
    },
    transactionDate: {
      marginTop: s(2),
    },
    transactionAmount: {
      fontSize: s(16),
      fontFamily: theme.fonts.semiBold,
    },
    negativeAmount: {
      color: '#EF5350',
    },
    positiveAmount: {
      color: '#4CAF50',
    },
  });

export default TransactionsScreen;
