import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback } from 'react';

const LANGUAGE_KEY = '@app_language';

export const useLanguage = () => {
  const { i18n } = useTranslation();

  const changeLanguage = useCallback(
    async (language: 'tr' | 'en') => {
      try {
        await AsyncStorage.setItem(LANGUAGE_KEY, language);
        await i18n.changeLanguage(language);
      } catch (error) {}
    },
    [i18n],
  );

  const getCurrentLanguage = useCallback(() => {
    return i18n.language;
  }, [i18n]);

  return {
    changeLanguage,
    getCurrentLanguage,
    isEnglish: getCurrentLanguage() === 'en',
    isTurkish: getCurrentLanguage() === 'tr',
  };
};
