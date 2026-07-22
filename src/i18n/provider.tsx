"use client";
/* =====================================================================
   TrazaFlor · i18n · provider React
   Reemplaza el motor DOM del POC. Mantiene el idioma vigente en contexto,
   lo persiste en localStorage y expone `t()` ligado al idioma actual.

   SSR-safe: arranca en DEFAULT_LANG (igual en server y primer render de
   cliente → sin mismatch de hidratación) y, ya montado, adopta el idioma
   guardado. Persistencia sin efectos hasta después del montaje.
   ===================================================================== */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DEFAULT_LANG, STORAGE_KEY, esLangValido, type Lang } from "./config";
import { traducir, type Vars } from "./translate";

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, vars?: Vars) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (esLangValido(guardado) && guardado !== lang) setLangState(guardado);
    // solo al montar: adopta la preferencia persistida
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next === "es" ? "es-EC" : "en";
  }, []);

  const t = useCallback(
    (key: string, vars?: Vars) => traducir(lang, key, vars),
    [lang],
  );

  const value = useMemo<I18nContextValue>(
    () => ({ lang, setLang, t }),
    [lang, setLang, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n debe usarse dentro de <I18nProvider>");
  return ctx;
}

/** Atajo cuando solo se necesita traducir. */
export function useT() {
  return useI18n().t;
}
