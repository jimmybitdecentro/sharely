import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {images} from '../../theme/images';
import Container from '../../components/layouts/Container/Container';
import Label from '../../components/base/Label/Label';
import {BottomSheet} from '../../components/common/BottomSheet';
import {useTheme} from '../../hooks/useTheme';
import {useTransactions} from '../../hooks/useWallet';
import {Theme} from '../../types/theme';
import {s} from '../../theme/size';
import WhiteCard from '../../components/common/WhiteCard';
import {ActionBar} from '../../components/common/Headers/ActionBar';
import {WalletTransaction, TransactionType} from '../../types/wallet.types';

const GRADIENT_COLORS = ['#2C73D2', '#1A88B3', '#23C28C'];

const FILTER_OPTIONS: {id: TransactionType | 'all'; label: string}[] = [
  {id: 'all', label: 'All Transactions'},
  {id: 'REWARD', label: 'Rewards'},
  {id: 'WITHDRAWAL', label: 'Withdrawals'},
  {id: 'REFUND', label: 'Refunds'},
  {id: 'ADJUSTMENT', label: 'Adjustments'},
];

const TransactionsScreen: React.FC = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const styles = createStyles(theme);

  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<TransactionType | 'all'>('all');

  // Transactions hook
  const {
    transactions,
    pagination,
    isLoading,
    isFetching,
    error,
    type,
    changeType,
    hasNextPage,
    loadNextPage,
    refetch,
  } = useTransactions({initialLimit: 20});

  const handleApplyFilter = () => {
    if (selectedFilter === 'all') {
      changeType(undefined);
    } else {
      changeType(selectedFilter);
    }
    setFilterVisible(false);
  };

  const handleClearFilter = () => {
    setSelectedFilter('all');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = (transactionType: TransactionType) => {
    switch (transactionType) {
      case 'REWARD':
        return {image: images.earn, color: '#4CAF50', bg: '#E8F5E9'};
      case 'WITHDRAWAL':
        return {image: images.wallet, color: '#EF5350', bg: '#FFEBEE'};
      case 'REFUND':
        return {image: images.dollor, color: '#2196F3', bg: '#E3F2FD'};
      case 'ADJUSTMENT':
        return {image: images.transaction, color: '#FF9800', bg: '#FFF3E0'};
      default:
        return {image: images.transaction, color: '#666666', bg: '#F5F5F5'};
    }
  };

  const renderCheckbox = (selected: boolean) => (
    <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
      {selected && <Label text="✓" size={12} weight="bold" color="#FFFFFF" />}
    </View>
  );

  const renderTransactionItem = ({item}: {item: WalletTransaction}) => {
    const isNegative = item.amount < 0 || item.type === 'WITHDRAWAL';
    const iconConfig = getTransactionIcon(item.type);

    return (
      <View style={styles.transactionItem}>
        <View style={styles.transactionLeft}>
          <View
            style={[
              styles.transactionIcon,
              {backgroundColor: iconConfig.bg},
            ]}>
            <Image
              source={iconConfig.image}
              style={[styles.transactionIconImage, {tintColor: iconConfig.color}]}
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
              text={formatDate(item.createdAt)}
              size={12}
              color="#888888"
              style={styles.transactionDate}
            />
            <View style={styles.statusBadge}>
              <Label
                text={item.status}
                size={10}
                color={item.status === 'COMPLETED' ? '#4CAF50' : '#FF9800'}
              />
            </View>
          </View>
        </View>
        <View style={styles.amountContainer}>
          <Text
            style={[
              styles.transactionAmount,
              isNegative ? styles.negativeAmount : styles.positiveAmount,
            ]}>
            {isNegative ? `- $${Math.abs(item.amount).toFixed(2)}` : `+$${item.amount.toFixed(2)}`}
          </Text>
          <Label
            text={`Bal: $${item.balanceAfter.toFixed(2)}`}
            size={11}
            color="#888888"
          />
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    if (!hasNextPage) return null;
    return (
      <View style={styles.loadMoreContainer}>
        {isFetching ? (
          <ActivityIndicator size="small" color="#23C28C" />
        ) : (
          <TouchableOpacity onPress={loadNextPage} style={styles.loadMoreButton}>
            <Label text="Load More" size={14} color="#23C28C" weight="medium" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Image source={images.transaction} style={styles.emptyIcon} />
      <Label
        text="No transactions found"
        size={16}
        color="#888888"
        style={styles.emptyText}
      />
      <Label
        text="Your transaction history will appear here"
        size={14}
        color="#BBBBBB"
      />
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#23C28C" />
      <Label
        text="Loading transactions..."
        size={14}
        color="#888888"
        style={styles.loadingText}
      />
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <Image source={images.announcement} style={styles.errorIcon} />
      <Label text="Failed to load transactions" size={16} color="#EF5350" />
      <TouchableOpacity onPress={refetch} style={styles.retryButton}>
        <Label text="Tap to retry" size={14} color="#23C28C" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Container style={styles.container}>
      <ActionBar
        title="Transactions"
        onBackPress={() => navigation.goBack()}
        rightIcon="filter"
        onRightPress={() => setFilterVisible(true)}
      />

      <WhiteCard bottomBorderRadius={30}>
        {/* Summary */}
        {pagination && (
          <View style={styles.summaryRow}>
            <Label
              text={`${pagination.total} transactions`}
              size={14}
              color="#888888"
            />
            {type && (
              <View style={styles.filterBadge}>
                <Label text={type} size={12} color="#FFFFFF" />
                <TouchableOpacity onPress={() => changeType(undefined)}>
                  <Label text=" ✕" size={12} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {isLoading && !transactions.length ? (
          renderLoadingState()
        ) : error ? (
          renderErrorState()
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            renderItem={renderTransactionItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyState}
            ListFooterComponent={renderFooter}
            refreshControl={
              <RefreshControl
                refreshing={isFetching && !isLoading}
                onRefresh={refetch}
                colors={['#23C28C']}
                tintColor="#23C28C"
              />
            }
          />
        )}
      </WhiteCard>

      {/* Filter Bottom Sheet */}
      <BottomSheet
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        title="Filter Transactions">
        <Label
          text="Transaction Type"
          size={14}
          color="#888888"
          style={styles.filterSectionTitle}
        />

        {FILTER_OPTIONS.map((option, index) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.filterOptionRow,
              index < FILTER_OPTIONS.length - 1 && styles.filterOptionBorder,
            ]}
            onPress={() => setSelectedFilter(option.id)}
            activeOpacity={0.7}>
            {renderCheckbox(selectedFilter === option.id)}
            <Label
              text={option.label}
              size={16}
              weight={selectedFilter === option.id ? 'semiBold' : 'regular'}
              color="#1A1A1A"
            />
          </TouchableOpacity>
        ))}

        {/* Action Buttons */}
        <View style={styles.filterButtonRow}>
          <TouchableOpacity style={styles.clearButton} onPress={handleClearFilter}>
            <Label text="CLEAR" size={14} weight="semiBold" color="#1A1A1A" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleApplyFilter} activeOpacity={0.8}>
            <LinearGradient
              colors={GRADIENT_COLORS}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.applyButton}>
              <Label text="APPLY" size={14} weight="semiBold" color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: s(16),
    },
    filterBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#23C28C',
      paddingHorizontal: s(12),
      paddingVertical: s(4),
      borderRadius: s(12),
    },
    listContent: {
      paddingBottom: s(20),
      flexGrow: 1,
    },
    transactionItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: s(14),
      borderBottomWidth: 1,
      borderBottomColor: '#F5F5F5',
    },
    transactionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    transactionIcon: {
      width: s(48),
      height: s(48),
      borderRadius: s(24),
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: s(12),
    },
    transactionIconImage: {
      width: s(22),
      height: s(22),
      resizeMode: 'contain',
    },
    transactionDetails: {
      flex: 1,
    },
    transactionDate: {
      marginTop: s(2),
    },
    statusBadge: {
      marginTop: s(4),
    },
    amountContainer: {
      alignItems: 'flex-end',
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
    loadMoreContainer: {
      paddingVertical: s(16),
      alignItems: 'center',
    },
    loadMoreButton: {
      paddingVertical: s(8),
      paddingHorizontal: s(16),
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: s(60),
    },
    emptyIcon: {
      width: s(60),
      height: s(60),
      resizeMode: 'contain',
      opacity: 0.5,
    },
    emptyText: {
      marginTop: s(16),
      marginBottom: s(8),
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: s(60),
    },
    loadingText: {
      marginTop: s(12),
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: s(60),
    },
    errorIcon: {
      width: s(60),
      height: s(60),
      resizeMode: 'contain',
      marginBottom: s(12),
      opacity: 0.7,
    },
    retryButton: {
      marginTop: s(12),
      paddingVertical: s(8),
      paddingHorizontal: s(16),
    },
    // Filter styles
    filterSectionTitle: {
      marginBottom: s(12),
    },
    filterOptionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: s(14),
    },
    filterOptionBorder: {
      borderBottomWidth: 1,
      borderBottomColor: '#F0F0F0',
    },
    checkbox: {
      width: s(22),
      height: s(22),
      borderRadius: s(4),
      borderWidth: 1.5,
      borderColor: '#D0D0D0',
      marginRight: s(14),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
    },
    checkboxSelected: {
      backgroundColor: '#23C28C',
      borderColor: '#23C28C',
    },
    filterButtonRow: {
      flexDirection: 'row',
      marginTop: s(20),
      gap: s(12),
    },
    clearButton: {
      flex: 1,
      height: s(50),
      borderRadius: s(25),
      borderWidth: 1,
      borderColor: '#E0E0E0',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
    },
    applyButton: {
      flex: 1,
      minWidth: s(120),
      height: s(50),
      borderRadius: s(25),
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default TransactionsScreen;
