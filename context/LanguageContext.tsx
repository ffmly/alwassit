// --- START OF FILE src/context/LanguageContext.tsx ---
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language } from '../i18n/translations.ts';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['en']) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Automatically update document direction for RTL support (Arabic)
  useEffect(() => {
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    
    // Adjust font family if Arabic (Use a generic legible Arabic font stack)
    if (language === 'ar') {
        document.body.style.fontFamily = "'Tahoma', 'Arial', sans-serif";
    } else {
        document.body.style.fontFamily = ""; // Reset to default
    }
  }, [language]);

  const t = (key: keyof typeof translations['en']) => {
    // Fallback to English if translation key missing in selected lang
    return translations[language][key] || translations['en'][key] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};