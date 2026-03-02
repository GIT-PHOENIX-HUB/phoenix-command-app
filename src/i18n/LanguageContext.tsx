import React, { createContext, useContext, useState, useEffect } from 'react';
import { en, es } from './translations';

type Lang = 'en' | 'es';

const translations: Record<Lang, Record<string, string>> = { en, es };

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem('phoenix-lang');
    return saved === 'es' ? 'es' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('phoenix-lang', lang);
  }, [lang]);

  const setLang = (newLang: Lang) => setLangState(newLang);

  const t = (key: string): string =>
    translations[lang][key] ?? translations['en'][key] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
