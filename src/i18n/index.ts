import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './locales/en/common.json';
import hi from './locales/hi/common.json';
import es from './locales/es/common.json';

const resources = {
  en: {
    translation: en,
  },
  hi: {
    translation: hi,
  },
  es: {
    translation: es,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v3',
});

export default i18n;

