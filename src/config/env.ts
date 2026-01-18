export const config = {
  API_BASE_URL: process.env.API_BASE_URL || 'https://api-sharely.bitopayments.com',
  API_TIMEOUT: parseInt(process.env.API_TIMEOUT || '30000', 10),
  APP_VERSION: process.env.APP_VERSION || '1.0.0',
  APP_NAME: process.env.APP_NAME || 'Sharely',
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Token refresh settings
  TOKEN_REFRESH_THRESHOLD: 30, // seconds before expiry to refresh
};
