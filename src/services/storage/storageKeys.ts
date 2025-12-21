export const STORAGE_KEYS = {
  // Auth tokens
  AUTH_TOKEN: '@sharely:auth_token',
  REFRESH_TOKEN: '@sharely:refresh_token',
  TOKEN_EXPIRES_AT: '@sharely:token_expires_at',
  
  // Firebase auth
  FIREBASE_ID_TOKEN: '@sharely:firebase_id_token',
  FIREBASE_UID: '@sharely:firebase_uid',
  
  // User data
  USER_DATA: '@sharely:user_data',
  
  // App preferences
  THEME: '@sharely:theme',
  LANGUAGE: '@sharely:language',
  
  // Onboarding
  HAS_SEEN_ONBOARDING: '@sharely:has_seen_onboarding',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
