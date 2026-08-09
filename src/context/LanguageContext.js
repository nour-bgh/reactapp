import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { availableLanguages } from '../i18n/translations';

const LanguageContext = createContext(null);
const STORAGE_KEY = 'dariuni_language';

const getInitialLanguage = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && availableLanguages.some(lang => lang.code === stored)) {
      return stored;
    }
  } catch {
    // ignore localStorage errors
  }
  return 'fr';
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // ignore localStorage errors
    }
  }, [language]);

  const languageData = useMemo(
    () => availableLanguages.find(lang => lang.code === language) || availableLanguages[0],
    [language]
  );

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = languageData.dir;
  }, [language, languageData]);

  const value = useMemo(
    () => ({ language, setLanguage, languageData }),
    [language, languageData]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
