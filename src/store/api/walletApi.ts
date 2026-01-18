import {baseApi} from './baseApi';
import {API_ENDPOINTS} from '../../services/api/endpoints';
import {
  WalletBalance,
  WalletTransaction,
  TransactionListParams,
  WithdrawalRequest,
  Withdrawal,
} from '../../types/wallet.types';
import {Pagination} from '../../types/api.types';

// Response types for RTK Query
interface WalletBalanceApiResponse {
  success: boolean;
  data: WalletBalance;
}

interface TransactionsApiResponse {
  success: boolean;
  data: {
    data: WalletTransaction[];
    pagination: Pagination;
  };
}

interface WithdrawalApiResponse {
  success: boolean;
  data: Withdrawal;
}

export const walletApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get wallet balance
    getWalletBalance: builder.query<WalletBalance, void>({
      query: () => API_ENDPOINTS.WALLET.BALANCE,
      transformResponse: (response: WalletBalanceApiResponse) => response.data,
      providesTags: ['WalletBalance'],
    }),

    // Get transactions
    getTransactions: builder.query<
      {transactions: WalletTransaction[]; pagination: Pagination},
      TransactionListParams | void
    >({
      query: (params) => ({
        url: API_ENDPOINTS.WALLET.TRANSACTIONS,
        params: params || {},
      }),
      transformResponse: (response: TransactionsApiResponse) => ({
        transactions: response.data.data,
        pagination: response.data.pagination,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.transactions.map(({id}) => ({
                type: 'Transactions' as const,
                id,
              })),
              {type: 'Transactions', id: 'LIST'},
            ]
          : [{type: 'Transactions', id: 'LIST'}],
    }),

    // Create withdrawal
    createWithdrawal: builder.mutation<Withdrawal, WithdrawalRequest>({
      query: (data) => ({
        url: API_ENDPOINTS.WALLET.WITHDRAW,
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: WithdrawalApiResponse) => response.data,
      invalidatesTags: ['WalletBalance', {type: 'Transactions', id: 'LIST'}],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetWalletBalanceQuery,
  useGetTransactionsQuery,
  useCreateWithdrawalMutation,
} = walletApi;
