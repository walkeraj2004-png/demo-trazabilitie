/* =====================================================================
   TrazaFlor · i18n · configuración
   ===================================================================== */

export const LANGS = ["es", "en"] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = "es";
export const STORAGE_KEY = "trazaflor_lang";

export function esLangValido(v: unknown): v is Lang {
  return typeof v === "string" && (LANGS as readonly string[]).includes(v);
}
