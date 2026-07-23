/* =====================================================================
   TrazaFlor · configuración de aplicación
   BASE_URL sale de entorno (NEXT_PUBLIC_BASE_URL). En el POC era una
   constante hardcodeada; aquí se externaliza para que dev/staging/prod
   generen QRs escaneables correctos sin editar código.
   ===================================================================== */

export const APP_NAME = "TrazaFlor";
export const CREDITO = `${APP_NAME} · impulsado por el Sistema de Trazabilidad`;

/** URL absoluta del deploy (para QRs escaneables desde un teléfono). */
export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

/**
 * Subpath del deploy en GitHub Pages (proyecto, no dominio propio):
 * "/demo-trazabilitie" en producción, "" en local. Debe coincidir con
 * `basePath` en next.config.mjs (ambos leen la misma env var). Next
 * antepone este valor solo a <Link>/router; los `src`/`href` escritos a
 * mano ("/assets/...", "/caja?...") necesitan este prefijo explícito.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Antepone BASE_PATH a una ruta absoluta de asset servida desde public/. */
export function assetPath(path: string): string {
  return `${BASE_PATH}${path}`;
}
