export const STORAGE_KEYS = {
  // Auth tokens
  AUTH_TOKEN: '@sharely:auth_token',
  REFRESH_TOKEN: '@sharely:refresh_token',
  TOKEN_EXPIRES_AT: '@sharely:token_expires_at',
  
  // User data
  USER_DATA: '@sharely:user_data',
  
  // App preferences
  THEME: '@sharely:theme',
  LANGUAGE: '@sharely:language',
  
  // Onboarding
  HAS_SEEN_ONBOARDING: '@sharely:has_seen_onboarding',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
