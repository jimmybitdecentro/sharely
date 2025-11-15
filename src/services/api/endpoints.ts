export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGIN_SOCIAL: '/auth/login/social',
  SIGNUP: '/auth/signup',
  FORGOT_PASSWORD: '/auth/forgot-password',
  REFRESH_TOKEN: '/auth/refresh-token',
  LOGOUT: '/auth/logout',

  // User
  USER_PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  CHANGE_PASSWORD: '/user/change-password',

  // Campaigns/Links
  CAMPAIGNS: '/campaigns',
  CAMPAIGN_DETAIL: (id: string) => `/campaigns/${id}`,
  MY_LINKS: '/user/links',
  SHARE_CAMPAIGN: (id: string) => `/campaigns/${id}/share`,

  // Earnings
  EARNINGS: '/user/earnings',
  EARNINGS_STATS: '/user/earnings/stats',
  WITHDRAW: '/user/withdraw',
  TRANSACTION_HISTORY: '/user/transactions',

  // Orders
  MY_ORDERS: '/user/orders',
  ORDER_DETAIL: (id: string) => `/user/orders/${id}`,

  // Notifications
  NOTIFICATIONS: '/user/notifications',
  NOTIFICATION_SETTINGS: '/user/notification-settings',
  UPDATE_NOTIFICATION_SETTINGS: '/user/notification-settings',
} as const;

