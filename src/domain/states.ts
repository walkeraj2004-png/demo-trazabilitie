/* =====================================================================
   TrazaFlor · dominio · máquina de estados
   9 estados lineales. Solo datos estructurales que NO se traducen
   (hora/actor/lugar/esEscaneo). El texto visible vive en la capa i18n,
   indexado por `key`.

   Regla de negocio: la paletizadora no consolida carga sin el CFE
   emitido, por eso `cfe_emitido` precede a `paletizado`. El cierre de
   DAE es un trámite aduanero aparte y queda al final.
   ===================================================================== */
import type { Estado, EstadoKey } from "./types";

export const ESTADOS: readonly Estado[] = [
  {
    key: "creado",
    evento: { hora: "06:12", actorId: "finca", lugar: "Cayambe" },
    cajaEvento: { hora: "06:12", actorId: "finca", lugar: "Cayambe", esEscaneo: false },
  },
  {
    key: "validado_guia",
    evento: { hora: "08:05", actorId: "agrocalidad", lugar: "Quito" },
    cajaEvento: null,
  },
  {
    key: "etiquetado",
    evento: { hora: "09:30", actorId: "sistema", lugar: "Quito" },
    cajaEvento: { hora: "09:48", actorId: "finca", lugar: "Cayambe", esEscaneo: true },
  },
  {
    key: "recibido_agencia",
    evento: { hora: "14:32", actorId: "agencia", lugar: "Tababela" },
    cajaEvento: { hora: "14:32", actorId: "agencia", lugar: "Tababela", esEscaneo: true },
  },
  {
    key: "cfe_emitido",
    evento: { hora: "15:52", actorId: "agrocalidad", lugar: "Quito" },
    cajaEvento: { hora: "15:52", actorId: "agrocalidad", lugar: "Quito", esEscaneo: false },
  },
  {
    key: "paletizado",
    evento: { hora: "16:10", actorId: "paletizadora", lugar: "Tababela" },
    cajaEvento: { hora: "16:10", actorId: "paletizadora", lugar: "Tababela", esEscaneo: true },
  },
  {
    key: "salida_autorizada",
    evento: { hora: "18:45", actorId: "senae", lugar: "Quito" },
    cajaEvento: null,
  },
  {
    key: "embarcado",
    evento: { hora: "22:05", actorId: "aerolinea", lugar: "Tababela" },
    cajaEvento: { hora: "22:05", actorId: "aerolinea", lugar: "Tababela", esEscaneo: true },
  },
  {
    key: "cerrado",
    evento: { hora: "23:55", actorId: "senae", lugar: "Quito" },
    cajaEvento: null,
  },
] as const;

export const TOTAL_ESTADOS = ESTADOS.length;

/**
 * Índice 0-based de un estado por su key. Derivado de la posición real
 * en ESTADOS (no números fijos), para que un futuro reordenamiento no
 * deje nada apuntando a un estado viejo. Lanza si la key no existe:
 * un typo debe romper en build/test, no en silencio.
 */
export function indiceDeEstado(key: EstadoKey): number {
  const i = ESTADOS.findIndex((e) => e.key === key);
  if (i === -1) throw new Error(`Estado desconocido: ${key}`);
  return i;
}

/** Número de estado (1-based) de una key. */
export function numeroDeEstado(key: EstadoKey): number {
  return indiceDeEstado(key) + 1;
}

/** Normaliza un número arbitrario a un estado válido [1..TOTAL_ESTADOS]. */
export function normalizarEstado(n: number): number {
  if (!Number.isInteger(n) || n < 1) return 1;
  if (n > TOTAL_ESTADOS) return TOTAL_ESTADOS;
  return n;
}
