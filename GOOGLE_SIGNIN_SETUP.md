# Google Sign-In Setup Instructions

## Issue: Unable to redirect after selecting email

This issue occurs when the SHA-1 fingerprint is not properly configured in Firebase Console.

## Steps to Fix:

### 1. Get Your SHA-1 Fingerprint

Run this command in the android directory:
```bash
cd android
./gradlew signingReport
```

Look for the SHA-1 fingerprint under "V1 signing" for debug keystore.

Or get it directly:
```bash
keytool -list -v -keystore app/debug.keystore -alias androiddebugkey -storepass android -keypass android | grep SHA1
```

### 2. Add SHA-1 to Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `sharely-5e764`
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. Find your Android app (package: `com.share`)
6. Click "Add fingerprint"
7. Add the SHA-1 fingerprint from step 1
8. Download the updated `google-services.json`
9. Replace `android/app/google-services.json` with the new file

### 3. For Release Builds

If you're building a release APK, you also need to add the release keystore SHA-1:

```bash
keytool -list -v -keystore app/sharely-release-key.keystore -alias <your-alias> -storepass <your-password> -keypass <your-password> | grep SHA1
```

Add this SHA-1 to Firebase Console as well.

### 4. Rebuild the App

After updating `google-services.json`:
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

## Current SHA-1 Fingerprints Found:

- Debug: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`
- Release (if configured): Check with your release keystore

## Verify Configuration

The web client ID in use: `778782615742-lakpqvh70iaciqu9tk0snqv206cuaebt.apps.googleusercontent.com`

Make sure this matches the OAuth 2.0 Client ID (Web application) in Firebase Console.

## Common Issues:

1. **"DEVELOPER_ERROR" or Error 10**: SHA-1 not added to Firebase
2. **"NETWORK_ERROR"**: Check internet connection
3. **"SIGN_IN_CANCELLED"**: User cancelled the sign-in
4. **Redirect not working**: SHA-1 mismatch or OAuth client not configured

## Testing:

After adding SHA-1 and rebuilding:
1. Click "Continue with Google"
2. Select your Google account
3. Grant permissions
4. Should redirect back to app automatically
5. User should be logged in

