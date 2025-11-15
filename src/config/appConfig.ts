import {config} from './env';

export const appConfig = {
  ...config,
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'hi', 'es'],
  defaultTheme: 'light',
  storageKeys: {
    AUTH_TOKEN: '@sharely:auth_token',
    USER_DATA: '@sharely:user_data',
    THEME: '@sharely:theme',
    LANGUAGE: '@sharely:language',
  },
};

