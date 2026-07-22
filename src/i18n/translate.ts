/* =====================================================================
   TrazaFlor · i18n · función de traducción pura
   Sin DOM, sin estado global: recibe idioma y devuelve la cadena. Hace
   interpolación de {vars}. Testeable en aislamiento. La capa React
   (provider.tsx) inyecta el idioma vigente por contexto.
   ===================================================================== */
import type { Lang } from "./config";
import { DEFAULT_LANG } from "./config";
import { I18N } from "./dictionary";

export type Vars = Record<string, string | number>;

/**
 * Traduce `key` al idioma dado, interpolando {placeholders}. Si falta la
 * clave, cae al idioma por defecto y, en último caso, devuelve la propia
 * clave (visible en desarrollo → delata traducciones faltantes sin romper).
 */
export function traducir(lang: Lang, key: string, vars?: Vars): string {
  const tabla = I18N[lang] ?? I18N[DEFAULT_LANG];
  let str = tabla[key] ?? I18N[DEFAULT_LANG][key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.split(`{${k}}`).join(String(v));
    }
  }
  return str;
}
