import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {
  useNavigation,
  CompositeNavigationProp,
} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import Container from '../../components/layouts/Container/Container';
import Label from '../../components/base/Label/Label';
import InputField from '../../components/base/InputField/InputField';
import Button from '../../components/base/Button/Button';
import {BottomSheet} from '../../components/common/BottomSheet';
import {useTheme} from '../../hooks/useTheme';
import {useWallet, useTransactions} from '../../hooks/useWallet';
import {Theme} from '../../types/theme';
import {s} from '../../theme/size';
import {images} from '../../theme/images';
import {
  ProfileStackParamList,
  MainTabParamList,
  RootStackParamList,
} from '../../types/navigation';
import {MainHeader} from '../../components/common/Headers/MainHeader';
import WhiteCard from '../../components/common/WhiteCard';
import {WalletTransaction, PayoutMethod} from '../../types/wallet.types';

type WalletScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<ProfileStackParamList, 'Wallet'>,
  CompositeNavigationProp<
    BottomTabNavigationProp<MainTabParamList>,
    StackNavigationProp<RootStackParamList>
  >
>;

const PAYOUT_METHODS: {id: PayoutMethod; label: string}[] = [
  {id: 'UPI', label: 'UPI'},
  {id: 'PAYPAL', label: 'PayPal'},
  {id: 'CRYPTO', label: 'Crypto'},
];

