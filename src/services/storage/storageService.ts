import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from './storageKeys';
import {TokenData, UserProfile} from '../../types';

class StorageService {
  // Generic storage methods
  async setItem(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error saving to storage:', error);
      throw error;
    }
  }

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? (JSON.parse(jsonValue) as T) : null;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from storage:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  // Auth token methods
  async setAuthToken(token: string): Promise<void> {
    return this.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  async getAuthToken(): Promise<string | null> {
    return this.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
  }

  async removeAuthToken(): Promise<void> {
    return this.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  // Refresh token methods
  async setRefreshToken(token: string): Promise<void> {
    return this.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  async getRefreshToken(): Promise<string | null> {
    return this.getItem<string>(STORAGE_KEYS.REFRESH_TOKEN);
  }

  async removeRefreshToken(): Promise<void> {
    return this.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  // Token expiry methods
  async setTokenExpiresAt(expiresAt: number): Promise<void> {
    return this.setItem(STORAGE_KEYS.TOKEN_EXPIRES_AT, expiresAt);
  }

  async getTokenExpiresAt(): Promise<number | null> {
    return this.getItem<number>(STORAGE_KEYS.TOKEN_EXPIRES_AT);
  }

  async removeTokenExpiresAt(): Promise<void> {
    return this.removeItem(STORAGE_KEYS.TOKEN_EXPIRES_AT);
  }

  // Combined token methods
  async setTokens(tokenData: TokenData): Promise<void> {
    const expiresAt = Date.now() + tokenData.expiresIn * 1000;
    await Promise.all([
      this.setAuthToken(tokenData.accessToken),
      this.setRefreshToken(tokenData.refreshToken),
      this.setTokenExpiresAt(expiresAt),
    ]);
  }

  async getTokens(): Promise<{
    accessToken: string | null;
    refreshToken: string | null;
    expiresAt: number | null;
  }> {
    const [accessToken, refreshToken, expiresAt] = await Promise.all([
      this.getAuthToken(),
      this.getRefreshToken(),
      this.getTokenExpiresAt(),
    ]);
    return {accessToken, refreshToken, expiresAt};
  }

  async clearTokens(): Promise<void> {
    await Promise.all([
      this.removeAuthToken(),
      this.removeRefreshToken(),
      this.removeTokenExpiresAt(),
    ]);
  }

  async isTokenExpired(): Promise<boolean> {
    const expiresAt = await this.getTokenExpiresAt();
    if (!expiresAt) return true;
    // Consider token expired 30 seconds before actual expiry
    return Date.now() >= expiresAt - 30000;
  }

  // User data methods
  async setUserData(user: UserProfile): Promise<void> {
    return this.setItem(STORAGE_KEYS.USER_DATA, user);
  }

  async getUserData(): Promise<UserProfile | null> {
    return this.getItem<UserProfile>(STORAGE_KEYS.USER_DATA);
  }

  async removeUserData(): Promise<void> {
    return this.removeItem(STORAGE_KEYS.USER_DATA);
  }

  // Theme methods
  async setTheme(theme: string): Promise<void> {
    return this.setItem(STORAGE_KEYS.THEME, theme);
  }

  async getTheme(): Promise<string | null> {
    return this.getItem<string>(STORAGE_KEYS.THEME);
  }

  // Language methods
  async setLanguage(language: string): Promise<void> {
    return this.setItem(STORAGE_KEYS.LANGUAGE, language);
  }

  async getLanguage(): Promise<string | null> {
    return this.getItem<string>(STORAGE_KEYS.LANGUAGE);
  }

  // Onboarding methods
  async setHasSeenOnboarding(value: boolean): Promise<void> {
    return this.setItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING, value);
  }

  async getHasSeenOnboarding(): Promise<boolean> {
    const value = await this.getItem<boolean>(STORAGE_KEYS.HAS_SEEN_ONBOARDING);
    return value ?? false;
  }

  // Clear all auth data (for logout)
  async clearAuthData(): Promise<void> {
    await Promise.all([
      this.clearTokens(),
      this.removeUserData(),
    ]);
  }
}

export const storageService = new StorageService();
