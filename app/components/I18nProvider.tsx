"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  type Locale,
  translate,
  translateStatus,
} from "@/lib/i18n";
import { translateDomain } from "@/lib/i18n-domain";

interface I18nValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  tStatus: (status: string) => string;
  /** Traduz uma string de DOMÍNIO (PT → idioma); devolve PT se não houver. */
  td: (pt: string) => string;
}

const I18nContext = createContext<I18nValue | null>(null);
const STORAGE_KEY = "vl_locale";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // Restaura a escolha guardada (localStorage, sem servidor) após a hidratação.
  // O setState pós-montagem é intencional: localStorage não existe no SSR, pelo que
  // não pode ir no inicializador do useState sem causar erro de hidratação.
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved && saved !== locale) setLocaleState(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mantém <html lang> coerente com o idioma escolhido.
  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-Hans" : locale;
  }, [locale]);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
  };

  const value: I18nValue = {
    locale,
    setLocale,
    t: (key, vars) => translate(locale, key, vars),
    tStatus: (status) => translateStatus(locale, status),
    td: (pt) => translateDomain(locale, pt),
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n deve ser usado dentro de <I18nProvider>");
  return ctx;
}

/**
 * Renderiza uma string traduzida convertendo **negrito** em <strong>.
 * Permite manter a ênfase coerente entre idiomas sem HTML nas traduções.
 */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={i}>{p.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}
