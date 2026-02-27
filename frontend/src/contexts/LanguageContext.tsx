import React, { createContext, useContext, useState, useCallback } from 'react';
import { translations, type Language } from '@/i18n/translations';

const VALID_LANGS: Language[] = ['en', 'ru', 'uz'];

function getInitialLang(): Language {
  const stored = localStorage.getItem('lang');
  if (stored && VALID_LANGS.includes(stored as Language)) return stored as Language;
  return 'en';
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLang);

  const setLanguage = useCallback((lang: Language) => {
    localStorage.setItem('lang', lang);
    setLanguageState(lang);
  }, []);

  const t = useCallback((key: string) => {
    return translations[language][key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
