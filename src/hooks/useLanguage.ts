import {useTranslation} from 'react-i18next';
import {useEffect} from 'react';
import {storageService} from '../services/storage/storageService';
import {Language} from '../types';
import i18n from '../i18n';

export const useLanguage = () => {
  const {t, i18n: i18nInstance} = useTranslation();

  useEffect(() => {
    // Load saved language preference
    const loadLanguage = async () => {
      const savedLanguage = await storageService.getLanguage();
      if (savedLanguage && savedLanguage !== i18nInstance.language) {
        await i18nInstance.changeLanguage(savedLanguage);
      }
    };
    loadLanguage();
  }, [i18nInstance]);

  const changeLanguage = async (language: Language) => {
    await i18nInstance.changeLanguage(language);
    await storageService.setLanguage(language);
  };

  return {
    t,
    language: i18nInstance.language as Language,
    changeLanguage,
  };
};

