// Transaction Types
export type TransactionType = 'REWARD' | 'WITHDRAWAL' | 'REFUND' | 'ADJUSTMENT';

// Withdrawal Status
export type WithdrawalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED';

// Payout Methods
export type PayoutMethod = 'PAYPAL' | 'UPI' | 'CRYPTO';

// Wallet Balance
export interface WalletBalance {
  balance: number;
  pendingWithdrawals: number;
  availableBalance: number;
}

// Wallet Transaction
export interface WalletTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  status: string;
  description: string | null;
  balanceAfter: number;
  createdAt: string;
}

// Withdrawal
export interface Withdrawal {
  id: string;
  amount: number;
  method: PayoutMethod;
  status: WithdrawalStatus;
  createdAt: string;
}

// Account Details for different payout methods
export interface PayPalAccountDetails {
  email: string;
}

export interface UPIAccountDetails {
  upiId: string;
}

export interface CryptoAccountDetails {
  cryptoAddress: string;
  cryptoNetwork: string; // e.g., "ETH", "BTC"
}

export type AccountDetails = PayPalAccountDetails | UPIAccountDetails | CryptoAccountDetails;

// Request Types
export interface WithdrawalRequest {
  amount: number;
  method: PayoutMethod;
  accountDetails: AccountDetails;
}

export interface TransactionListParams {
  page?: number;
  limit?: number;
  type?: TransactionType;
}

// Response Types
export interface WalletBalanceResponse {
  success: boolean;
  data: WalletBalance;
}

export interface WalletTransactionsResponse {
  success: boolean;
  data: {
    data: WalletTransaction[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface WithdrawalResponse {
  success: boolean;
  data: Withdrawal;
}

// Wallet State for Redux (if needed)
export interface WalletState {
  balance: WalletBalance | null;
  transactions: WalletTransaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  isLoading: boolean;
  error: string | null;
}
