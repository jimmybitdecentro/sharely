// Theme Types
export type ThemeMode = 'light' | 'dark';
export type Language = 'en' | 'hi' | 'es';

// Re-export all API types
export * from './api.types';
export * from './auth.types';
export * from './campaign.types';
export * from './wallet.types';
export * from './referral.types';
export * from './location.types';

// Legacy User type (keeping for backward compatibility)
export interface User {
  id: string;
  name: string | null;
  email: string | null;
  phone?: string;
  phoneNumber?: string | null;
  dateOfBirth?: string;
  gender?: string;
  country?: string;
  city?: string;
  profilePicture?: string;
  occupation?: string;
  interests?: string;
  age?: string;
  role?: string;
  referralCode?: string;
}

// Legacy AuthState (keeping for backward compatibility, use AuthState from auth.types for new code)
export interface LegacyAuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
}
