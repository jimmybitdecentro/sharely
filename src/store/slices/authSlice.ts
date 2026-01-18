import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../../services/api/apiService';
import { storageService } from '../../services/storage/storageService';
import { getErrorMessage } from '../../services/api/errorHandler';
import { googleAuthService } from '../../services/auth/googleAuthService';
import {
  AuthState,
  UserProfile,
  SendOTPRequest,
  VerifyOTPRequest,
  VerifyOTPResponse,
  UpdateProfileRequest,
} from '../../types/auth.types';

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  tokenExpiresAt: null,
  user: null,
  isLoading: false,
  error: null,
};

// Async Thunks

// Send OTP
export const sendOTP = createAsyncThunk<
  void,
  SendOTPRequest,
  { rejectValue: string }
>('auth/sendOTP', async (data, { rejectWithValue }) => {
  try {
    await apiService.sendOTP(data);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

// Verify OTP
export const verifyOTP = createAsyncThunk<
  { tokens: VerifyOTPResponse; user: UserProfile },
  VerifyOTPRequest,
  { rejectValue: string }
>('auth/verifyOTP', async (data, { rejectWithValue }) => {
  try {
    // Verify OTP and get tokens
    const tokens = await apiService.verifyOTP(data);

    // Store tokens
    await storageService.setTokens({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresIn: tokens.expires_in,
      refreshExpiresIn: tokens.refresh_expires_in,
    });

    // Fetch user profile
    const profileResponse = await apiService.getAuthProfile();
    const user = profileResponse.data;

    // Store user data
    await storageService.setUserData(user);

    return { tokens, user };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

// Fetch profile
export const fetchProfile = createAsyncThunk<
  UserProfile,
  void,
  { rejectValue: string }
>('auth/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await apiService.getAuthProfile();
    await storageService.setUserData(response.data);
    return response.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

// Update profile
export const updateProfile = createAsyncThunk<
  UserProfile,
  UpdateProfileRequest,
  { rejectValue: string }
>('auth/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const response = await apiService.updateAuthProfile(data);
    await storageService.setUserData(response.data);
    return response.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

// Google Sign-In (no backend)
export const googleSignIn = createAsyncThunk<
  { user: UserProfile; firebaseIdToken: string },
  void,
  { rejectValue: string }
>('auth/googleSignIn', async (_, { rejectWithValue }) => {
  try {
    // Sign in with Google and Firebase
    const firebaseAuthResult = await googleAuthService.signIn();

    console.log('firebaseAuthResult', firebaseAuthResult);
    // Store Firebase tokens
    await storageService.setFirebaseIdToken(firebaseAuthResult.firebaseIdToken);
    await storageService.setFirebaseUid(firebaseAuthResult.firebaseUid);

    // Create user profile from Firebase user data
    const user: UserProfile = {
      id: firebaseAuthResult.firebaseUid,
      phoneNumber: null,
      name: firebaseAuthResult.userInfo.name,
      email: firebaseAuthResult.userInfo.email,
      role: 'USER',
      referralCode: '', // Generate or leave empty
      firebaseUid: firebaseAuthResult.firebaseUid,
      profileImage: firebaseAuthResult.userInfo.profileImage,
    };

    // Store user data
    await storageService.setUserData(user);

    return {
      user,
      firebaseIdToken: firebaseAuthResult.firebaseIdToken,
    };
  } catch (error) {
    // Sign out from Google/Firebase on error
    try {
      await googleAuthService.signOut();
    } catch (signOutError) {
      console.error('Error signing out after failed Google auth:', signOutError);
    }
    return rejectWithValue(getErrorMessage(error));
  }
});

// Restore session (check for existing tokens on app start)
export const restoreSession = createAsyncThunk<
  { user: UserProfile; accessToken: string; refreshToken: string; expiresAt: number } | null,
  void,
  { rejectValue: string }
>('auth/restoreSession', async (_, { rejectWithValue }) => {
  try {
    // First check Firebase auth state
    const firebaseUser = googleAuthService.getCurrentFirebaseUser();
    if (firebaseUser) {
      // User is signed in to Firebase, get fresh token
      const firebaseIdToken = await googleAuthService.getFirebaseIdToken();
      if (firebaseIdToken) {
        const storedUser = await storageService.getUserData();
        if (storedUser) {
          // Refresh Firebase token
          await storageService.setFirebaseIdToken(firebaseIdToken);
          return {
            user: storedUser,
            accessToken: firebaseIdToken, // Use Firebase token as access token
            refreshToken: '', // No refresh token for Firebase
            expiresAt: Date.now() + 3600 * 1000, // Firebase tokens last ~1 hour
          };
        }
      }
    }

    // Fallback to backend tokens if available
    const tokens = await storageService.getTokens();

    if (!tokens.accessToken || !tokens.refreshToken) {
      return null;
    }

    // Check if token is expired
    const isExpired = await storageService.isTokenExpired();

    if (isExpired) {
      // Token expired, clear auth data
      await storageService.clearAuthData();
      return null;
    }

    // Try to fetch user profile to validate token
    try {
      const response = await apiService.getAuthProfile();
      return {
        user: response.data,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: tokens.expiresAt || Date.now() + 900 * 1000,
      };
    } catch {
      // Token invalid, clear auth data
      await storageService.clearAuthData();
      return null;
    }
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

// Logout
export const logoutAsync = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logoutAsync',
  async (_, { rejectWithValue }) => {
    try {
      // Sign out from Google/Firebase
      try {
        await googleAuthService.signOut();
      } catch (error) {
        console.warn('Error signing out from Google:', error);
        // Continue with clearing local data even if Google sign-out fails
      }

      // Clear all auth data
      await storageService.clearAuthData();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set tokens (used by RTK Query baseApi for token refresh)
    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.tokenExpiresAt = Date.now() + 900 * 1000; // 15 minutes
    },

    // Update user data
    updateUser: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    // Logout (sync action)
    logout: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.tokenExpiresAt = null;
      state.user = null;
      state.error = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Set credentials (for backward compatibility)
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: any }>,
    ) => {
      state.isAuthenticated = true;
      state.accessToken = action.payload.token;
      state.user = action.payload.user;
    },
  },
  extraReducers: (builder) => {
    // Send OTP
    builder
      .addCase(sendOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendOTP.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to send OTP';
      });

    // Verify OTP
    builder
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload.tokens.access_token;
        state.refreshToken = action.payload.tokens.refresh_token;
        state.tokenExpiresAt = Date.now() + action.payload.tokens.expires_in * 1000;
        state.user = action.payload.user;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to verify OTP';
      });

    // Fetch Profile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch profile';
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update profile';
      });

    // Restore Session
    builder
      .addCase(restoreSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.isAuthenticated = true;
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          state.tokenExpiresAt = action.payload.expiresAt;
          state.user = action.payload.user;
        }
      })
      .addCase(restoreSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to restore session';
      });

    // Google Sign-In
    builder
      .addCase(googleSignIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleSignIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload.firebaseIdToken; // Use Firebase token as access token
        state.refreshToken = null; // No refresh token for Firebase
        state.tokenExpiresAt = Date.now() + 3600 * 1000; // Firebase tokens last ~1 hour
        state.user = action.payload.user;
      })
      .addCase(googleSignIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to sign in with Google';
      });

    // Logout Async
    builder
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.tokenExpiresAt = null;
        state.user = null;
        state.error = null;
      });
  },
});

export const { setTokens, updateUser, logout, clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;
