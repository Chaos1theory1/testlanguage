import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultLanguage, languageDirections, translations, type Language } from "./translations";

interface LanguageContextValue {
  language: Language;
  direction: "ltr" | "rtl";
  setLanguage: (language: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const isSupportedLanguage = (value: string | null): value is Language => {
  return value === "fr" || value === "ar" || value === "en";
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === "undefined") return defaultLanguage;
    const savedLanguage = window.localStorage.getItem("biotechagro_language");
    return isSupportedLanguage(savedLanguage) ? savedLanguage : defaultLanguage;
  });

  const direction = languageDirections[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    document.body.setAttribute("dir", direction);
    window.localStorage.setItem("biotechagro_language", language);
  }, [language, direction]);

  const value = useMemo<LanguageContextValue>(() => {
    return {
      language,
      direction,
      setLanguage: setLanguageState,
      t: (key: string, fallback?: string) => translations[language][key] || translations.en[key] || fallback || key
    };
  }, [language, direction]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}
