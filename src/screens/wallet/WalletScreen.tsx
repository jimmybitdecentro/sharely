import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  useNavigation,
  CompositeNavigationProp,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Feather from '@react-native-vector-icons/feather';
import Container from '../../components/layouts/Container/Container';
import Label from '../../components/base/Label/Label';
import InputField from '../../components/base/InputField/InputField';
import Button from '../../components/base/Button/Button';
import { useTheme } from '../../hooks/useTheme';
import { Theme } from '../../types/theme';
import { s } from '../../theme/size';
import { images } from '../../theme/images';
import {
  ProfileStackParamList,
  MainTabParamList,
  RootStackParamList,
} from '../../types/navigation';

type WalletScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<ProfileStackParamList, 'Wallet'>,
  CompositeNavigationProp<
    BottomTabNavigationProp<MainTabParamList>,
    StackNavigationProp<RootStackParamList>
  >
>;

interface Transaction {
  id: string;
  type: 'withdraw' | 'earnings';
  title: string;
  date: string;
  amount: number;
}

const sampleTransactions: Transaction[] = [
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
];

const WalletScreen: React.FC = () => {
  const navigation = useNavigation<WalletScreenNavigationProp>();
  const { theme } = useTheme();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const styles = createStyles(theme);

  const handleWithdraw = () => {
    console.log('Withdraw:', { amount: withdrawAmount, upiId });
  };

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
            <View style={styles.withdrawArrowContainer}>
              <Feather name="check" size={s(14)} color="#EF5350" />
              <Feather name="arrow-up-right" size={s(12)} color="#EF5350" style={styles.smallArrow} />
            </View>
          ) : (
            <Feather name="arrow-down-left" size={s(20)} color="#4CAF50" />
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
      {/* Header */}
      <View style={styles.header}>
        <Image source={images.logo} style={styles.logo} />
        <View style={styles.headerIcons}>
          <Image source={images.sound} style={styles.headerIcon} />
          <Image source={images.notification} style={styles.headerIcon} />
          <TouchableOpacity onPress={() => navigation.navigate('ProfileModal')}>
            <Image source={images.profile} style={styles.avatar} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Card */}
      <View style={styles.whiteCard}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Balance Section */}
          <View style={styles.balanceSection}>
            <Label
              text="AVAILABLE BALANCE:"
              size={12}
              weight="medium"
              color="#666666"
            />
            <View style={styles.balanceRow}>
              <Image
                source={images.dollor}
                style={{
                  height: s(20),
                  width: s(20),
                  resizeMode: 'contain',
                  marginRight: s(10),
                  tintColor: 'black',
                }}
              />
              <View style={styles.balanceTextContainer}>
                <Text style={styles.balanceAmount}>
                  <Text style={styles.balanceMain}>121,293</Text>
                  <Text style={styles.balanceDecimal}>.00</Text>
                </Text>
              </View>
              <Label
                text="USD"
                size={14}
                weight="medium"
                color="#666666"
                style={styles.currencyLabel}
              />
            </View>
            <Label
              text="This Month: ₹1325"
              size={13}
              color="#666666"
              style={styles.monthlyEarnings}
            />
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Label text="Total Clicks" size={12} color="#888888" />
              <Label text="125" size={24} weight="bold" color="#1A1A1A" />
            </View>
            <View style={styles.statItem}>
              <Label text="Referrals" size={12} color="#888888" />
              <Label text="23" size={24} weight="bold" color="#1A1A1A" />
            </View>
            <View style={styles.statItem}>
              <Label text="Total Earnings" size={12} color="#888888" />
              <Label text="$90" size={24} weight="bold" color="#23C28C" />
            </View>
          </View>

          {/* Quick Withdraw Section */}
          <View style={styles.withdrawSection}>
            <Label
              text="Quick Withdraw"
              size={18}
              weight="bold"
              color="#1A1A1A"
              style={styles.sectionTitle}
            />

            <Label
              text="Withdrawal Amount"
              size={14}
              color="#666666"
              style={styles.fieldLabel}
            />
            <InputField
              placeholder="Min ₹100"
              value={withdrawAmount}
              onChangeText={setWithdrawAmount}
              keyboardType="numeric"
              containerStyle={styles.inputContainer}
            />

            <Label
              text="Add Your UPI ID"
              size={14}
              color="#666666"
              style={styles.fieldLabel}
            />
            <InputField
              placeholder="Type or Paste your UPI ID"
              value={upiId}
              onChangeText={setUpiId}
              containerStyle={styles.inputContainer}
            />

            <Button
              title="WITHDRAW"
              onPress={handleWithdraw}
              variant="primary"
              style={styles.withdrawButton}
            />
          </View>

          {/* Recent Transactions */}
          <View style={styles.transactionsSection}>
            <View style={styles.transactionsHeader}>
              <Label
                text="Recent Transactions"
                size={16}
                weight="bold"
                color="#1A1A1A"
              />
              <TouchableOpacity onPress={() => navigation.navigate('TransactionsModal' as any)}>
                <Label text="See All" size={14} color="#23C28C" />
              </TouchableOpacity>
            </View>

            {sampleTransactions.map(transaction => (
              <View key={transaction.id}>
                {renderTransactionItem({ item: transaction })}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
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
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: s(40),
      paddingBottom: s(16),
    },
    logo: {
      width: s(100),
      height: s(35),
      resizeMode: 'contain',
    },
    headerIcons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(8),
    },
    headerIcon: {
      width: s(36),
      height: s(36),
      resizeMode: 'contain',
    },
    avatar: {
      width: s(40),
      height: s(40),
      resizeMode: 'contain',
    },
    whiteCard: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      borderTopLeftRadius: s(30),
      borderTopRightRadius: s(30),
      paddingHorizontal: s(20),
      paddingTop: s(24),
    },
    scrollContent: {
      paddingBottom: s(30),
    },
    balanceSection: {
      marginBottom: s(16),
    },
    balanceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: s(8),
    },
    balanceIconContainer: {
      width: s(32),
      height: s(32),
      borderRadius: s(16),
      borderWidth: 2,
      borderColor: '#1A1A1A',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: s(10),
    },
    dollarIcon: {
      fontSize: s(16),
      fontWeight: 'bold',
      color: '#1A1A1A',
    },
    balanceTextContainer: {
      flex: 1,
    },
    balanceAmount: {
      flexDirection: 'row',
    },
    balanceMain: {
      fontSize: s(36),
      fontFamily: theme.fonts.bold,
      color: '#23C28C',
    },
    balanceDecimal: {
      fontSize: s(36),
      fontFamily: theme.fonts.bold,
      color: '#CCCCCC',
    },
    currencyLabel: {
      marginLeft: s(8),
    },
    monthlyEarnings: {
      marginTop: s(4),
    },
    divider: {
      height: 1,
      backgroundColor: '#EEEEEE',
      marginVertical: s(16),
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: s(24),
    },
    statItem: {
      alignItems: 'flex-start',
    },
    withdrawSection: {
      marginBottom: s(24),
    },
    sectionTitle: {
      marginBottom: s(16),
    },
    fieldLabel: {
      marginBottom: s(6),
    },
    inputContainer: {
      marginBottom: s(16),
    },
    withdrawButton: {
      marginTop: s(8),
    },
    transactionsSection: {
      marginTop: s(8),
    },
    transactionsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: s(16),
    },
    transactionItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: s(12),
      borderBottomWidth: 1,
      borderBottomColor: '#F5F5F5',
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
    withdrawArrowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    smallArrow: {
      marginLeft: s(-4),
      marginTop: s(-6),
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

export default WalletScreen;
