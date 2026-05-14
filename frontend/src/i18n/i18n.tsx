import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  translations,
  type Language,
  type TranslationParams,
} from "./translations";

export type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: TranslationParams) => string;
};

export const STORAGE_KEY = "artisan_madina_lang";

export const I18nContext = createContext<I18nContextValue | null>(null);

export function isLanguage(value: unknown): value is Language {
  return value === "FR" || value === "EN";
}

export function getPathValue(source: unknown, path: string): unknown {
  if (!source) return undefined;
  if (!path) return source;

  const parts = path.split(".");
  let current: unknown = source;

  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  return current;
}

export function interpolate(
  template: string,
  params?: TranslationParams
): string {
  if (!params) return template;

  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = params[key];
    return value === undefined || value === null ? "" : String(value);
  });
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem(STORAGE_KEY);
    return isLanguage(savedLanguage) ? savedLanguage : "FR";
  });

  const setLanguage = (nextLanguage: Language) => {
    localStorage.setItem(STORAGE_KEY, nextLanguage);
    setLanguageState(nextLanguage);
  };

  const t = (key: string, params?: TranslationParams): string => {
    const value =
      getPathValue(translations[language], key) ??
      getPathValue(translations.FR, key);

    if (typeof value !== "string") {
      return key;
    }

    return interpolate(value, params);
  };

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language]
  );

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);

  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }

  return ctx;
}