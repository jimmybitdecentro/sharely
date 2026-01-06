# Google Sign-In Web Implementation Guide

This guide explains how to implement Google authentication for web, based on the existing React Native setup.

## Overview

The React Native app uses:
- **Firebase Authentication** for user management
- **Google Sign-In** for OAuth authentication
- **Web Client ID**: `778782615742-lakpqvh70iaciqu9tk0snqv206cuaebt.apps.googleusercontent.com`
- **Firebase Project**: `sharely-5e764`

## Prerequisites

1. Firebase project already configured (same as React Native app)
2. Google OAuth 2.0 Client ID already created in Firebase Console
3. Web application domain authorized in Firebase Console

## Step 1: Install Dependencies

For a React web application, install Firebase SDK:

```bash
npm install firebase
# or
yarn add firebase
```

For vanilla JavaScript or other frameworks, you can also use the CDN:
```html
<script src="https://www.gstatic.com/firebasejs/10.x.x/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.x.x/firebase-auth.js"></script>
```

## Step 2: Firebase Configuration

Create a Firebase configuration file (e.g., `src/config/firebase.ts` or `src/config/firebase.js`):

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your Firebase config from Firebase Console
// Go to Project Settings > General > Your apps > Web app
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "sharely-5e764.firebaseapp.com",
  projectId: "sharely-5e764",
  storageBucket: "sharely-5e764.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  // Web Client ID (OAuth 2.0 Client ID)
  clientId: "778782615742-lakpqvh70iaciqu9tk0snqv206cuaebt.apps.googleusercontent.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account' // Force account selection
});

