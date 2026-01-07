// User Roles
export type UserRole = 'USER' | 'SUPER_ADMIN' | 'FINANCE_ADMIN';

// Gender
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

// User Profile
export interface UserProfile {
  id: string;
  phoneNumber: string | null;
  name: string | null;
  email: string | null;
  role: UserRole;
  referralCode: string;
  firebaseUid?: string | null;
  profileImage?: string | null;
}

// Extended User Profile (with additional fields)
export interface ExtendedUserProfile extends UserProfile {
  age?: number | null;
  gender?: Gender | null;
  countryId?: string | null;
  cityId?: string | null;
  updatedAt?: string;
}

// Auth Request Types
export interface SendOTPRequest {
  email: string;
}

export interface VerifyOTPRequest {
  type?: 'email' | 'google';
  email?: string;
  otp?: string;
  idToken?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

export interface CreateUserProfileRequest {
  name?: string;
  age?: number;
  gender?: Gender;
  countryId?: string;
  cityId?: string;
}

// Auth Response Types
export interface VerifyOTPResponse {
  access_token: string;
  expires_in: number; // 900 seconds (15 minutes)
  refresh_expires_in: number; // 604800 seconds (7 days)
  refresh_token: string;
  token_type: 'Bearer';
  id_token: string;
  'not-before-policy': number;
  session_state: string;
  scope: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface GetProfileResponse {
  success: boolean;
  data: UserProfile;
}

export interface UpdateProfileResponse {
  success: boolean;
  data: UserProfile;
}

export interface CreateUserProfileResponse {
  success: boolean;
  data: ExtendedUserProfile;
}

// Auth State for Redux
export interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiresAt: number | null;
  user: UserProfile | null;
  isLoading: boolean;
  isOtpLoading: boolean;
  isGoogleLoading: boolean;
  error: string | null;
}

// Token Data for Storage
export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
}

// Firebase Auth Result (no backend)
export interface FirebaseAuthResult {
  firebaseUid: string;
  firebaseIdToken: string;
  googleIdToken?: string;
  userInfo: {
    name: string | null;
    email: string | null;
    profileImage: string | null;
  };
}
