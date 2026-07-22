/* =====================================================================
   TrazaFlor · presentación · enlaces a la caja
   ===================================================================== */
import { BASE_URL } from "@/config";
import type { Lang } from "@/i18n";

/** Enlace relativo dentro de la app (respeta el localStorage del demo). */
export function hrefCaja(id: string): string {
  return `/caja?id=${encodeURIComponent(id)}`;
}

/** URL absoluta para el QR (escaneable desde otro dispositivo).
    Lleva &e=<estado> y &lang= para que el teléfono muestre una timeline
    coherente aunque no comparta el localStorage del presentador. */
export function urlCaja(id: string, estado: number, lang: Lang): string {
  return `${BASE_URL}/caja?id=${encodeURIComponent(id)}&e=${estado}&lang=${lang}`;
}