export default app;
```

**To get your Firebase config:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `sharely-5e764`
3. Go to Project Settings (gear icon)
4. Scroll to "Your apps" section
5. If you don't have a web app, click "Add app" > Web (</> icon)
6. Copy the configuration object

## Step 3: Create Google Auth Service

Create a service file similar to the React Native implementation (e.g., `src/services/auth/googleAuthService.ts`):

```typescript
import { 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { auth, googleProvider } from '../../config/firebase';

export interface FirebaseAuthResult {
  firebaseUid: string;
  firebaseIdToken: string;
  userInfo: {
    name: string | null;
    email: string | null;
    profileImage: string | null;
  };
}

class GoogleAuthService {
  /**
   * Sign in with Google using popup
   * Returns Firebase ID token and user info
   */
  async signIn(): Promise<FirebaseAuthResult> {
    try {
      // Sign in with Google popup
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (!user) {
        throw new Error('Google sign-in failed: No user returned');
      }

      // Get Firebase ID token
      const firebaseIdToken = await user.getIdToken();

      if (!firebaseIdToken) {
        throw new Error('Failed to get Firebase ID token');
      }

      // Extract user info
      const userInfo = {
        name: user.displayName || null,
        email: user.email || null,
        profileImage: user.photoURL || null,
      };

      return {
        firebaseUid: user.uid,
        firebaseIdToken,
        userInfo,
      };
    } catch (error: any) {
      console.error('Google sign-in error:', error);

      // Handle specific error codes
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Google sign-in was cancelled');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup was blocked. Please allow popups for this site.');
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your internet connection.');
      } else {
        const errorMessage = error.message || 'Failed to sign in with Google';
        throw new Error(errorMessage);
      }
    }
  }

  /**
   * Sign in with Google using redirect (alternative to popup)
   * Use this if popups are blocked
   */
  async signInWithRedirect(): Promise<void> {
    try {
      const { signInWithRedirect } = await import('firebase/auth');
      await signInWithRedirect(auth, googleProvider);
    } catch (error: any) {
      console.error('Google sign-in redirect error:', error);
      throw new Error(error.message || 'Failed to initiate Google sign-in');
    }
  }

  /**
   * Handle redirect result (call this after redirect)
   * Use this if you used signInWithRedirect
   */
  async getRedirectResult(): Promise<FirebaseAuthResult | null> {
    try {
      const { getRedirectResult } = await import('firebase/auth');
      const result = await getRedirectResult(auth);
      
      if (!result || !result.user) {
        return null;
      }

      const user = result.user;
      const firebaseIdToken = await user.getIdToken();

      return {
        firebaseUid: user.uid,
        firebaseIdToken,
        userInfo: {
          name: user.displayName || null,
          email: user.email || null,
          profileImage: user.photoURL || null,
        },
      };
    } catch (error: any) {
      console.error('Error getting redirect result:', error);
      throw error;
    }
  }

  /**
   * Check if user is currently signed in
   */
  isSignedIn(): boolean {
    return auth.currentUser !== null;
  }

  /**
   * Get current Firebase user
   */
  getCurrentFirebaseUser(): User | null {
    return auth.currentUser;
  }

  /**
   * Get fresh Firebase ID token
   */
  async getFirebaseIdToken(): Promise<string | null> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return null;
      }
      return await user.getIdToken();
    } catch (error) {
      console.error('Error getting Firebase ID token:', error);
      return null;
    }
  }

  /**
   * Sign out from Google and Firebase
   */
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  /**
   * Listen to auth state changes
   * Useful for maintaining session across page refreshes
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }
}

export const googleAuthService = new GoogleAuthService();
```

## Step 4: Integration with Your App

### React Hook Example

Create a hook similar to your React Native `useAuth` hook:

```typescript
// src/hooks/useAuth.ts
import { useCallback } from 'react';
import { useAppDispatch } from '../store/hooks';
import { googleSignIn } from '../store/slices/authSlice';
import { googleAuthService } from '../services/auth/googleAuthService';
import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = googleAuthService.onAuthStateChanged((user) => {
      setFirebaseUser(user);
    });

    return () => unsubscribe();
  }, []);

  // Sign in with Google
  const handleSignInWithGoogle = useCallback(async () => {
    try {
      const result = await dispatch(googleSignIn()).unwrap();
      return { success: true, data: result };
    } catch (err: any) {
      let errorMessage = 'Failed to sign in with Google';
      
      if (typeof err === 'string') {
        errorMessage = err;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      return { success: false, error: errorMessage };
    }
  }, [dispatch]);

  return {
    firebaseUser,
    handleSignInWithGoogle,
    isSignedIn: googleAuthService.isSignedIn(),
  };
};
```

### Redux Slice Integration

Update your auth slice to use the web Google auth service:

```typescript
// src/store/slices/authSlice.ts
import { googleAuthService } from '../../services/auth/googleAuthService';

// Google Sign-In thunk (same structure as React Native)
export const googleSignIn = createAsyncThunk<
  {user: UserProfile; firebaseIdToken: string},
  void,
  {rejectValue: string}
>('auth/googleSignIn', async (_, {rejectWithValue}) => {
  try {
    // Sign in with Google and Firebase
    const firebaseAuthResult = await googleAuthService.signIn();

    // Store Firebase tokens (use localStorage or your storage service)
    await storageService.setFirebaseIdToken(firebaseAuthResult.firebaseIdToken);
    await storageService.setFirebaseUid(firebaseAuthResult.firebaseUid);

    // Create user profile from Firebase user data
    const user: UserProfile = {
      id: firebaseAuthResult.firebaseUid,
      phoneNumber: null,
      name: firebaseAuthResult.userInfo.name,
      email: firebaseAuthResult.userInfo.email,
      role: 'USER',
      referralCode: '',
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
```

### Component Example

```typescript
// src/components/LoginButton.tsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';

export const LoginButton: React.FC = () => {
  const { handleSignInWithGoogle, isSignedIn } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const result = await handleSignInWithGoogle();
      if (result.success) {
        console.log('Signed in successfully!');
        // Redirect or update UI
      } else {
        console.error('Sign in failed:', result.error);
        // Show error message
      }
    } finally {
      setLoading(false);
    }
  };

  if (isSignedIn) {
    return <div>Already signed in</div>;
  }

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? 'Signing in...' : 'Continue with Google'}
    </button>
  );
};
```

## Step 5: Firebase Console Configuration

### Authorized Domains

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `sharely-5e764`
3. Go to **Authentication** > **Settings** > **Authorized domains**
4. Add your web domain (e.g., `localhost` for development, `yourdomain.com` for production)

### OAuth Consent Screen (if needed)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `sharely-5e764`
3. Go to **APIs & Services** > **OAuth consent screen**
4. Configure:
   - User Type (Internal/External)
   - App name, logo, support email
   - Authorized domains
   - Scopes (email, profile, openid)

## Step 6: Handle Redirect Flow (Optional)

If you prefer redirect over popup (useful when popups are blocked):

```typescript
// In your app initialization or route handler
import { googleAuthService } from './services/auth/googleAuthService';

// Check for redirect result on page load
useEffect(() => {
  const checkRedirectResult = async () => {
    try {
      const result = await googleAuthService.getRedirectResult();
      if (result) {
        // Handle successful sign-in
        console.log('Signed in via redirect:', result);
        // Dispatch to Redux or update state
      }
    } catch (error) {
      console.error('Redirect sign-in error:', error);
    }
  };

  checkRedirectResult();
}, []);
```

## Step 7: Token Refresh

Firebase tokens expire after ~1 hour. Implement automatic token refresh:

```typescript
// In your app initialization
useEffect(() => {
  const refreshToken = async () => {
    const token = await googleAuthService.getFirebaseIdToken(true); // Force refresh
    if (token) {
      // Update token in your storage/state
      await storageService.setFirebaseIdToken(token);
    }
  };

  // Refresh token every 50 minutes
  const interval = setInterval(refreshToken, 50 * 60 * 1000);

  return () => clearInterval(interval);
}, []);
```

## Common Issues and Solutions

### 1. Popup Blocked
**Error**: `auth/popup-blocked`
**Solution**: Use `signInWithRedirect()` instead of popup, or prompt user to allow popups

### 2. Domain Not Authorized
**Error**: `auth/unauthorized-domain`
**Solution**: Add your domain to Firebase Console > Authentication > Settings > Authorized domains

### 3. OAuth Client Not Configured
**Error**: `auth/configuration-not-found`
**Solution**: Ensure web client ID is correctly set in Firebase config and matches Firebase Console

### 4. CORS Issues
**Error**: CORS errors in browser console
**Solution**: 
- Ensure Firebase config is correct
- Check authorized domains in Firebase Console
- Verify OAuth consent screen is configured

### 5. Token Expiration
**Issue**: User gets logged out after 1 hour
**Solution**: Implement token refresh mechanism (see Step 7)

## Testing Checklist

- [ ] Firebase config is correct
- [ ] Web client ID matches Firebase Console
- [ ] Domain is authorized in Firebase Console
- [ ] OAuth consent screen is configured
- [ ] Popup sign-in works
- [ ] Redirect sign-in works (if implemented)
- [ ] Sign-out works
- [ ] Auth state persists on page refresh
- [ ] Token refresh works
- [ ] Error handling works for all error cases

## Differences from React Native

| Feature | React Native | Web |
|---------|-------------|-----|
| Library | `@react-native-google-signin/google-signin` | `firebase/auth` |
| Sign-in Method | `GoogleSignin.signIn()` | `signInWithPopup()` or `signInWithRedirect()` |
| Configuration | `GoogleSignin.configure()` | Firebase config object |
| Token Refresh | Automatic via Firebase SDK | Manual or via `getIdToken(true)` |
| Platform-specific | SHA-1 fingerprint required | Authorized domains required |

## Additional Resources

- [Firebase Auth Web Documentation](https://firebase.google.com/docs/auth/web/start)
- [Google Sign-In with Firebase](https://firebase.google.com/docs/auth/web/google-signin)
- [Firebase Console](https://console.firebase.google.com/)
- [Google Cloud Console](https://console.cloud.google.com/)

## Notes

- The same Firebase project (`sharely-5e764`) and web client ID are used for both React Native and web
- Firebase tokens can be shared between platforms if your backend accepts them
- Consider implementing token refresh to maintain user sessions
- Use popup for better UX, but have redirect as fallback for blocked popups

