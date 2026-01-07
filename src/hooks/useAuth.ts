import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  sendOTP,
  verifyOTP,
  googleSignIn,
  fetchProfile,
  updateProfile,
  restoreSession,
  logoutAsync,
  clearError,
} from '../store/slices/authSlice';
import { showSuccessToast, showErrorToast } from '../store/slices/uiSlice';
import { SendOTPRequest, VerifyOTPRequest, UpdateProfileRequest } from '../types/auth.types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, isLoading, error, accessToken, isOtpLoading, isGoogleLoading } = useAppSelector(
    (state) => state.auth,
  );

  // Send OTP
  const handleSendOTP = useCallback(
    async (data: SendOTPRequest) => {
      try {
        await dispatch(sendOTP(data)).unwrap();
        dispatch(showSuccessToast({ title: 'OTP Sent', message: 'Check your email for the verification code' }));
        return { success: true };
      } catch (err) {
        const errorMessage = typeof err === 'string' ? err : 'Failed to send OTP';
        dispatch(showErrorToast({ title: 'Error', message: errorMessage }));
        return { success: false, error: errorMessage };
      }
    },
    [dispatch],
  );

  // Verify OTP
  const handleVerifyOTP = useCallback(
    async (data: VerifyOTPRequest) => {
      try {
        const result = await dispatch(verifyOTP(data)).unwrap();
        dispatch(showSuccessToast({ title: 'Success', message: 'Welcome to Sharely!' }));
        return { success: true, data: result };
      } catch (err) {
        const errorMessage = typeof err === 'string' ? err : 'Failed to verify OTP';
        dispatch(showErrorToast({ title: 'Error', message: errorMessage }));
        return { success: false, error: errorMessage };
      }
    },
    [dispatch],
  );

  // Sign in with Google
  const handleSignInWithGoogle = useCallback(
    async () => {
      try {
        const result = await dispatch(googleSignIn()).unwrap();
        dispatch(showSuccessToast({ title: 'Success', message: 'Welcome to Sharely!' }));
        return { success: true, data: result };
      } catch (err: any) {
        let errorMessage = 'Failed to sign in with Google';

        if (typeof err === 'string') {
          errorMessage = err;
        } else if (err?.message) {
          errorMessage = err.message;
        }

        // Provide more helpful error messages
        if (errorMessage.includes('cancelled')) {
          errorMessage = 'Sign-in was cancelled';
        } else if (errorMessage.includes('PLAY_SERVICES')) {
          errorMessage = 'Google Play Services not available. Please update Google Play Services.';
        } else if (errorMessage.includes('network') || errorMessage.includes('NETWORK')) {
          errorMessage = 'Network error. Please check your internet connection.';
        } else if (errorMessage.includes('10') || errorMessage.includes('DEVELOPER_ERROR')) {
          errorMessage = 'Configuration error. Please ensure SHA-1 fingerprint is added to Firebase Console.';
        }

        console.error('Google sign-in error:', err);
        dispatch(showErrorToast({ title: 'Sign-In Error', message: errorMessage }));
        return { success: false, error: errorMessage };
      }
    },
    [dispatch],
  );

  // Fetch profile
  const handleFetchProfile = useCallback(async () => {
    try {
      const result = await dispatch(fetchProfile()).unwrap();
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : 'Failed to fetch profile';
      return { success: false, error: errorMessage };
    }
  }, [dispatch]);

  // Update profile
  const handleUpdateProfile = useCallback(
    async (data: UpdateProfileRequest) => {
      try {
        const result = await dispatch(updateProfile(data)).unwrap();
        dispatch(showSuccessToast({ title: 'Success', message: 'Profile updated successfully' }));
        return { success: true, data: result };
      } catch (err) {
        const errorMessage = typeof err === 'string' ? err : 'Failed to update profile';
        dispatch(showErrorToast({ title: 'Error', message: errorMessage }));
        return { success: false, error: errorMessage };
      }
    },
    [dispatch],
  );

  // Restore session (on app start)
  const handleRestoreSession = useCallback(async () => {
    try {
      const result = await dispatch(restoreSession()).unwrap();
      return { success: true, data: result };
    } catch (err) {
      return { success: false, error: 'Failed to restore session' };
    }
  }, [dispatch]);

  // Logout
  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logoutAsync()).unwrap();
      dispatch(showSuccessToast({ title: 'Logged Out', message: 'You have been logged out successfully' }));
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to logout' };
    }
  }, [dispatch]);

  // Clear error
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    isAuthenticated,
    user,
    isLoading,
    isOtpLoading,
    isGoogleLoading,
    error,
    accessToken,

    // Actions
    sendOTP: handleSendOTP,
    verifyOTP: handleVerifyOTP,
    signInWithGoogle: handleSignInWithGoogle,
    fetchProfile: handleFetchProfile,
    updateProfile: handleUpdateProfile,
    restoreSession: handleRestoreSession,
    logout: handleLogout,
    clearError: handleClearError,
  };
};

export default useAuth;
