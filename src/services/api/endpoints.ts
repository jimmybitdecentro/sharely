export const API_ENDPOINTS = {
  // Health Check
  HEALTH: '/health',

  // Authentication
  AUTH: {
    SEND_OTP: '/auth/sendotp',
    VERIFY_OTP: '/auth/verifyotp',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },

  // Campaigns
  CAMPAIGN: {
    LIST: '/campaign/list',
    DETAIL: (id: string) => `/campaign/${id}`,
  },

  // Share Links
  SHARE: {
    GENERATE: (campaignId: string) => `/share/generate/${campaignId}`,
  },

  // Tracking (redirect endpoint)
  TRACKING: {
    REDIRECT: (shortCode: string) => `/t/${shortCode}`,
  },

  // Wallet
  WALLET: {
    BALANCE: '/wallet/balance',
    TRANSACTIONS: '/wallet/transactions',
    WITHDRAW: '/wallet/withdraw',
  },

  // Referrals
  REFERRAL: {
    APPLY: '/referral/apply',
    INFO: '/referral/info',
  },

  // Countries & Cities
  LOCATION: {
    COUNTRIES: '/countries',
    CITIES: '/cities',
  },

  // User Profile
  USER: {
    PROFILE: '/users/profile',
  },

  // Publishers
  PUBLISHER: {
    ADVERTISEMENTS: '/publishers/advertisements',
    ADVERTISEMENT_DETAIL: (id: string) => `/publishers/advertisements/${id}`,
    CREATE_LINK: (id: string) => `/publishers/advertisements/${id}/create_link`,
    MY_LINKS: '/publishers/my-links',
  },
} as const;

// Type for endpoint strings (for type safety)
export type EndpointKey = keyof typeof API_ENDPOINTS;
