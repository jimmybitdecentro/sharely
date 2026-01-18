import auth from '@react-native-firebase/auth';
import firebaseApp from '@react-native-firebase/app';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

// Web client ID from Firebase Console (client_type 3)
const WEB_CLIENT_ID = '195104490042-hpn88c7afqvm2iovpvu7a9p0bnaoo01t.apps.googleusercontent.com';

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
  private isInitialized = false;

  /**
   * Initialize Firebase App and Google Sign-In
   * Should be called once when app starts
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Ensure Firebase App is initialized (auto-initializes from google-services.json)
      // But we check if it's ready
      if (!firebaseApp.apps.length) {
        // Firebase should auto-initialize, but if not, this will help
        console.warn('Firebase App not initialized. Make sure google-services.json is properly configured.');
      }

      // Initialize Google Sign-In with proper configuration
      await GoogleSignin.configure({
        webClientId: WEB_CLIENT_ID,
        offlineAccess: true,
        forceCodeForRefreshToken: false,
      });
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing Google Sign-In:', error);
      throw error;
    }
  }

  /**
   * Check if user is already signed in to Google
   */
  async isSignedIn(): Promise<boolean> {
    try {
      return await GoogleSignin.isSignedIn();
    } catch (error) {
      console.error('Error checking Google sign-in status:', error);
      return false;
    }
  }

  /**
   * Sign in with Google and Firebase
   * Returns Firebase ID token and user info (no backend call)
   */
  async signIn(): Promise<FirebaseAuthResult> {
    try {
      // Ensure Google Sign-In is initialized
      console.log('[GoogleAuthService] Initializing...');
      await this.initialize();

      // Check if user is already signed in
      console.log('[GoogleAuthService] Checking if already signed in...');
      const isSignedIn = await this.isSignedIn();
      console.log('[GoogleAuthService] isSignedIn:', isSignedIn);
      if (isSignedIn) {
        // Get current user info
        console.log('[GoogleAuthService] Getting current user...');
        const currentUser = await GoogleSignin.getCurrentUser();
        console.log('[GoogleAuthService] currentUser:', !!currentUser);
        if (currentUser) {
          return await this.getAuthResultFromGoogleUser(currentUser);
        }
      }

      // Sign in with Google
      console.log('[GoogleAuthService] Checking Play Services...');
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // Sign in with Google - this will open the account picker
      // After user selects account, it should automatically redirect back to the app
      // If redirect fails, check SHA-1 fingerprint in Firebase Console
      // Sign in with Google - this will open the account picker
      // After user selects account, it should automatically redirect back to the app
      // If redirect fails, check SHA-1 fingerprint in Firebase Console
      console.log('[GoogleAuthService] Starting Google Sign-In...');
      const googleUser = await GoogleSignin.signIn();
      console.log('[GoogleAuthService] Google Sign-In response received:', JSON.stringify(googleUser, null, 2));

      if (!googleUser || !googleUser.data) {
        console.error('[GoogleAuthService] No user data returned from Google Sign-In');
        throw new Error('Google sign-in failed: No user data returned. Please ensure SHA-1 fingerprint is added to Firebase Console.');
      }

      // Verify we have the ID token
      if (!googleUser.data.idToken) {
        console.error('[GoogleAuthService] No ID token received from Google Sign-In');
        throw new Error('Google sign-in failed: No ID token received. This usually means SHA-1 fingerprint is missing in Firebase Console.');
      }

      console.log('[GoogleAuthService] Creating Firebase credential...');
      // Create Firebase credential from Google token
      const googleCredential = auth.GoogleAuthProvider.credential(
        googleUser.data.idToken,
      );

      if (!googleCredential) {
        console.error('[GoogleAuthService] Failed to create Firebase credential');
        throw new Error('Failed to create Firebase credential');
      }

      console.log('[GoogleAuthService] Signing in to Firebase...');
      // Sign in to Firebase with Google credential
      const firebaseUserCredential = await auth().signInWithCredential(
        googleCredential,
      );

      if (!firebaseUserCredential.user) {
        console.error('[GoogleAuthService] Firebase sign-in failed: No user returned');
        throw new Error('Firebase sign-in failed: No user returned');
      }

      console.log('[GoogleAuthService] Firebase sign-in successful, UID:', firebaseUserCredential.user.uid);

      // Get Firebase ID token
      const firebaseIdToken = await firebaseUserCredential.user.getIdToken();

      if (!firebaseIdToken) {
        console.error('[GoogleAuthService] Failed to get Firebase ID token');
        throw new Error('Failed to get Firebase ID token');
      }

      console.log('[GoogleAuthService] Firebase ID token retrieved');

      // Get user info from Firebase user
      const firebaseUser = firebaseUserCredential.user;
      const userInfo = {
        name: firebaseUser.displayName || null,
        email: firebaseUser.email || null,
        profileImage: firebaseUser.photoURL || null,
      };

      return {
        firebaseUid: firebaseUser.uid,
        firebaseIdToken,
        userInfo,
      };
    } catch (error: any) {
      console.error('Google sign-in error details:', {
        code: error.code,
        message: error.message,
        error: error,
      });

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new Error('Google sign-in was cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        throw new Error('Google sign-in is already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error('Google Play Services not available. Please update Google Play Services.');
      } else if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        throw new Error('Please sign in to your Google account');
      } else {
        const errorMessage = error.message || 'Failed to sign in with Google';
        console.error('Google sign-in error:', errorMessage);
        throw new Error(errorMessage);
      }
    }
  }

  /**
   * Get auth result from already signed-in Google user
   */
  private async getAuthResultFromGoogleUser(
    googleUser: any,
  ): Promise<FirebaseAuthResult> {
    try {
      // Get Firebase user (should already be signed in)
      const firebaseUser = auth().currentUser;
      if (!firebaseUser) {
        // If not signed in to Firebase, sign in with Google credential
        const googleCredential = auth.GoogleAuthProvider.credential(
          googleUser.idToken,
        );
        const firebaseUserCredential = await auth().signInWithCredential(
          googleCredential,
        );
        const firebaseIdToken = await firebaseUserCredential.user.getIdToken();

        return {
          firebaseUid: firebaseUserCredential.user.uid,
          firebaseIdToken,
          userInfo: {
            name: firebaseUserCredential.user.displayName || null,
            email: firebaseUserCredential.user.email || null,
            profileImage: firebaseUserCredential.user.photoURL || null,
          },
        };
      }

      const firebaseIdToken = await firebaseUser.getIdToken();

      return {
        firebaseUid: firebaseUser.uid,
        firebaseIdToken,
        userInfo: {
          name: firebaseUser.displayName || null,
          email: firebaseUser.email || null,
          profileImage: firebaseUser.photoURL || null,
        },
      };
    } catch (error) {
      console.error('Error getting auth result from Google user:', error);
      throw error;
    }
  }

  /**
   * Sign out from Google and Firebase
   */
  async signOut(): Promise<void> {
    try {
      // Sign out from Google
      if (await this.isSignedIn()) {
        await GoogleSignin.signOut();
      }

      // Sign out from Firebase
      await auth().signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  /**
   * Get current Firebase user
   */
  getCurrentFirebaseUser() {
    return auth().currentUser;
  }

  /**
   * Get fresh Firebase ID token
   */
  async getFirebaseIdToken(): Promise<string | null> {
    try {
      const firebaseUser = auth().currentUser;
      if (!firebaseUser) {
        return null;
      }
      return await firebaseUser.getIdToken();
    } catch (error) {
      console.error('Error getting Firebase ID token:', error);
      return null;
    }
  }
}

export const googleAuthService = new GoogleAuthService();

