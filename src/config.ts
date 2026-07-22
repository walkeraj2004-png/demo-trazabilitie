/* =====================================================================
   TrazaFlor · configuración de aplicación
   BASE_URL sale de entorno (NEXT_PUBLIC_BASE_URL). En el POC era una
   constante hardcodeada; aquí se externaliza para que dev/staging/prod
   generen QRs escaneables correctos sin editar código.
   ===================================================================== */

export const APP_NAME = "TrazaFlor";
export const CREDITO = `${APP_NAME} · impulsado por Xpotrack`;

/** URL absoluta del deploy (para QRs escaneables desde un teléfono). */
export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