const WalletScreen: React.FC = () => {
  const navigation = useNavigation<WalletScreenNavigationProp>();
  const {theme} = useTheme();
  const styles = createStyles(theme);

  // Wallet data
  const {
    balance,
    pendingWithdrawals,
    availableBalance,
    isLoadingBalance,
    isWithdrawing,
    balanceError,
    refetchBalance,
    withdraw,
  } = useWallet();

  // Recent transactions (limit to 4)
  const {
    transactions,
    isLoading: isLoadingTransactions,
    refetch: refetchTransactions,
  } = useTransactions({initialLimit: 4});

  // Withdrawal form state
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<PayoutMethod>('UPI');
  const [upiId, setUpiId] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [cryptoAddress, setCryptoAddress] = useState('');
  const [cryptoNetwork, setCryptoNetwork] = useState('ETH');
  const [methodSheetVisible, setMethodSheetVisible] = useState(false);

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount < 100) {
      return; // Validation handled by button disable state
    }

    let accountDetails: any = {};
    switch (selectedMethod) {
      case 'UPI':
        accountDetails = {upiId};
        break;
      case 'PAYPAL':
        accountDetails = {email: paypalEmail};
        break;
      case 'CRYPTO':
        accountDetails = {cryptoAddress, cryptoNetwork};
        break;
    }

    const result = await withdraw({
      amount,
      method: selectedMethod,
      accountDetails,
    });

    if (result.success) {
      // Clear form
      setWithdrawAmount('');
      setUpiId('');
      setPaypalEmail('');
      setCryptoAddress('');
      // Refresh data
      refetchBalance();
      refetchTransactions();
    }
  };

  const isWithdrawDisabled = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount < 100 || amount > availableBalance) {
      return true;
    }
    switch (selectedMethod) {
      case 'UPI':
        return !upiId.trim();
      case 'PAYPAL':
        return !paypalEmail.trim();
      case 'CRYPTO':
        return !cryptoAddress.trim() || !cryptoNetwork.trim();
    }
    return false;
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const renderTransactionItem = ({item}: {item: WalletTransaction}) => {
    const isWithdrawal = item.type === 'WITHDRAWAL';
    const isNegative = item.amount < 0 || isWithdrawal;

    return (
      <View style={styles.transactionItem}>
        <View style={styles.transactionLeft}>
          <View
            style={[
              styles.transactionIcon,
              isNegative ? styles.withdrawIcon : styles.earningsIcon,
            ]}>
            <Image
              source={isNegative ? images.wallet : images.earn}
              style={[
                styles.transactionIconImage,
                {tintColor: isNegative ? '#EF5350' : '#4CAF50'},
              ]}
            />
          </View>
          <View style={styles.transactionDetails}>
            <Label
              text={item.description || item.type}
              size={15}
              weight="medium"
              color="#1A1A1A"
              numberOfLines={1}
            />
            <Label
              text={new Date(item.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
              size={12}
              color="#888888"
              style={styles.transactionDate}
            />
          </View>
        </View>
        <Text
          style={[
            styles.transactionAmount,
            isNegative ? styles.negativeAmount : styles.positiveAmount,
          ]}>
          {isNegative ? `- $${Math.abs(item.amount)}` : `+$${item.amount}`}
        </Text>
      </View>
    );
  };

  const isRefreshing = isLoadingBalance || isLoadingTransactions;

  const handleRefresh = () => {
    refetchBalance();
    refetchTransactions();
  };

  return (
    <Container>
      <MainHeader />
      <WhiteCard>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#23C28C']}
              tintColor="#23C28C"
            />
          }>
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
                {isLoadingBalance ? (
                  <ActivityIndicator size="small" color="#23C28C" />
                ) : (
                  <Text style={styles.balanceAmount}>
                    <Text style={styles.balanceMain}>
                      {formatCurrency(availableBalance).split('.')[0]}
                    </Text>
                    <Text style={styles.balanceDecimal}>
                      .{formatCurrency(availableBalance).split('.')[1]}
                    </Text>
                  </Text>
                )}
              </View>
              <Label
                text="USD"
                size={14}
                weight="medium"
                color="#666666"
                style={styles.currencyLabel}
              />
            </View>
            {pendingWithdrawals > 0 && (
              <Label
                text={`Pending: $${formatCurrency(pendingWithdrawals)}`}
                size={13}
                color="#FF9800"
                style={styles.monthlyEarnings}
              />
            )}
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Label text="Total Balance" size={12} color="#888888" />
              <Label
                text={`$${formatCurrency(balance)}`}
                size={20}
                weight="bold"
                color="#1A1A1A"
              />
            </View>
            <View style={styles.statItem}>
              <Label text="Pending" size={12} color="#888888" />
              <Label
                text={`$${formatCurrency(pendingWithdrawals)}`}
                size={20}
                weight="bold"
                color="#FF9800"
              />
            </View>
            <View style={styles.statItem}>
              <Label text="Available" size={12} color="#888888" />
              <Label
                text={`$${formatCurrency(availableBalance)}`}
                size={20}
                weight="bold"
                color="#23C28C"
              />
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
              placeholder="Min $100"
              value={withdrawAmount}
              onChangeText={setWithdrawAmount}
              keyboardType="numeric"
              containerStyle={styles.inputContainer}
            />

            <Label
              text="Payout Method"
              size={14}
              color="#666666"
              style={styles.fieldLabel}
            />
            <TouchableOpacity
              style={styles.methodSelector}
              onPress={() => setMethodSheetVisible(true)}>
              <Label
                text={PAYOUT_METHODS.find((m) => m.id === selectedMethod)?.label || 'Select'}
                size={14}
                color="#1A1A1A"
              />
              <Image source={images.rightArrow} style={styles.dropdownArrow} />
            </TouchableOpacity>

            {/* Account Details based on method */}
            {selectedMethod === 'UPI' && (
              <>
                <Label
                  text="UPI ID"
                  size={14}
                  color="#666666"
                  style={styles.fieldLabel}
                />
                <InputField
                  placeholder="yourname@upi"
                  value={upiId}
                  onChangeText={setUpiId}
                  containerStyle={styles.inputContainer}
                  autoCapitalize="none"
                />
              </>
            )}

            {selectedMethod === 'PAYPAL' && (
              <>
                <Label
                  text="PayPal Email"
                  size={14}
                  color="#666666"
                  style={styles.fieldLabel}
                />
                <InputField
                  placeholder="your@email.com"
                  value={paypalEmail}
                  onChangeText={setPaypalEmail}
                  keyboardType="email-address"
                  containerStyle={styles.inputContainer}
                  autoCapitalize="none"
                />
              </>
            )}

            {selectedMethod === 'CRYPTO' && (
              <>
                <Label
                  text="Wallet Address"
                  size={14}
                  color="#666666"
                  style={styles.fieldLabel}
                />
                <InputField
                  placeholder="0x..."
                  value={cryptoAddress}
                  onChangeText={setCryptoAddress}
                  containerStyle={styles.inputContainer}
                  autoCapitalize="none"
                />
                <Label
                  text="Network"
                  size={14}
                  color="#666666"
                  style={styles.fieldLabel}
                />
                <InputField
                  placeholder="ETH, BTC, etc."
                  value={cryptoNetwork}
                  onChangeText={setCryptoNetwork}
                  containerStyle={styles.inputContainer}
                  autoCapitalize="characters"
                />
              </>
            )}

            <Button
              title={isWithdrawing ? 'Processing...' : 'WITHDRAW'}
              onPress={handleWithdraw}
              variant="primary"
              style={styles.withdrawButton}
              disabled={isWithdrawDisabled() || isWithdrawing}
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
              <TouchableOpacity
                onPress={() => navigation.navigate('TransactionsModal' as any)}>
                <Label text="See All" size={14} color="#23C28C" />
              </TouchableOpacity>
            </View>

            {isLoadingTransactions ? (
              <ActivityIndicator
                size="small"
                color="#23C28C"
                style={{paddingVertical: s(20)}}
              />
            ) : transactions.length === 0 ? (
              <View style={styles.emptyTransactions}>
                <Label text="No transactions yet" size={14} color="#888888" />
              </View>
            ) : (
              transactions.map((transaction) => (
                <View key={transaction.id}>
                  {renderTransactionItem({item: transaction})}
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </WhiteCard>

      {/* Payout Method Sheet */}
      <BottomSheet
        visible={methodSheetVisible}
        onClose={() => setMethodSheetVisible(false)}
        title="Select Payout Method">
        {PAYOUT_METHODS.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.methodOption,
              selectedMethod === method.id && styles.methodOptionSelected,
            ]}
            onPress={() => {
              setSelectedMethod(method.id);
              setMethodSheetVisible(false);
            }}>
            <View style={styles.methodIconContainer}>
              <Image source={images.paymentMethod} style={styles.methodIcon} />
            </View>
            <Label text={method.label} size={16} color="#1A1A1A" />
            {selectedMethod === method.id && (
              <Label text="✓" size={20} weight="bold" color="#23C28C" style={styles.checkIcon} />
            )}
          </TouchableOpacity>
        ))}
      </BottomSheet>
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
    methodSelector: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.inputBg,
      borderRadius: s(30),
      paddingHorizontal: s(16),
      paddingVertical: s(14),
      borderWidth: 1,
      borderColor: theme.colors.border,
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
    transactionIconImage: {
      width: s(20),
      height: s(20),
      resizeMode: 'contain',
    },
    dropdownArrow: {
      width: s(16),
      height: s(16),
      resizeMode: 'contain',
      tintColor: '#888888',
      transform: [{rotate: '90deg'}],
    },
    methodIcon: {
      width: s(24),
      height: s(24),
      resizeMode: 'contain',
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
    emptyTransactions: {
      paddingVertical: s(20),
      alignItems: 'center',
    },
    // Method sheet styles
    methodOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: s(16),
      borderBottomWidth: 1,
      borderBottomColor: '#F5F5F5',
    },
    methodOptionSelected: {
      backgroundColor: '#F5FFF9',
    },
    methodIconContainer: {
      width: s(40),
      height: s(40),
      borderRadius: s(20),
      backgroundColor: '#F5F5F5',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: s(14),
    },
    checkIcon: {
      marginLeft: 'auto',
    },
  });

export default WalletScreen;
