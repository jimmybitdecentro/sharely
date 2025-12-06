import {useState, useCallback} from 'react';
import {
  useGetWalletBalanceQuery,
  useGetTransactionsQuery,
  useCreateWithdrawalMutation,
} from '../store/api';
import {useAppDispatch} from '../store/hooks';
import {showSuccessToast, showErrorToast} from '../store/slices/uiSlice';
import {
  TransactionListParams,
  TransactionType,
  WithdrawalRequest,
} from '../types/wallet.types';

interface UseWalletOptions {
  autoFetchBalance?: boolean;
  autoFetchTransactions?: boolean;
}

export const useWallet = (options: UseWalletOptions = {}) => {
  const {
    autoFetchBalance = true,
    autoFetchTransactions = false,
  } = options;

  const dispatch = useAppDispatch();

  // Balance query
  const {
    data: balance,
    isLoading: isLoadingBalance,
    error: balanceError,
    refetch: refetchBalance,
  } = useGetWalletBalanceQuery(undefined, {
    skip: !autoFetchBalance,
  });

  // Withdrawal mutation
  const [createWithdrawal, {isLoading: isWithdrawing}] = useCreateWithdrawalMutation();

  // Withdraw
  const handleWithdraw = useCallback(
    async (data: WithdrawalRequest) => {
      try {
        const result = await createWithdrawal(data).unwrap();
        dispatch(showSuccessToast({
          title: 'Withdrawal Requested',
          message: 'Your withdrawal request has been submitted',
        }));
        return {success: true, data: result};
      } catch (err: any) {
        const errorMessage = err?.data?.error?.message || 'Failed to create withdrawal';
        dispatch(showErrorToast({title: 'Error', message: errorMessage}));
        return {success: false, error: errorMessage};
      }
    },
    [createWithdrawal, dispatch],
  );

  return {
    // Balance data
    balance: balance?.balance || 0,
    pendingWithdrawals: balance?.pendingWithdrawals || 0,
    availableBalance: balance?.availableBalance || 0,
    
    // Loading states
    isLoadingBalance,
    isWithdrawing,
    
    // Errors
    balanceError: balanceError ? 'Failed to load balance' : null,
    
    // Actions
    refetchBalance,
    withdraw: handleWithdraw,
  };
};

// Separate hook for transactions with pagination
interface UseTransactionsOptions {
  initialPage?: number;
  initialLimit?: number;
  initialType?: TransactionType;
}

export const useTransactions = (options: UseTransactionsOptions = {}) => {
  const {
    initialPage = 1,
    initialLimit = 20,
    initialType,
  } = options;

  // Pagination state
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(initialLimit);
  const [type, setType] = useState<TransactionType | undefined>(initialType);

  // Query params
  const queryParams: TransactionListParams = {
    page,
    limit,
    ...(type && {type}),
  };

  // RTK Query hook
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetTransactionsQuery(queryParams);

  // Load next page
  const loadNextPage = useCallback(() => {
    if (data?.pagination && page < data.pagination.totalPages) {
      setPage((prev) => prev + 1);
    }
  }, [data?.pagination, page]);

  // Load previous page
  const loadPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  }, [page]);

  // Reset pagination
  const resetPagination = useCallback(() => {
    setPage(1);
  }, []);

  // Change type filter
  const changeType = useCallback((newType?: TransactionType) => {
    setType(newType);
    setPage(1);
  }, []);

  return {
    // Data
    transactions: data?.transactions || [],
    pagination: data?.pagination || null,
    
    // Loading states
    isLoading,
    isFetching,
    
    // Error
    error: error ? 'Failed to load transactions' : null,
    
    // Pagination controls
    page,
    hasNextPage: data?.pagination ? page < data.pagination.totalPages : false,
    hasPreviousPage: page > 1,
    loadNextPage,
    loadPreviousPage,
    resetPagination,
    
    // Filter controls
    type,
    changeType,
    
    // Actions
    refetch,
  };
};

export default useWallet;
